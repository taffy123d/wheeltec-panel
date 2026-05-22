---
name: vue-apk
description: 将 Vue 3 + TypeScript 前端项目打包为 Android APK（Capacitor + Vite），包含环境准备、安全配置和踩坑解决。
triggers:
  - 打包apk
  - 构建apk
  - vue打包
  - 安卓打包
  - apk打包
---

# Vue 项目打包 Android APK

将 Vue 3 + TypeScript + Vite 前端项目通过 Capacitor 打包为 Android APK。

> 本文所有命令中的 `<placeholder>` 需替换为实际值。

## 环境要求

- JDK 21+（[详细安装](references/env-setup.md#jdk-安装)）
- Android SDK 34+（[详细安装](references/env-setup.md#android-sdk-安装)）
- `android/local.properties` 中配置 `sdk.dir`（[路径配置](references/env-setup.md#sdk-路径配置)）

## 首次初始化

```bash
# 1. 安装 Capacitor
npm install @capacitor/core @capacitor/android
npm install @capacitor/cli --save-dev

# 2. 初始化 Android 平台
npx cap init "<应用名称>" <com.example.app> --web-dir=dist
npx cap add android
```

### 配置文件

创建 `capacitor.config.ts`：

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

## Android 安全配置

> **这是连接 HTTP/WebSocket 服务的关键步骤，遗漏会导致 APK 无法通信。**

### 1. AndroidManifest.xml

在 `android/app/src/main/AndroidManifest.xml` 的 `<application>` 标签中添加：

```xml
<application
    android:usesCleartextTraffic="true"
    android:networkSecurityConfig="@xml/network_security_config"
    ...>
```

### 2. network_security_config.xml

创建 `android/app/src/main/res/xml/network_security_config.xml`：

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true" />
</network-security-config>
```

> Android 9+ 默认拦截明文流量，以上两步 + `capacitor.config.ts` 中的 `androidScheme: 'http'` 必须全部配置。

## 每次构建

```bash
npx vite build            # 1. 构建前端
npx cap sync android      # 2. 同步到 Android
cd android && ./gradlew assembleDebug  # 3. 打包 APK
```

输出：`android/app/build/outputs/apk/debug/app-debug.apk`

## 参考文档

- [环境准备详细步骤](references/env-setup.md) — JDK、Android SDK 安装与配置
- [踩坑记录](references/troubleshooting.md) — 常见错误与解决方案
