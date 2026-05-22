# 环境准备

## JDK 安装

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

## Android SDK 安装

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

## SDK 路径配置

构建前需在 `android/local.properties` 中指定 SDK 路径：

```
# Linux/macOS
sdk.dir=/home/<user>/Android

# Windows（正斜杠）
sdk.dir=C:/Users/<user>/AppData/Local/Android/Sdk
```

> Windows 路径使用正斜杠 `/`，以免 Gradle 解析错误。
