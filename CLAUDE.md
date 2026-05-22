# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Vue 3 + TypeScript 纯前端项目，用于通过 Android APK 控制 WheelTec ROS 机器人小车。前端通过 WebSocket/rosbridge 与小车主控通信，发送移动指令、接收状态数据、显示摄像头视频流。

## 常用命令

```bash
# 开发
npm run dev              # 启动 Vite 开发服务器

# 类型检查
npx vue-tsc --build      # TypeScript 类型检查（提交前必须通过）

# 构建
npx vite build           # 生产构建，输出到 dist/

# APK 打包（构建完成后）
npx cap sync android     # 同步前端产物到 Android 项目
cd android && ./gradlew assembleDebug  # 打包 debug APK
# APK 输出路径: android/app/build/outputs/apk/debug/app-debug.apk
```

## 技术栈

- **前端框架**: Vue 3 (Composition API + `<script setup>`)
- **语言**: TypeScript
- **构建工具**: Vite
- **APK 打包**: Capacitor 8 (需 JDK 21 + Android SDK 34)
- **后端通信**: WebSocket → rosbridge (rosbridge_suite)
- **状态管理**: 模块级单例 Composable（不使用 Pinia）
- **路由**: `<component :is>` + `<KeepAlive>`（不使用 vue-router）

## 架构设计

项目采用严格的**分层解耦**架构，UI 层与通信层完全隔离：

```
src/
├── components/          # UI 组件
│   └── common/          # 通用组件（SvgIcon 等）
├── composables/         # 全局状态管理（模块级单例 Composable）
├── communication/       # 通信核心模块（与 UI 完全隔离）
│   └── RosCommunicator  # WebSocket 连接管理、rosbridge 协议封装
├── events/              # 事件总线（模块间解耦通信）
└── views/               # 页面视图组件
```

### 核心模块职责

| 模块 | 职责 | 关键约束 |
|------|------|----------|
| **UI 界面模块** | 虚拟摇杆/方向键、急停、视频区、状态显示、数据记录、系统配置 | 不与通信层直接耦合 |
| **全局状态管理** | 连接状态、小车实时状态、记录状态、操控配置 | 使用模块级单例 ref（Composable 外部定义） |
| **事件总线** | 模块间解耦通信、事件订阅/发布/注销 | UI 与通信层通过事件总线间接通信 |
| **通信核心** | WebSocket 连接管理、rosbridge 协议、心跳保活、断网重连 | `RosCommunicator` 独立类，可替换、可测试 |

### 通信规范

- **心跳保活**: 5 秒间隔，防止长连接被回收
- **自动重连**: 最大 5 次
- **协议**: rosbridge (JSON 格式，支持话题发布/订阅/服务调用)

### ROS 话题约定

| 话题/服务 | 消息类型 | 方向 | 说明 |
|-----------|----------|------|------|
| `/cmd_vel` | `geometry_msgs/msg/Twist` | 前端→小车 | 移动控制（线速度、角速度） |
| `/odom` | `nav_msgs/msg/Odometry` | 小车→前端 | 里程计（位置、速度） |
| `/battery_state` | `sensor_msgs/msg/BatteryState` | 小车→前端 | 电量数据 |
| `/record/start` | 自定义服务 | 前端→小车 | 启动数据记录 |
| `/record/stop` | 自定义服务 | 前端→小车 | 停止数据记录 |

### 小车连接信息

- SSH: `ssh wheeltec@100.122.158.62` (通过 Tailscale 组网)
- 密码: `dongguan`
- 主控: 树莓派/Jetson，已烧录 ROS 系统

## 关键约束

### 图标 — 必须使用内联 SVG

Android WebView 对 Unicode Emoji 支持不完整（尤其是 Unicode 11.0+ 的新 Emoji），浏览器正常但 APK 中会显示空白。所有图标必须使用 `<SvgIcon>` 组件（内联 SVG path），禁止使用 Emoji 字符。可用的 Dingbats 字符：`✓ ✕ · ▸ ▾` 等老版字符。

### 移动端/老年用户适配

- `#app` 最大宽度 `480px`，居中显示
- 基础字号 ≥ `17px`，所有 input/button 的 `font-size` 也需 ≥ `17px`（防止 iOS 自动缩放）
- 所有 `<button>` 最小触控区域 `48×48px`
- 底部固定导航需适配 `safe-area-inset-bottom`（刘海屏）
- `viewport` 设置 `user-scalable=no`，`body` 设置 `overscroll-behavior: none`
- `<KeepAlive>` 包裹页面组件，避免切换 tab 后状态丢失

### localStorage 响应式封装

`watch` 必须使用 `{ deep: true }`，否则修改数组/对象内部属性不会触发写入。

### Git 提交前检查

- `npx vue-tsc --build` 通过
- `npx vite build` 成功
- 所有图标使用 `<SvgIcon>`，不含 Unicode Emoji
- 底部导航有 `safe-area-inset-bottom` 适配
- 所有 `<button>` 满足 48×48px 最小触控区域

### APK 打包环境要求

- JDK ≥ 21（Capacitor 8 要求）
- Android SDK platform 34 + build-tools 34.0.0
- `android/local.properties` 中的 `sdk.dir` 必须正确

## 设计决策

- **不使用 vue-router**: 用 `<component :is>` + 响应式 tab 状态实现多页面切换，零依赖
- **不使用 Pinia**: 用模块级单例 Composable（ref 在函数外部定义）替代，所有调用方共享同一实例
- **CSS 预处理器**: 未指定，默认使用纯 CSS 或 CSS 变量（`--fs-base`、`--touch-min` 等）
