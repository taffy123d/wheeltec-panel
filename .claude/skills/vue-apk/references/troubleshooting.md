# 踩坑记录

## 坑 1：`npx cap` 命令找不到

**现象**：`npx cap init` 报 `could not determine executable to run`。

**原因**：`@capacitor/cli` 安装为 dependencies 而非 devDependencies。

**解决**：
```bash
npm install @capacitor/cli --save-dev
```

## 坑 2：APK 安装后无法连接 HTTP/WebSocket

**现象**：浏览器访问正常，APK 安装后 WebSocket/HTTP 连接失败。

**原因**：Android 9+ 默认禁止明文流量，且 Capacitor WebView 的 `https://` scheme 导致混合内容拦截。

**解决**：三步配置：
1. `AndroidManifest.xml` 添加 `usesCleartextTraffic` 和 `networkSecurityConfig`
2. 创建 `network_security_config.xml` 允许明文
3. `capacitor.config.ts` 设置 `androidScheme: 'http'` 和 `allowMixedContent: true`

## 坑 3：Gradle 找不到 Android SDK

**现象**：`./gradlew assembleDebug` 报 `SDK location not found`。

**原因**：`android/local.properties` 缺失或 `sdk.dir` 路径错误。

**解决**：
```bash
echo "sdk.dir=<path-to-sdk>" > android/local.properties
```
Windows 上路径使用正斜杠 `/`，不要用反斜杠 `\`。

## 坑 4：Java 版本不匹配

**现象**：Gradle 编译报 `无效的源发行版` 或 `Unsupported class file major version`。

**原因**：JDK 版本过低。Capacitor 8 要求 JDK 21+。

**解决**：安装 JDK 21+，确保 `JAVA_HOME` 指向正确的版本。

## 坑 5：`local.properties` 路径格式

**现象**：Windows 上 Gradle 报 `文件名、目录名或卷标语法不正确`。

**原因**：`sdk.dir` 使用了反斜杠 `\` 路径。

**解决**：一律使用正斜杠 `/`：
```
# 正确
sdk.dir=C:/Users/<user>/AppData/Local/Android/Sdk

# 错误
sdk.dir=C:\Users\<user>\AppData\Local\Android\Sdk
```
