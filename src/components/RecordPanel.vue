<script setup lang="ts">
import { useRobotControl } from '../composables/useRobotControl'
import SvgIcon from './common/SvgIcon.vue'

const { startRecord, stopRecord } = useRobotControl()
</script>

<template>
  <div class="record-panel">
    <h3 class="panel-title">
      <SvgIcon name="record" :size="18" />
      数据记录
    </h3>

    <div class="record-buttons">
      <button
        class="record-btn start"
        @click="startRecord"
      >
        <SvgIcon name="record" :size="24" color="#ff1744" />
        <span>开始记录</span>
      </button>

      <button
        class="record-btn stop"
        @click="stopRecord"
      >
        <SvgIcon name="record-stop" :size="24" />
        <span>停止记录</span>
      </button>
    </div>

    <p class="record-hint">
      记录数据将保存至小车主控，包含里程计、IMU、电量等数据。
    </p>
  </div>
</template>

<style scoped>
.record-panel {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 14px;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
  color: #b0bec5;
}

.record-buttons {
  display: flex;
  gap: 10px;
}

.record-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  min-width: 48px;
  min-height: 48px;
  justify-content: center;
  transition: all 0.15s;
}

.record-btn.start {
  background: rgba(255, 23, 68, 0.15);
  color: #ff5252;
  border: 1px solid rgba(255, 23, 68, 0.3);
}

.record-btn.start:active {
  background: rgba(255, 23, 68, 0.3);
}

.record-btn.stop {
  background: rgba(158, 158, 158, 0.15);
  color: #bdbdbd;
  border: 1px solid rgba(158, 158, 158, 0.3);
}

.record-btn.stop:active {
  background: rgba(158, 158, 158, 0.3);
}

.record-hint {
  margin: 10px 0 0;
  font-size: 12px;
  color: #546e7a;
  line-height: 1.4;
}
</style>
