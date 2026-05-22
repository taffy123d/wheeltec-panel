# CLAUDE.md

本项目为 Vue 3 + TypeScript 纯前端项目，通过 Android APK 控制 WheelTec ROS 机器人小车。前端通过 WebSocket/rosbridge 与小车主控通信。

## 常用命令

```bash
npm run dev              # 启动 Vite 开发服务器
npx vue-tsc --build      # TypeScript 类型检查（提交前必须通过）
npx vite build           # 生产构建，输出到 dist/

# APK 打包（构建完成后，最终阶段使用）
npx cap sync android
cd android && ./gradlew assembleDebug
# APK: android/app/build/outputs/apk/debug/app-debug.apk
```

## 技术栈

- **前端框架**: Vue 3 (Composition API + `<script setup>`)
- **语言**: TypeScript
- **构建工具**: Vite
- **APK 打包**: Capacitor 8 (需 JDK 21 + Android SDK 34)
- **后端通信**: WebSocket → rosbridge (rosbridge_suite)
- **状态管理**: 模块级单例 Composable（不使用 Pinia）
- **路由**: 不使用 vue-router（通过 `<component :is>` 预留扩展）

## 架构设计

```
src/
├── components/              # UI 组件
│   ├── common/SvgIcon.vue   # 内联 SVG 图标（禁止 Emoji）
│   ├── Joystick.vue         # 虚拟摇杆
│   ├── DirectionPad.vue     # 方向键
│   ├── EmergencyStop.vue    # 急停按钮
│   ├── VideoDisplay.vue     # MJPEG 视频显示
│   ├── StatusPanel.vue      # 实时状态面板
│   ├── RecordPanel.vue      # 数据记录控制
│   ├── ConnectionBar.vue    # 连接状态栏
│   └── ConfigPanel.vue      # 系统配置
├── composables/             # 全局状态（模块级单例）
│   ├── useConnection.ts     # 连接状态与配置
│   ├── useRobotState.ts     # 小车实时状态
│   ├── useRobotControl.ts   # 控制指令 + 记录命令
│   └── useLocalStorage.ts   # localStorage 响应式封装
├── communication/           # 通信层（与 UI 完全隔离）
│   ├── RosCommunicator.ts   # WebSocket + rosbridge 封装
│   └── types.ts             # ROS 消息类型定义
├── events/
│   └── EventBus.ts          # 发布/订阅事件总线
├── views/
│   └── ControlView.vue      # 主操控视图
├── App.vue                  # 根组件
├── main.ts
└── style.css                # 科技风全局样式
```

### 通信数据流

```
UI组件 → composable → EventBus → RosCommunicator → WebSocket → 小车 rosbridge
                                ↑
UI组件 ← composable ← EventBus ← RosCommunicator ← WebSocket ← 小车
```

### 横屏布局（max-width: 1024px）

```
┌──────────┬───────────────────┬──────────┐
│ Joystick │                  │  Status  │
│   /Dpad  │   VideoDisplay   │  Record  │
│ 急停按钮 │                  │  Config  │
├──────────┴───────────────────┴──────────┤
│           ConnectionBar                 │
└─────────────────────────────────────────┘
```

## ROS 话题约定（SSH 验证小车源码确认）

| 话题/服务 | 消息类型 | 方向 | 说明 |
|-----------|----------|------|------|
| `/cmd_vel` | `geometry_msgs/msg/Twist` | 前端→小车 | 移动控制（线速度、角速度） |
| `/odom` | `nav_msgs/msg/Odometry` | 小车→前端 | 里程计（位置、速度） |
| `/PowerVoltage` | `std_msgs/msg/Float32` | 小车→前端 | 电池电压（V） |
| `/robot_charging_flag` | `std_msgs/msg/Bool` | 小车→前端 | 充电状态 |
| `/robot_charging_current` | `std_msgs/msg/Float32` | 小车→前端 | 充电电流（A） |
| `/imu/data_raw` | `sensor_msgs/msg/Imu` | 小车→前端 | IMU 数据 |
| `/camera/color/image_raw` | `sensor_msgs/msg/Image` | 小车→前端 | 摄像头彩色图像（需启动摄像头节点） |
| `/record/start` | 自定义服务 | 前端→小车 | 启动数据记录 |
| `/record/stop` | 自定义服务 | 前端→小车 | 停止数据记录 |

> 实际电池话题为 `/PowerVoltage`（Float32 电压值），**不是** `sensor_msgs/msg/BatteryState`。

## 小车连接信息

- SSH: `ssh wheeltec@100.122.158.62`（通过 Tailscale 组网）
- 密码: `dongguan`
- 主控: NVIDIA Jetson aarch64, Ubuntu 22.04, ROS 2 Humble
- 工作空间: `/home/wheeltec/wheeltec_ros2/`
- 核心节点: `turn_on_wheeltec_robot` 包中的 `wheeltec_robot_node`
- rosbridge: 需安装 `ros-humble-rosbridge-suite`（尚未安装）
- 视频: `web_video_server-ros2` 包已存在，可提供 MJPEG HTTP 流

## 关键约束

- **图标**: 必须使用 `<SvgIcon>` 内联 SVG，禁止 Unicode Emoji（Android WebView 兼容性）
- **移动端适配**: `max-width: 1024px`、基础字号 ≥ 17px、按钮 ≥ 48×48px、`overscroll-behavior: none`
- **localStorage**: `watch` 必须 `{ deep: true }`，否则数组/对象内部修改不触发写入
- **UI/通信解耦**: UI 层不直接依赖通信层，通过 EventBus 间接通信
- **提交前检查**: `vue-tsc --build` 通过 + `vite build` 成功
