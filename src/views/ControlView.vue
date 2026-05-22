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
  height: 100dvh;
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
  padding: 6px;
  box-sizing: border-box;
  gap: 6px;
}

.top-bar {
  flex-shrink: 0;
}

.main-area {
  flex: 1;
  display: grid;
  grid-template-columns: 160px 1fr 220px;
  gap: 6px;
  min-height: 0;
}

.left-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 8px;
  overflow-y: auto;
}

.control-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.center-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
}

.right-panel {
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
  font-size: 13px;
}

/* 平板竖屏 / 窄屏 */
@media (max-width: 820px) {
  .control-view {
    padding: 6px;
    gap: 6px;
  }

  .main-area {
    grid-template-columns: 150px 1fr 200px;
    gap: 6px;
  }
}

/* 手机横屏：更紧凑 */
@media (max-width: 740px) {
  .main-area {
    grid-template-columns: 130px 1fr 180px;
    gap: 4px;
  }

  .left-panel {
    padding: 6px;
    gap: 6px;
  }

  .right-panel {
    font-size: 12px;
  }
}

/* 手机竖屏 / 极窄：垂直堆叠 */
@media (max-width: 540px), (max-height: 400px) {
  .control-view {
    height: auto;
    min-height: 100dvh;
    padding: 4px;
    gap: 4px;
  }

  .main-area {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    gap: 4px;
  }

  .left-panel {
    flex-direction: row;
    justify-content: space-evenly;
    padding: 6px;
    gap: 8px;
  }

  .control-area {
    flex-direction: row;
    align-items: center;
    gap: 10px;
  }

  .center-panel {
    order: -1;
  }

  .right-panel {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
    overflow-y: visible;
  }
}
</style>
