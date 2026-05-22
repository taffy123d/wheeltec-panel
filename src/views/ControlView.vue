<script setup lang="ts">
import { useRobotControl } from '../composables/useRobotControl'
import Joystick from '../components/Joystick.vue'
import DirectionPad from '../components/DirectionPad.vue'
import EmergencyStop from '../components/EmergencyStop.vue'
import VideoDisplay from '../components/VideoDisplay.vue'
import StatusPanel from '../components/StatusPanel.vue'
import RecordPanel from '../components/RecordPanel.vue'
import ConfigPanel from '../components/ConfigPanel.vue'
import ConnectionBar from '../components/ConnectionBar.vue'

const { controlMode } = useRobotControl()
</script>

<template>
  <div class="control-view">
    <!-- 顶部连接状态栏 -->
    <div class="top-bar">
      <ConnectionBar />
    </div>

    <!-- 主体三栏布局 -->
    <div class="main-area">
      <!-- 左侧：操控区 -->
      <div class="left-panel">
        <div class="control-area">
          <Joystick v-if="controlMode === 'joystick'" />
          <DirectionPad v-else />
          <EmergencyStop />
        </div>
      </div>

      <!-- 中央：视频区 -->
      <div class="center-panel">
        <VideoDisplay />
      </div>

      <!-- 右侧：状态 + 记录 + 配置 -->
      <div class="right-panel">
        <StatusPanel />
        <RecordPanel />
        <ConfigPanel />
      </div>
    </div>
  </div>
</template>

<style scoped>
.control-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
  padding: 10px;
  box-sizing: border-box;
  gap: 10px;
}

.top-bar {
  flex-shrink: 0;
}

.main-area {
  flex: 1;
  display: grid;
  grid-template-columns: 180px 1fr 240px;
  gap: 10px;
  min-height: 0;
}

.left-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 12px;
}

.control-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.center-panel {
  display: flex;
  align-items: center;
  justify-content: center;
}

.right-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
}

/* 小屏适配：切换为垂直堆叠 */
@media (max-width: 768px), (max-height: 480px) {
  .main-area {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
  }

  .left-panel {
    flex-direction: row;
    justify-content: center;
    padding: 8px;
  }
}
</style>
