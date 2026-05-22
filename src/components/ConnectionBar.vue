<script setup lang="ts">
import { useConnection } from '../composables/useConnection'
import SvgIcon from './common/SvgIcon.vue'

const { status, isConnected, isConnecting, reconnectAttempt, errorMessage, connect, disconnect } =
  useConnection()

const statusText: Record<string, string> = {
  disconnected: '未连接',
  connecting: '连接中...',
  connected: '已连接',
  error: '连接错误',
}

const statusColor: Record<string, string> = {
  disconnected: '#9e9e9e',
  connecting: '#ffab00',
  connected: '#00e676',
  error: '#ff1744',
}
</script>

<template>
  <div class="connection-bar">
    <div class="status-dot" :style="{ background: statusColor[status] }" />

    <span class="status-text">{{ statusText[status] || status }}</span>

    <span v-if="isConnecting" class="reconnect-info"> ({{ reconnectAttempt }}/5)</span>
    <span v-if="errorMessage && !isConnected" class="error-msg">{{ errorMessage }}</span>

    <button
      v-if="!isConnected"
      class="btn-connect"
      :disabled="isConnecting"
      @click="connect"
    >
      <SvgIcon name="link" :size="20" />
      <span>连接</span>
    </button>

    <button
      v-else
      class="btn-disconnect"
      @click="disconnect"
    >
      <SvgIcon name="link-off" :size="20" />
      <span>断开</span>
    </button>
  </div>
</template>

<style scoped>
.connection-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-text {
  font-size: 14px;
  color: #b0bec5;
}

.reconnect-info {
  font-size: 12px;
  color: #ffab00;
}

.error-msg {
  font-size: 11px;
  color: #ff5252;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-connect,
.btn-disconnect {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  padding: 6px 14px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  flex-shrink: 0;
  min-width: 44px;
  min-height: 44px;
}

.btn-connect {
  background: #00b8d4;
  color: #fff;
}

.btn-connect:disabled {
  background: #455a64;
  color: #78909c;
  cursor: not-allowed;
}

.btn-disconnect {
  background: rgba(255, 23, 68, 0.2);
  color: #ff5252;
}
</style>
