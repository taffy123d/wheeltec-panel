<script setup lang="ts">
import { computed } from 'vue'
import { useRobotState } from '../composables/useRobotState'
import SvgIcon from './common/SvgIcon.vue'

const { state, lastUpdate } = useRobotState()

const voltagePercent = computed(() => {
  // 12V 为满，10V 为空
  const pct = ((state.value.voltage - 10) / (12.6 - 10)) * 100
  return Math.max(0, Math.min(100, Math.round(pct)))
})

const voltageColor = computed(() => {
  if (voltagePercent.value < 20) return '#ff1744'
  if (voltagePercent.value < 50) return '#ffab00'
  return '#00e676'
})

const speed = computed(() => {
  const v = state.value.linearVelocity
  return Math.sqrt(v.x * v.x + v.y * v.y)
})

function toFixed(v: number, d = 2): string {
  return v.toFixed(d)
}

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 5) return '实时'
  if (s < 60) return `${s}秒前`
  return `${Math.floor(s / 60)}分钟前`
}
</script>

<template>
  <div class="status-panel">
    <h3 class="panel-title">
      <SvgIcon name="info" :size="18" />
      小车状态
    </h3>

    <!-- 电量 -->
    <div class="status-item">
      <SvgIcon name="battery" :size="18" :color="voltageColor" />
      <span class="label">电量</span>
      <span class="value" :style="{ color: voltageColor }">
        {{ toFixed(state.voltage, 2) }}V ({{ voltagePercent }}%)
      </span>
    </div>
    <div class="battery-bar">
      <div
        class="battery-fill"
        :style="{ width: voltagePercent + '%', background: voltageColor }"
      />
    </div>

    <!-- 充电状态 -->
    <div v-if="state.charging" class="status-item">
      <SvgIcon name="charging" :size="18" color="#ffab00" />
      <span class="label">充电中</span>
      <span class="value" style="color: #ffab00">{{ toFixed(state.chargingCurrent, 2) }}A</span>
    </div>

    <!-- 速度 -->
    <div class="status-item">
      <SvgIcon name="speed" :size="18" color="#00e5ff" />
      <span class="label">速度</span>
      <span class="value">{{ toFixed(speed) }} m/s</span>
    </div>

    <div class="status-item">
      <span class="label sub">线速度 X</span>
      <span class="value small">{{ toFixed(state.linearVelocity.x) }}</span>
      <span class="label sub">Y</span>
      <span class="value small">{{ toFixed(state.linearVelocity.y) }}</span>
    </div>

    <div class="status-item">
      <SvgIcon name="compass" :size="18" color="#00e5ff" />
      <span class="label">角速度</span>
      <span class="value">{{ toFixed(state.angularVelocity, 3) }} rad/s</span>
    </div>

    <!-- 位置 -->
    <div class="status-item">
      <SvgIcon name="location" :size="18" color="#00e5ff" />
      <span class="label">位置</span>
      <span class="value small">X:{{ toFixed(state.position.x) }} Y:{{ toFixed(state.position.y) }}</span>
    </div>

    <div class="status-item">
      <span class="label">偏航角</span>
      <span class="value">{{ toFixed((state.heading * 180) / Math.PI, 1) }}°</span>
    </div>

    <!-- 更新时间 -->
    <div class="update-time">
      {{ lastUpdate ? timeAgo(lastUpdate) : '等待数据...' }}
    </div>
  </div>
</template>

<style scoped>
.status-panel {
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

.status-item {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
  font-size: 13px;
}

.label {
  color: #78909c;
  min-width: 44px;
  font-size: 12px;
}

.label.sub {
  min-width: 0;
  font-size: 11px;
  color: #546e7a;
}

.value {
  color: #eceff1;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  font-size: 13px;
}

.value.small {
  font-size: 12px;
}

.battery-bar {
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
  margin-bottom: 8px;
  overflow: hidden;
}

.battery-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.5s;
}

.update-time {
  margin-top: 6px;
  font-size: 11px;
  color: #455a64;
  text-align: right;
}
</style>
