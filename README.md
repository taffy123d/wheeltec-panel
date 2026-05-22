# WheelTec 小车操控前端

Vue 3 + TypeScript 横屏操控界面，通过 WebSocket/rosbridge 控制 ROS 2 机器人小车。


## SSH 远程控制（Skill）

项目包含 `.claude/skills/ros2-ssh/`，提供通过 paramiko SSH 远程控制小车的能力,已打包为claude标准skill格式，可单独截取出来并复用

项目已打包为安卓手机app：https://github.com/taffy123d/wheeltec-panel/releases

## 快速开始

```bash
npm install
npm run dev
```

浏览器访问 `http://localhost:5173`，在配置面板输入小车 IP，点击连接即可操控。

## 界面

横屏三栏布局，科技风暗色主题：

```
┌──────────┬───────────────────┬──────────┐
│  摇杆    │                   │ 状态面板 │
│  急停    │   摄像头视频流     │ 速度/电量│
│          │                   │ 记录控制 │
│          │                   │ 系统配置 │
├──────────┴───────────────────┴──────────┤
│              连接状态栏                  │
└─────────────────────────────────────────┘
```

- **摇杆**：点击拖拽控制移动方向和速度，松手即停
- **方向键**：在配置面板切换为 D-pad 模式
- **急停**：红色圆形按钮，按下立即停止
- **视频**：MJPEG 实时摄像头画面
- **配置**：修改小车 IP 自动拼接 WebSocket/视频地址，调整最大速度

## 小车端配置

### 环境要求

| 项目 | 值 |
|------|-----|
| 系统 | Ubuntu 22.04, aarch64 (NVIDIA Jetson) |
| ROS | ROS 2 Humble |
| 依赖 | rosbridge_suite, usb_cam, web_video_server |

### 已编译的包

工作空间 `/home/wheeltec/wheeltec_ros2/`，关键包：
- `turn_on_wheeltec_robot` — 底盘驱动（/odom, /cmd_vel, /PowerVoltage）
- `rosbridge_server` / `rosbridge_library` / `rosapi` — WebSocket 桥接（端口 9090）
- `web_video_server` — MJPEG 视频流（端口 8080）
- `usb_cam` — USB 摄像头驱动
- `astra_camera` — Astra/Orbbec 深度相机驱动（可选）

### 启动

```bash
# 一体化启动（带摄像头）
ros2 launch turn_on_wheeltec_robot wheeltec_frontend.launch.py enable_camera:=true

# 仅底盘 + rosbridge（无摄像头）
ros2 launch turn_on_wheeltec_robot wheeltec_frontend.launch.py
```

### 开机自启

`wheeltec-frontend` systemd 服务已启用：

```bash
sudo systemctl status wheeltec-frontend   # 查看状态
sudo systemctl restart wheeltec-frontend  # 重启
sudo systemctl stop wheeltec-frontend     # 停止
journalctl -u wheeltec-frontend -f        # 日志
```

启动日志：`/tmp/wheeltec_frontend.log`

### 摄像头

当前使用 **Sonix USB 2.0 Camera**（UVC），设备 `/dev/video0`，话题 `/image_raw`。

- 插入摄像头后启动自动识别
- 若换用 Astra 深度相机，改用 `camera_type:=astra`
- web_video_server 自动发现图像话题，MJPEG 地址：`http://<ip>:8080/stream?topic=/image_raw`

## 话题约定

| 话题 | 类型 | 方向 |
|------|------|------|
| `/cmd_vel` | `geometry_msgs/msg/Twist` | 前端 → 小车 |
| `/odom` | `nav_msgs/msg/Odometry` | 小车 → 前端 |
| `/PowerVoltage` | `std_msgs/msg/Float32` | 小车 → 前端 |
| `/robot_charging_flag` | `std_msgs/msg/Bool` | 小车 → 前端 |
| `/robot_charging_current` | `std_msgs/msg/Float32` | 小车 → 前端 |
| `/imu/data_raw` | `sensor_msgs/msg/Imu` | 小车 → 前端 |
| `/image_raw` | `sensor_msgs/msg/Image` | 小车 → 前端 |

## 项目结构

```
src/
├── communication/           # 通信层（与 UI 隔离）
│   ├── RosCommunicator.ts   # WebSocket + rosbridge + 心跳 + 重连
│   └── types.ts             # ROS 消息类型
├── events/
│   └── EventBus.ts          # 发布/订阅事件总线
├── composables/             # 全局状态（模块级单例）
│   ├── useConnection.ts     # 连接管理
│   ├── useRobotState.ts     # 小车实时状态
│   ├── useRobotControl.ts   # 控制指令
│   └── useLocalStorage.ts   # localStorage 响应式封装
├── components/              # UI 组件
│   ├── Joystick.vue         # 虚拟摇杆
│   ├── DirectionPad.vue     # 方向键
│   ├── EmergencyStop.vue    # 急停按钮
│   ├── VideoDisplay.vue     # 视频显示
│   ├── StatusPanel.vue      # 状态面板
│   ├── RecordPanel.vue      # 记录控制
│   ├── ConfigPanel.vue      # 系统配置
│   ├── ConnectionBar.vue    # 连接状态栏
│   └── common/SvgIcon.vue   # SVG 图标
├── views/
│   └── ControlView.vue      # 主操控视图
├── App.vue
├── main.ts
└── style.css
```

## 打包 APK

测试完成后通过 Capacitor 打包：

```bash
npx vite build
npx cap sync android
cd android && ./gradlew assembleDebug
# 输出: android/app/build/outputs/apk/debug/app-debug.apk
```

需要 JDK 21+ + Android SDK 34+。

## SSH 远程控制（Skill）

项目包含 `.claude/skills/wheeltec-ssh/`，提供通过 paramiko SSH 远程控制小车的能力：

```bash
cd .claude/skills/wheeltec-ssh

# 执行远程命令
bash scripts/robot.sh "hostname && df -h"

# ROS2 操作
bash scripts/robot.sh --ros2 "topic list"

# 文件传输
bash scripts/robot.sh --upload ./local.txt /home/wheeltec/remote.txt

# 系统状态
bash scripts/robot.sh --status
```

支持环境变量 `ROBOT_HOST` / `ROBOT_USER` / `ROBOT_PASSWORD` 覆盖默认连接参数。

## 注意事项

- 图标全部使用内联 SVG，**禁止 Emoji**（Android WebView 兼容性）
- 前端不在代码中写死 IP，通过配置面板输入
- 小车 restart 后所有服务自启（包括摄像头），无需手动操作
- SSH 连接小车：`ssh wheeltec@<robot-ip>`（Tailscale 组网）
