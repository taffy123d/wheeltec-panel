---
name: vue-apk
description: 将 Vue 3 + TypeScript 前端项目打包为 Android APK（Capacitor + Vite），包含环境准备、安全配置和踩坑解决。
triggers:
  - 打包apk
  - 构建apk
  - vue打包
  - capacitor
  - 安卓打包
  - apk打包
---

# Vue 项目打包 Android APK

将 Vue 3 + TypeScript + Vite 前端项目通过 Capacitor 打包为 Android APK。

> 本文所有命令中的 `<placeholder>` 需替换为实际值。

## 快速开始

```bash
# 1. 构建前端
npx vite build

# 2. 安装 Capacitor（首次）
npm install @capacitor/core @capacitor/android
npm install @capacitor/cli --save-dev

# 3. 初始化 Android 平台（首次）
npx cap init "<应用名称>" <com.example.app> --web-dir=dist
npx cap add android

# 4. 配置 SDK + 安全策略（首次，见下文）

# 5. 打包
npx cap sync android
cd android && ./gradlew assembleDebug
# 输出: android/app/build/outputs/apk/debug/app-debug.apk
```

## 环境准备

### JDK

需要 JDK 21+（Capacitor 8 要求）。

```bash
# Ubuntu
sudo apt install openjdk-21-jdk

# macOS
brew install openjdk@21

# Windows
# 从 https://adoptium.net 下载安装
```

验证：`java -version` 输出应为 21 或更高。

### Android SDK

```bash
# 1. 下载 Command Line Tools
# https://developer.android.com/studio#command-line-tools-only
# 解压到 ~/Android/cmdline-tools/latest/

# 2. 设置环境变量
export ANDROID_HOME="$HOME/Android"

# 3. 安装组件
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager \
  "platform-tools" \
  "build-tools;<version>" \
  "platforms;android-<api-level>"
```

> `<version>` 推荐 `34.0.0` 或更高，`<api-level>` 推荐 `34` 或更高。

### SDK 路径配置

构建前需在 `android/local.properties` 中指定 SDK 路径：

```
# Linux/macOS
sdk.dir=/home/<user>/Android

# Windows（正斜杠）
sdk.dir=C:/Users/<user>/AppData/Local/Android/Sdk
```

> Windows 路径使用正斜杠 `/`，以免 Gradle 解析错误。

## Capacitor 集成

### 安装

```bash
# @capacitor/core 和 @capacitor/android 作为 dependencies
npm install @capacitor/core @capacitor/android

# @capacitor/cli 必须作为 devDependencies
npm install @capacitor/cli --save-dev
```

> `@capacitor/cli` 放在 devDependencies 才能被 `npx` 正确识别。

### 配置文件

创建 `capacitor.config.ts`（建议加入 `.gitignore`，本地维护）：

```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: '<com.example.app>',
  appName: '<应用名称>',
  webDir: 'dist',
  server: {
    cleartext: true,
    androidScheme: 'http',
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
```

> `androidScheme: 'http'` 和 `allowMixedContent: true` 是 WebSocket/HTTP 明文通信的关键配置。

### 初始化与平台

```bash
npx cap init "<应用名称>" <com.example.app> --web-dir=dist
npx cap add android
```

> 这些只需执行一次。`android/` 目录建议加入 `.gitignore`，由 `cap sync` 自动生成。

## Android 安全配置

> **这是连接 HTTP/WebSocket 服务的关键步骤，遗漏会导致 APK 无法通信。**

### AndroidManifest.xml

在 `android/app/src/main/AndroidManifest.xml` 的 `<application>` 标签中添加：

```xml
<application
    android:usesCleartextTraffic="true"
    android:networkSecurityConfig="@xml/network_security_config"
    ...>
```

### network_security_config.xml

创建 `android/app/src/main/res/xml/network_security_config.xml`：

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true" />
</network-security-config>
```

### 为什么需要

| 问题 | 根因 | 解决 |
|------|------|------|
| APK 内 WebSocket 无法连接 | Android 9+ 默认拦截明文流量 | `usesCleartextTraffic` + `network_security_config` |
| 浏览器正常但 APK 不行 | Capacitor 默认用 `https://localhost` 加载，`ws://` 被当作混合内容拦截 | `androidScheme: 'http'` + `allowMixedContent: true` |

## 每次构建流程

```bash
# 1. 构建前端
npx vite build

# 2. 同步到 Android 项目
npx cap sync android

# 3. 打包 APK
export ANDROID_HOME="<sdk-path>"
cd android && ./gradlew assembleDebug
```

> `local.properties` 只需首次配置。后续构建 `cap sync` 后直接 `gradlew assembleDebug`。

## 踩坑记录

### 坑 1：`npx cap` 命令找不到

**现象**：`npx cap init` 报 `could not determine executable to run`。

**原因**：`@capacitor/cli` 安装为 dependencies 而非 devDependencies。

**解决**：
```bash
npm install @capacitor/cli --save-dev
```

### 坑 2：APK 安装后无法连接 HTTP/WebSocket

**现象**：浏览器访问正常，APK 安装后 WebSocket/HTTP 连接失败。

**原因**：Android 9+ 默认禁止明文流量，且 Capacitor WebView 的 `https://` scheme 导致混合内容拦截。

**解决**：三步配置（见「Android 安全配置」章节）：
1. `AndroidManifest.xml` 添加 `usesCleartextTraffic` 和 `networkSecurityConfig`
2. 创建 `network_security_config.xml` 允许明文
3. `capacitor.config.ts` 设置 `androidScheme: 'http'` 和 `allowMixedContent: true`

### 坑 3：Gradle 找不到 Android SDK

**现象**：`./gradlew assembleDebug` 报 `SDK location not found`。

**原因**：`android/local.properties` 缺失或 `sdk.dir` 路径错误。

**解决**：
```bash
echo "sdk.dir=<path-to-sdk>" > android/local.properties
```
Windows 上路径使用正斜杠 `/`，不要用反斜杠 `\`。

### 坑 4：Java 版本不匹配

**现象**：Gradle 编译报 `无效的源发行版` 或 `Unsupported class file major version`。

**原因**：JDK 版本过低。Capacitor 8 要求 JDK 21+。

**解决**：安装 JDK 21+，确保 `JAVA_HOME` 指向正确的版本。

### 坑 5：`local.properties` 路径格式

**现象**：Windows 上 Gradle 报 `文件名、目录名或卷标语法不正确`。

**原因**：`sdk.dir` 使用了反斜杠 `\` 路径。

**解决**：一律使用正斜杠 `/`：
```
# 正确
sdk.dir=C:/Users/<user>/AppData/Local/Android/Sdk

# 错误
sdk.dir=C:\Users\<user>\AppData\Local\Android\Sdk
```
