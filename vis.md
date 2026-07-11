# WHEELTEC ROS 2 小车视觉识别与控制扩展

本文档用于说明 WHEELTEC 小车原有 ROS 2 工作空间中，由本项目新增的视觉识别、速度控制、模型及启停脚本，并给出安全的启动和结束方式。


## 1. 改动范围

相对小车原厂程序，设计本项目主要文件为**新增的自研文件**。

未改动以下原厂主流程：

- 原厂导航代码
- 原厂底盘运动控制代码
- 原厂主要 launch 流程
- `CMakeLists.txt`（现有安装规则已经能安装 `launch`、`model` 和 Python 脚本）

为了方便区分，下文使用 `[自研新增]` 标记我们的文件。其余未标记的 ROS 2 包和文件均属于小车原有内容。

## 2. 自研文件结构

以下是小车上的实际部署路径

```text
/home/wheeltec/
├── wheeltec_ros2/
│   ├── README.md                                      [自研新增，本说明]
│   └── src/
│       └── turn_on_wheeltec_robot/
│           ├── scripts/
│           │   ├── traffic_light_debug_node.py       [自研新增]
│           │   └── traffic_light_velocity_node.py    [自研新增]
│           ├── launch/
│           │   ├── traffic_light_nodes.launch.py     [自研新增]
│           │   └── traffic_light_color_debug.launch.py [自研新增]
│           └── model/
│               ├── best2.pt                          [自研新增]
│               ├── best2.onnx                        [自研新增]
│               └── best2.engine                      [自研新增]
├── autostart_perception_view.sh                       [自研新增]
├── start_chassis_drive.sh                             [自研新增]
├── start_traffic_light_color_view.sh                  [自研新增]
├── stop_traffic_light.sh                              [自研新增]
└── wheeltec_perception_service.sh                    [自研新增，systemd 专用]
```

另外还有一个 systemd 服务定义（位于小车 `/etc/systemd/system/`）：

```text
/etc/systemd/system/
└── wheeltec-perception.service                       [自研新增，开机自启]
```

注意：`.sh` 脚本应部署在 `/home/wheeltec/`，不在 `wheeltec_ros2` 目录内。当前仓库收入了 `deployment_scripts/`

## 3. 文件说明

### 3.1 ROS 2 节点

| 文件 | 作用 |
| --- | --- |
| `traffic_light_debug_node.py` | 订阅 RGB 和深度图像，使用 YOLOv8/TensorRT 检测交通灯、停车牌、慢行牌和行人；结合目标距离与交通灯颜色生成 `GO`、`SLOW` 或 `STOP`，同时发布标注后的调试画面。 |
| `traffic_light_velocity_node.py` | 订阅识别状态，把 `GO`、`SLOW`、`STOP` 转换成平滑的 `Twist` 速度；状态超时后自动把目标速度降为 0。 |

### 3.2 Launch 文件

| 文件 | 作用 |
| --- | --- |
| `traffic_light_nodes.launch.py` | 同时启动识别节点和速度节点。默认把速度发到测试话题，不直接驱动车辆。 |
| `traffic_light_color_debug.launch.py` | 只启动交通灯颜色识别，不使用深度图，不启动速度节点，因此不会控制小车。 |

### 3.3 模型文件

| 文件 | 作用 |
| --- | --- |
| `best2.pt` | YOLOv8 训练权重，也是在 TensorRT 不可用时的备用推理模型。 |
| `best2.onnx` | 从 PyTorch 权重导出的中间格式，用于生成 TensorRT engine。 |
| `best2.engine` | 小车当前默认使用的 TensorRT FP16 推理模型。该文件与 TensorRT、CUDA 和设备环境有关，换设备后可能需要重新生成。 |

模型类别为：

```text
0: traffic_light
1: stop_sign
2: slow_sign
3: pedestrian
```

### 3.4 一键脚本

| 文件 | 是否驱动车辆 | 作用 |
| --- | --- | --- |
| `autostart_perception_view.sh` | 否 | ⚠️ 启动或复用 RGB、深度相机，启动识别和速度节点，打开调试画面，但只把速度发到测试话题。**与 systemd 服务冲突**，已启用自启时请勿使用。 |
| `start_chassis_drive.sh` | **是** | 检查相机和底盘节点，随后把识别速度接到 `/cmd_vel`。 |
| `start_traffic_light_color_view.sh` | 否 | 只显示红、黄、绿交通灯颜色，不使用深度和速度控制。 |
| `stop_traffic_light.sh` | 停车 | 发布零速度、停止相关节点，并直接向底盘串口发送零速度帧。默认还会停止原厂前端和底盘 ROS 驱动。 |

## 4. 环境与构建

运行环境为 Ubuntu、ROS 2 Humble。节点还依赖 OpenCV、NumPy、`rclpy`、相机相关 ROS 2 包；使用 `best2.engine` 时需要匹配的 CUDA 和 TensorRT，使用 `best2.pt` 时需要 `ultralytics`。

首次拉取代码或修改源码后，在小车终端执行：

