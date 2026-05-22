# Vue + TypeScript 纯前端项目开发并打包为 Android APK 完整流程

## 一、项目初始化

### 1.1 创建 Vue 项目

```bash
npm create vue@latest my-app
# 选择: TypeScript √, 其他可选（不需要 Router/Pinia 可取消）
cd my-app
npm install
```




---

## 二、纯前端架构决策

### 2.1 不装 vue-router 怎么做多页面？

**方案**：`<component :is>` + `<KeepAlive>` + 响应式 tab 状态

```typescript
// composables/useTabNavigation.ts
import { ref } from 'vue'
const activeTab = ref(0)
export function useTabNavigation() {
  return { activeTab, setTab: (i: number) => activeTab.value = i }
}
```

```vue
<!-- App.vue -->
<KeepAlive>
  <component :is="viewComponents[activeTab]" />
</KeepAlive>
```

**优势**：零依赖、标签页状态自动缓存、无路由匹配开销。

### 2.2 不装 Pinia 怎么做状态管理？

**方案**：模块级单例 Composable

```typescript
// composables/useMyData.ts
import { useLocalStorage } from './useLocalStorage'

// 在模块顶层创建，所有调用方共享同一个 ref
const data = useLocalStorage<MyType[]>('storage-key', [])

export function useMyData() {
  // 返回 computed、action 函数
  return { data, addItem, deleteItem }
}
```

**关键点**：`ref()` 在 composable 函数外部定义，确保整个应用共享同一个实例。这个模式完全替代 Pinia。

### 2.3 localStorage 响应式封装

```typescript
import { ref, watch, type Ref } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  let initial = defaultValue
  try {
    const stored = localStorage.getItem(key)
    if (stored !== null) initial = JSON.parse(stored)
  } catch { /* fall through */ }

  const data = ref<T>(initial) as Ref<T>

  watch(data, (val) => {
    localStorage.setItem(key, JSON.stringify(val))
  }, { deep: true })

  return data
}
```

**注意**：`watch` 的 `deep: true` 是必需的，否则修改数组/对象内部属性不会触发写入。

---

## 三、移动端适配与样式

### 3.1 视口与容器

```html
<!-- index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

```css
#app {
  max-width: 480px;   /* 手机宽度上限 */
  margin: 0 auto;     /* 居中 */
  min-height: 100vh;
}
```


```

### 3.3 底部固定导航栏（适配刘海屏）

```css
.app-footer {
  position: fixed;
  bottom: 0;
  padding-bottom: max(6px, env(safe-area-inset-bottom)); /* 适配 iPhone X+ */
}
```

### 3.4 移动端滚动优化

```css
body {
  overscroll-behavior: none;  /* 禁用下拉刷新 */
}

.app-main {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;  /* iOS 顺滑滚动 */
}
```

---

## 四、图标方案 — 最大的坑 ⚠️

### 4.1 问题现象

浏览器开发时一切正常，但打包 APK 安装到手机后，大量图标无法显示（只看到空白）。

### 4.2 根因

Android WebView 的系统字体对**新版 Unicode Emoji 支持不完整**。像 🩺🩸🥗🤝📱 等较新的 Emoji（Unicode 11.0+），在很多 Android 设备（尤其是国产手机）上缺失对应字形。

### 4.3 解决方案：内联 SVG

创建统一的 SVG 图标组件，完全不依赖系统字体：

```vue
<!-- components/common/SvgIcon.vue -->
<script setup lang="ts">
defineProps<{ name: string; size?: number | string; color?: string }>()

const icons: Record<string, string> = {
  warning: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
  check: 'M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z',
  // ... 按需添加
}
</script>

<template>
  <svg :width="size || 24" :height="size || 24" :fill="color || 'currentColor'" viewBox="0 0 24 24">
    <path v-if="icons[name]" :d="icons[name]" />
  </svg>
</template>
```

### 4.4 SVG Path 来源

推荐资源（搜索 `<icon-name> svg path`）：
- Material Design Icons
- Feather Icons
- Heroicons

统一使用 `viewBox="0 0 24 24"` 便于尺寸管理。

### 4.5 经验总结

- **能用的字符**：✓ (U+2713)、✕ (U+2715)、· (U+00B7)、▸▾ (U+25B8/U+25BE) 等老版 Dingbats 基本没问题
- **不能用的字符**：大部分彩色 Emoji（尤其是 2018 年后新增的）
- **CSS 伪元素中的 Emoji**：同样会挂，需改成 SVG 或 CSS 绘制的圆点/边框
- **原则**：涉及图标一律用 SVG，不要赌系统字体支持

---

## 五、APK 打包流程

### 5.1 环境准备

