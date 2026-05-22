<script setup lang="ts">
import { useConnection } from '../composables/useConnection'
import { useRobotControl } from '../composables/useRobotControl'
import SvgIcon from './common/SvgIcon.vue'

const { wsUrl, videoUrl, updateWsUrl, updateVideoUrl } = useConnection()
const { maxLinearSpeed, maxAngularSpeed, controlMode } = useRobotControl()

function onWsUrlChange(e: Event): void {
  updateWsUrl((e.target as HTMLInputElement).value)
}

function onVideoUrlChange(e: Event): void {
  updateVideoUrl((e.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="config-panel">
    <h3 class="panel-title">
      <SvgIcon name="settings" :size="18" />
      系统配置
    </h3>

    <!-- WebSocket URL -->
    <label class="config-item">
      <span class="label">WebSocket</span>
      <input
        class="config-input"
        type="text"
        :value="wsUrl"
        @change="onWsUrlChange"
      />
    </label>

    <!-- 视频流 URL -->
    <label class="config-item">
      <span class="label">视频流</span>
      <input
        class="config-input"
        type="text"
        :value="videoUrl"
        @change="onVideoUrlChange"
      />
    </label>

    <!-- 速度参数 -->
    <div class="config-item">
      <span class="label">最大线速度</span>
      <span class="value">{{ maxLinearSpeed }} m/s</span>
      <input
        class="range-input"
        type="range"
        min="0.1"
        max="2"
        step="0.1"
        :value="maxLinearSpeed"
        @input="maxLinearSpeed = parseFloat(($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="config-item">
      <span class="label">最大角速度</span>
      <span class="value">{{ maxAngularSpeed }} rad/s</span>
      <input
        class="range-input"
        type="range"
        min="0.2"
        max="3"
        step="0.1"
        :value="maxAngularSpeed"
        @input="maxAngularSpeed = parseFloat(($event.target as HTMLInputElement).value)"
      />
    </div>

    <!-- 操控模式 -->
    <div class="config-item">
      <span class="label">操控模式</span>
      <select
        class="config-select"
        :value="controlMode"
        @change="controlMode = ($event.target as HTMLSelectElement).value as 'joystick' | 'dpad'"
      >
        <option value="joystick">虚拟摇杆</option>
        <option value="dpad">方向键</option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.config-panel {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  padding: 10px 12px;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 600;
  color: #b0bec5;
}

.config-item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  font-size: 13px;
}

.label {
  color: #78909c;
  min-width: 60px;
  font-size: 12px;
}

.value {
  color: #00e5ff;
  font-size: 12px;
  min-width: 50px;
  font-variant-numeric: tabular-nums;
}

.config-input {
  flex: 1;
  min-width: 120px;
  padding: 6px 8px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #eceff1;
  font-size: 12px;
  font-family: 'Cascadia Code', 'Fira Code', monospace;
}

.config-input:focus {
  outline: none;
  border-color: rgba(0, 229, 255, 0.4);
}

.range-input {
  flex: 1;
  accent-color: #00b8d4;
  min-width: 60px;
}

.config-select {
  padding: 6px 8px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #eceff1;
  font-size: 13px;
}
</style>