```bash
cd /home/wheeltec/wheeltec_ros2
source /opt/ros/humble/setup.bash
colcon build --symlink-install
source install/setup.bash
```

确认自研脚本具有执行权限：

```bash
chmod +x src/turn_on_wheeltec_robot/scripts/traffic_light_debug_node.py
chmod +x src/turn_on_wheeltec_robot/scripts/traffic_light_velocity_node.py
chmod +x /home/wheeltec/autostart_perception_view.sh
chmod +x /home/wheeltec/start_chassis_drive.sh
chmod +x /home/wheeltec/start_traffic_light_color_view.sh
chmod +x /home/wheeltec/stop_traffic_light.sh
chmod +x /home/wheeltec/wheeltec_perception_service.sh
```

## 5. 启动方式

视觉识别可以通过两种方式启动：**开机自启（默认）** 或 **手动脚本**。

### 5.1 开机自启（systemd）— 默认方式

系统安装了两个 systemd 服务，开机后**自动运行**，无需手动操作即可在前端看到 YOLO 检测画面：

```text
系统启动
  → wheeltec-frontend.service（底盘 + rosbridge:9090 + web_video:8080 + usb_cam）
    → 延迟 15s（ExecStartPre）
  → wheeltec-perception.service
    → astra_camera（深度摄像头）：/camera/color/image_raw + /camera/depth/image_raw
    → 延迟 5s
    → traffic_light_nodes（YOLO 检测 + 速度控制，测试模式 /traffic_light/cmd_vel_test）
```

管理命令：

```bash
# 查看视觉服务状态
sudo systemctl status wheeltec-perception

# 手动启停（不影响下次开机自启）
sudo systemctl start wheeltec-perception
sudo systemctl stop wheeltec-perception

# 查看日志
journalctl -u wheeltec-perception -n 50
journalctl -u wheeltec-frontend -n 50

# 禁用/启用开机自启
sudo systemctl disable wheeltec-perception.service
sudo systemctl enable wheeltec-perception.service
```

### 5.2 手动脚本启动（需先停 systemd）

如果要用 `autostart_perception_view.sh` 代替 systemd 自启：

```bash
# 先停掉 systemd 服务
sudo systemctl stop wheeltec-perception.service

# 再用手动脚本
/home/wheeltec/autostart_perception_view.sh
```

此模式会打开识别画面，但**不会驱动小车**。速度只发布到：

```text
/traffic_light/cmd_vel_test
```

先确认识别框、距离、状态和测试速度正常，再进行底盘测试。

### 5.3 ✅ 与 systemd 和谐共处的操作

以下操作在 systemd 自启状态下**安全可用**，不会冲突：

| 操作 | 命令 | 说明 |
|------|------|------|
| **看图** | `ros2 run rqt_image_view rqt_image_view /traffic_light/debug_image` | 纯订阅者，只拉取画面，不影响任何节点 |
| **查看话题** | `ros2 topic echo /traffic_light/state --field data` | 只读操作，不影响 |
| **搭桥开车** | `/home/wheeltec/start_chassis_drive.sh` | 只做 topic remap，不重复启动节点 |
| **查看日志** | `journalctl -u wheeltec-perception -n 50` | 只读日志 |
| **紧急停车** | `/home/wheeltec/stop_traffic_light.sh` | 互补操作 |
| **开关服务** | `sudo systemctl stop/start wheeltec-perception` | 正常管理操作 |

### 5.4 ⚠️ 与 systemd 冲突的操作

以下操作在 systemd 自启状态下**会冲突**，请勿使用：

| 操作 | 冲突原因 |
|------|---------|
| `autostart_perception_view.sh` | 和 `wheeltec-perception.service` 都启动同一批节点，先后启动会报端口/话题冲突 |
| 手动 `ros2 launch traffic_light_nodes.launch.py` | 同上，重复启动 YOLO 节点 + 速度节点 |
| 手动 `ros2 launch wheeltec_camera.launch.py` | 深度摄像头 USB 设备已被 astra_camera 占用 |

**冲突本质**：从 RGB 输入 → YOLO 检测 → 速度输出的整条链路，systemd 已经跑了一份，再跑一份就会：

- 两个节点抢同一话题（消息重复或混乱）
- USB 摄像头设备被占用（启动失败）
- 同端口进程冲突（崩溃）

### 5.5 接入底盘行驶

> 危险：执行后小车可能立即运动。必须先架空车轮或清空车辆周围区域，并确保可以立即执行停止脚本。

无论使用 systemd 自启还是手动脚本启动，接入底盘都执行：

```bash
/home/wheeltec/start_chassis_drive.sh
```

此脚本把速度输出改接到 `/cmd_vel`。

### 5.6 只调试交通灯颜色

```bash
/home/wheeltec/start_traffic_light_color_view.sh
```

此模式只显示 `red_light`、`yellow_light`、`green_light`，不会控制小车。systemd 自启状态下也可安全使用。

### 5.7 手动启动（已停用 systemd 后使用）

安全测试模式：