```bash
# 1. Java 21（Capacitor 8 需要）
sudo apt install openjdk-21-jdk

# 2. Android SDK Command Line Tools
mkdir -p ~/Android/cmdline-tools
cd ~/Android/cmdline-tools
wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
unzip commandlinetools-linux-11076708_latest.zip
mv cmdline-tools latest
rm commandlinetools-linux-11076708_latest.zip

# 3. 安装 SDK 组件
export ANDROID_HOME=~/Android
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager \
  "platform-tools" \
  "build-tools;34.0.0" \
  "platforms;android-34"
```

### 5.2 Capacitor 集成

```bash
cd my-vue-project

# 安装
npm install @capacitor/core @capacitor/cli @capacitor/android

# 初始化（只需一次）
npx cap init "应用名称" com.example.appname --web-dir=dist

# 添加 Android 平台（只需一次）
npx cap add android
```

### 5.3 每次构建 APK 的流程

```bash
# 1. 构建前端
npx vite build

# 2. 同步到 Android 项目
npx cap sync android

# 3. 设置 SDK 路径（首次需要）
echo "sdk.dir=$HOME/Android" > android/local.properties

# 4. 打包 APK
export ANDROID_HOME=$HOME/Android
cd android && ./gradlew assembleDebug

# 输出路径: android/app/build/outputs/apk/debug/app-debug.apk
```

### 5.4 注意事项

- `local.properties` 必须包含正确的 `sdk.dir` 路径，否则 Gradle 找不到 Android SDK
- `gradlew` 可能需要执行权限：`chmod +x android/gradlew`
- **Java 版本必须 ≥ 21**（Capacitor 8 要求），否则编译时报 `无效的源发行版：21`
- 首次 Gradle 构建会下载依赖，耗时较长（3-5 分钟），后续构建快很多

---

## 六、踩坑记录与解决方案

| 坑 | 现象 | 原因 | 解决 |
|----|------|------|------|
| **Emoji 显示为空白** | 浏览器正常，APK 安装后图标消失 | Android WebView 系统字体不支持新版 Unicode Emoji | 全部替换为内联 SVG（见第四章） |
| **Java 版本不匹配** | Gradle 编译报 `无效的源发行版：21` | 系统安装的是 JDK 17，Capacitor 8 需要 JDK 21 | `sudo apt install openjdk-21-jdk` |
| **sdkmanager 未找到** | `sdkmanager: command not found` | Android SDK 未安装，只设置了 ANDROID_HOME 环境变量但目录为空 | 手动下载 cmdline-tools 并安装所需组件 |
| **Gradle 找不到 SDK** | `SDK location not found` | `local.properties` 文件缺失或 `sdk.dir` 路径错误 | 确保 `android/local.properties` 中 `sdk.dir` 指向正确的 Android SDK 根目录 |
| **Gradle 权限不足** | `./gradlew: Permission denied` | gradlew 无执行权限 | `chmod +x android/gradlew` |
| **sudo 不可用** | 需要安装系统包但无 sudo 权限 | 某些开发环境没有 sudo | 手动下载 JDK（如从 Adoptium 下载 tar.gz 解压），Android SDK 直接下载 zip |
| **localStorage 写入不触发** | 修改数组元素后刷新消失 | `ref` 的深层 watch 未开启 | `watch(data, fn, { deep: true })` |
| **双击 tab 状态丢失** | 切换标签页后之前的滚动位置/表单状态丢失 | 未使用 KeepAlive | 用 `<KeepAlive>` 包裹 `<component :is>` |
| **iOS 安全区域遮挡** | 底部导航被 iPhone 底部横条遮挡 | 未处理 safe-area | 使用 `env(safe-area-inset-bottom)` |
| **输入框缩放** | iOS 上点击输入框页面放大 | 字体小于 16px 触发 iOS 自动缩放 | 所有 input 的 `font-size` ≥ 16px |

---

## 七、Git 提交前检查清单

- [ ] `npx vue-tsc --build` 类型检查通过，无 TS 错误
- [ ] `npx vite build` 构建成功
- [ ] 所有图标使用 `<SvgIcon>` 组件，不包含 Unicode Emoji
- [ ] 免责声明文字在 App.vue 顶层渲染，所有页面可见
- [ ] 底部导航有 `safe-area-inset-bottom` 适配
- [ ] `index.html` 中 `lang="zh-CN"`，`title` 已修改
- [ ] `#app` 设置了 `max-width: 480px` 移动端约束
- [ ] 所有 `<button>` 满足最小触控区域 48x48px
- [ ] 基础字号 ≥ 17px
- [ ] 测试：关闭浏览器 → 重新打开 → 数据完整保留

---


