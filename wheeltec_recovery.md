# `traffic_light_debug_node.py` 小车端修复记录

本文档记录了对小车端 ROS 2 节点 `traffic_light_debug_node.py` 的两处修复，以使 `/traffic_light/debug_image` 话题能被 `web_video_server` 正常转换并通过 MJPEG 流在前端显示。

## 修复内容

### 修复 1：颜色编码 `bgr8` → `rgb8`

`web_video_server` 只支持 `rgb8` 编码的 `sensor_msgs/Image` 消息，原代码直接发布 `bgr8` 格式，导致 MJPEG 流无法生成（snapshot 和 stream 均返回空数据）。

**改动位置**：函数 `bgr_to_ros_image()`

**原代码**：
```python
def bgr_to_ros_image(frame: np.ndarray, header) -> Image:
    msg = Image()
    msg.header = header
    msg.height, msg.width = frame.shape[:2]
    msg.encoding = "bgr8"
    msg.is_bigendian = 0
    msg.step = msg.width * 3
    msg.data = frame.tobytes()
    return msg
```

**修改后**：
```python
def bgr_to_ros_image(frame: np.ndarray, header) -> Image:
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    msg = Image()
    msg.header = header
    msg.height, msg.width = frame_rgb.shape[:2]
    msg.encoding = "rgb8"
    msg.is_bigendian = 0
    msg.step = msg.width * 3
    msg.data = frame_rgb.tobytes()
    return msg
```

说明：在构建 ROS Image 消息前，用 OpenCV 的 `cv2.cvtColor()` 将 BGR 像素排列转换为 RGB，并将 `encoding` 字段从 `"bgr8"` 改为 `"rgb8"`。

---

### 修复 2：QoS 可靠性 `BEST_EFFORT` → `RELIABLE`

`debug_pub` 发布者原使用 `qos_profile_sensor_data`（即 `BEST_EFFORT`），而 `web_video_server` 默认以 `RELIABLE` 订阅话题。在 ROS 2 DDS 层中，`BEST_EFFORT` 发布者与 `RELIABLE` 订阅者**无法互通**，导致 `web_video_server` 永远收不到任何帧，连接超时后进程崩溃。

**改动位置**：`__init__` 中 `self.debug_pub` 的创建

**原代码**：
```python
self.debug_pub = self.create_publisher(
    Image, "/traffic_light/debug_image", qos_profile_sensor_data
)
```

**修改后**：
```python
self.debug_pub = self.create_publisher(
    Image, "/traffic_light/debug_image", 10
)
```

说明：将 QoS 从 `qos_profile_sensor_data` 改为整数 `10`，即 history depth = 10 的 `RELIABLE` 策略，与 `web_video_server` 的默认订阅 QoS 兼容。

同文件中 `image_sub` 和 `depth_sub` 的订阅仍保留 `qos_profile_sensor_data`（`BEST_EFFORT`），因为摄像头数据对实时性要求高、允许丢帧，不应改变。

---

## 备份

原始文件已备份至同目录：

```
/home/wheeltec/wheeltec_ros2/src/turn_on_wheeltec_robot/scripts/traffic_light_debug_node.py.bak
```

恢复命令：

```bash
cp /home/wheeltec/wheeltec_ros2/src/turn_on_wheeltec_robot/scripts/traffic_light_debug_node.py.bak \
   /home/wheeltec/wheeltec_ros2/src/turn_on_wheeltec_robot/scripts/traffic_light_debug_node.py
```

由于工作空间通过 `--symlink-install` 构建，install 目录下是符号链接指向 src 目录，因此修改源文件后无需重新构建，重启节点即可生效。

---

## 验证方法

修改生效后，可通过以下方式确认：