```bash
cd /home/wheeltec/wheeltec_ros2
source /opt/ros/humble/setup.bash
source install/setup.bash

ros2 launch turn_on_wheeltec_robot traffic_light_nodes.launch.py \
  image_topic:=/camera/color/image_raw \
  output_topic:=/traffic_light/cmd_vel_test
```

手动接入底盘：

```bash
ros2 launch turn_on_wheeltec_robot traffic_light_nodes.launch.py \
  image_topic:=/camera/color/image_raw \
  output_topic:=/cmd_vel
```

只看交通灯颜色：

```bash
ros2 launch turn_on_wheeltec_robot traffic_light_color_debug.launch.py
```

## 6. 结束与紧急停止

一键脚本会在后台启动多个进程，因此关闭终端或只按 `Ctrl+C` 不能保证全部停止。统一使用：

```bash
/home/wheeltec/stop_traffic_light.sh
```

默认停止流程会：

1. 向 `/cmd_vel`、`/red_vel` 和两个交通灯速度话题持续发布零速度。
2. 在停止底盘驱动前，直接向 `/dev/wheeltec_controller` 写入零速度帧。
3. 停止识别、速度、相机、调试画面及可能继续发布速度的导航节点。
4. 停止 `wheeltec-frontend.service` 和底盘 ROS 驱动。
5. 保留串口零速度守护进程，防止残留命令再次驱动车辆。

可选参数：

```bash
# 仅在普通调试中使用：保留原厂前端和底盘驱动
/home/wheeltec/stop_traffic_light.sh --keep-frontend

# 不保留串口零速度守护进程
/home/wheeltec/stop_traffic_light.sh --no-serial-hold
```

紧急停车时不要添加 `--keep-frontend`。重新执行安全启动脚本或底盘启动脚本时，会自动处理上一次留下的零速度守护进程。

若需要单独恢复原厂前端服务：

```bash
sudo systemctl start wheeltec-frontend.service
```

## 7. 主要话题

| 方向 | 话题 | 内容 |
| --- | --- | --- |
| 输入 | `/camera/color/image_raw` | RGB 图像（来自 astra_camera Gemini，编码 rgb8 ✅） |
| 输入 | `/camera/depth/image_raw` | 深度图像（来自 astra_camera Gemini，编码 16UC1） |
| 输出 | `/traffic_light/debug_image` | 带识别框、状态和距离的调试图像 |
| 输出 | `/traffic_light/color` | 交通灯颜色 |
| 输出 | `/traffic_light/state` | `GO`、`GO_HOLD`、`SLOW` 或 `STOP` |
| 输出 | `/traffic_light/cmd_vel_test` | 安全测试速度，不接底盘 |
| 输出 | `/cmd_vel` | 实际底盘速度，仅行驶模式使用 |

> **注**：`/image_raw`（usb_cam）已不再使用。astra_camera Gemini 自带的 RGB 摄像头占用了 USB 设备，现通过 `/camera/color/image_raw` 提供图像源。

控制优先级由高到低为：行人停车、停车牌停车、慢行牌减速、近距离交通灯控制、无有效目标时前进。整合 launch 对 4 类目标的默认有效距离均为 `0.53 m`。

默认速度参数：

```text
cruise_speed     = 0.12 m/s
slow_speed       = 0.05 m/s
accel_limit      = 0.08 m/s^2
decel_limit      = 0.30 m/s^2
state_timeout_sec = 1.5 s
```

## 8. 运行检查

```bash
source /opt/ros/humble/setup.bash
source /home/wheeltec/wheeltec_ros2/install/setup.bash

# 检查各话题频率
ros2 topic hz /camera/color/image_raw
ros2 topic hz /camera/depth/image_raw
ros2 topic hz /traffic_light/debug_image

# 查看当前识别状态和速度
ros2 topic echo /traffic_light/state --field data
ros2 topic echo /traffic_light/cmd_vel_test --field linear.x
```

手动打开识别画面：

```bash
ros2 run rqt_image_view rqt_image_view /traffic_light/debug_image
```

systemd 日志：

```bash
# 视觉服务日志
journalctl -u wheeltec-perception -n 50

# 前端服务日志（底盘、rosbridge、web_video）
journalctl -u wheeltec-frontend -n 50
```

运行日志位于：

```text
/home/wheeltec/autostart_logs/
```


## 9. 当前状态说明

当前链路为：

```text
RGB + 深度图
  -> YOLOv8 detect / TensorRT
  -> 距离与交通灯颜色判断
  -> GO / SLOW / STOP
  -> 平滑速度
  -> 测试话题或 /cmd_vel
```

### 运行模式总结

| 模式 | 启动方式 | 驱动底盘 | 使用场景 |
|------|---------|---------|---------|
| **开机自启**（默认） | 系统启动自动运行 | 否（测试话题） | 日常查看前端画面 |
| **手动测试** | `autostart_perception_view.sh` | 否（测试话题） | 开发调试（需先停 systemd） |
| **搭桥开车** | `start_chassis_drive.sh` | 是 → `/cmd_vel` | 实际行驶时使用（systemd 下安全） |