```bash
# 确认编码为 rgb8
ros2 topic echo /traffic_light/debug_image --once --field encoding

# 确认 QoS 为 RELIABLE
ros2 topic info /traffic_light/debug_image -v | grep -A5 "QoS profile"

# 确认 web_video_server 可以生成快照
curl -o /tmp/debug.jpg http://localhost:8080/snapshot?topic=/traffic_light/debug_image

# 确认 MJPEG 流可以拉取
curl -o /dev/null http://localhost:8080/stream?topic=/traffic_light/debug_image
```

正常输出应为 `encoding: rgb8`、snapshot 返回 `HTTP 200` 且 Size > 0。

---

## 修复 3：摄像头开机自启

原 `wheeltec_frontend.launch.py` 中摄像头默认关闭（`enable_camera:=false`），导致系统重启后 `/image_raw` 话题无人发布，视觉识别节点无法工作。

**改动位置**：`/home/wheeltec/wheeltec_ros2/src/turn_on_wheeltec_robot/launch/wheeltec_frontend.launch.py`

**原代码**（第 38、42 行）：
```python
enable_camera = LaunchConfiguration('enable_camera', default='false')
DeclareLaunchArgument('enable_camera', default_value='false', ...)
```

**修改后**：
```python
enable_camera = LaunchConfiguration('enable_camera', default='true')
DeclareLaunchArgument('enable_camera', default_value='true', ...)
```

由于工作空间用 `--symlink-install` 构建，修改源文件后无需重新 `colcon build`，直接重启服务或系统即可生效。

---

## 新增：`wheeltec-perception.service` 视觉识别开机自启

视觉识别节点（`traffic_light_debug_node` + `traffic_light_velocity_node`）原需手动执行 `autostart_perception_view.sh`，现改为 systemd 服务开机自启。

### 新增文件 1：`/etc/systemd/system/wheeltec-perception.service`

```ini
[Unit]
Description=Wheeltec Robot Perception Service (YOLOv8/TensorRT)
After=network-online.target wheeltec-frontend.service
Wants=network-online.target
Requires=network.target

[Service]
Type=simple
User=wheeltec
Group=wheeltec
WorkingDirectory=/home/wheeltec
ExecStartPre=/bin/sleep 15
ExecStart=/bin/bash /home/wheeltec/wheeltec_perception_service.sh
ExecStop=/bin/bash -c 'source /opt/ros/humble/setup.bash && pkill -f traffic_light || true'
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal
Environment=HOME=/home/wheeltec

[Install]
WantedBy=multi-user.target
```

### 新增文件 2：`/home/wheeltec/wheeltec_perception_service.sh`

```bash
#!/bin/bash
exec > /tmp/wheeltec_perception.log 2>&1
echo "=== Wheeltec Perception Service Start: $(date) ==="

source /opt/ros/humble/setup.bash
source /home/wheeltec/wheeltec_ros2/install/setup.bash

export ROS_DOMAIN_ID=0
export ROS_LOCALHOST_ONLY=0

echo "Starting astra camera for depth..."
ros2 launch turn_on_wheeltec_robot wheeltec_camera.launch.py &
ASTRA_PID=$!
sleep 5

echo "Launching traffic_light_nodes (safe test mode)..."
ros2 launch turn_on_wheeltec_robot traffic_light_nodes.launch.py \
  output_topic:=/traffic_light/cmd_vel_test

wait $ASTRA_PID
```

### 开机启动顺序

```
系统启动
  → wheeltec-frontend.service（底盘 + rosbridge:9090 + web_video:8080 + usb_cam）
    → 等待 10 秒
  → wheeltec-perception.service（YOLO 检测 + 速度节点，安全测试模式）
    → 等待 15 秒（等底盘和摄像头就绪）
```

### 管理命令

```bash
# 查看状态
sudo systemctl status wheeltec-perception

# 手动启停
sudo systemctl start wheeltec-perception    # 启动视觉
sudo systemctl stop wheeltec-perception     # 停止视觉

# 查看日志
journalctl -u wheeltec-perception -n 50
journalctl -u wheeltec-frontend -n 50
```

---

## 已知问题与解决

### web_video_server / rosbridge 重复端口冲突

`web_video_server`（8080）或 `rosbridge_websocket`（9090）若被手动启动后，scheme 服务又自动启动，会导致两个实例抢同一端口，互相冲突后均崩溃。

**症状**：视频画面消失、前端连接断开，但 ROS 话题节点仍在。

**修复方法**：全部由 systemd 管理，无需手动启动：

```bash
# 清理多余进程，统一用 systemd 管理
sudo systemctl restart wheeltec-frontend.service
sudo systemctl restart wheeltec-perception.service

# 确认端口正常
curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/
curl -s -o /dev/null -w '%{http_code}' http://localhost:9090/
```

**根本解决**：systemd 的 `Restart=on-failure` 策略会在服务崩溃后自动重启，依赖链保证启动顺序不乱。

---

## 修复 4：深度摄像头（astra_camera）未随系统启动 → 检测框显示 "no_depth"

前端成功显示带 YOLOv8 检测框的视频后，发现检测框上的距离标签显示 `no_depth`。

### 根因分析

**重要结论：rgb8 编码修改与深度数据丢失无关。** 深度图像编码为 `16UC1`（毫米）或 `32FC1`（米），与 RGB/BGR 编码完全独立。`bgr_to_ros_image()` 中的 rgb8 修改不可能影响深度处理。

真正原因是 **astra_camera（深度摄像头）未被 systemd 启动**：

- `wheeltec_frontend.launch.py` 只启动了 `usb_cam`（普通摄像头），没有启动 astra_camera
- `wheeltec_perception_service.sh` 只启动了 `traffic_light_nodes.launch.py`（YOLO 推理节点）
- `/camera/depth/image_raw` 话题**发布者数为 0**
- `traffic_light_debug_node` 订阅了深度话题但永远收不到数据 → `current_depth()` 返回 None → 显示 "no_depth"

### 代码追踪

```python
# line 862-863 (traffic_light_debug_node.py)
if self.use_depth and distance_m is None:
    active_text = "no_depth"  # ← 这就是 "no_depth" 的来源
```

`distance_m` 为 None 是因为：
```
on_depth() 从未被调用 → last_depth_m = None → current_depth() 返回 None
→ distance_for_detection() 返回 None → 标签显示 "no_depth"
```

### 修复方式

在 `wheeltec_perception_service.sh` 中，启动 YOLO 推理**之前**先启动 astra_camera：

```bash
echo "Starting astra camera for depth..."
ros2 launch turn_on_wheeltec_robot wheeltec_camera.launch.py &
ASTRA_PID=$!
sleep 5
```

`wheeltec_camera.launch.py` 会启动 Gemini 型号的 astra 深度摄像头（已在 launch 文件中预配置好）。

### 修改清单

| 文件 | 位置 | 修改内容 |
|------|------|----------|
| `wheeltec_perception_service.sh` | 小车端 `/home/wheeltec/` | 新增 astra_camera 启动命令 |
| `wheeltec_camera.launch.py` | 小车端（src 中） | 无需修改，已预配置 |

### 验证结果

| 检查项 | 修复前 | 修复后 |
|--------|--------|--------|
| `/camera/depth/image_raw` 发布者 | 0 | 1 (astra_camera_node) |
| depth 订阅者 | 0 | traffic_light_debug_node |
| 深度编码 | N/A | 16UC1 ✅ |
| astra_camera 进程 | 不存在 | 正常运行 |
| 检测框显示 | "no_depth" | 应有距离读数 |

### 开机启动顺序（更新后）

```
系统启动
  → wheeltec-frontend.service（底盘 + rosbridge:9090 + web_video:8080 + usb_cam）
    → 等待 15 秒（ExecStartPre）
  → wheeltec-perception.service
    → astra_camera（深度摄像头）
    → 等待 5 秒
    → traffic_light_nodes（YOLO 检测 + 速度控制，安全测试模式）
```
