import { ref, computed } from 'vue'
import { communicator } from '../communication/RosCommunicator'
import { bus } from '../events/EventBus'
import { useLocalStorage } from './useLocalStorage'
import type { ConnectionStatus } from '../communication/types'

// 模块级单例：只存机器人 IP，端口和路径固定
const robotIp = useLocalStorage<string>('wheeltec:robotIp', '100.122.158.62')

// 自动拼接完整 URL
const wsUrl = computed(() => `ws://${robotIp.value}:9090`)
const videoUrl = computed(() => `http://${robotIp.value}:8080/stream?topic=/image_raw`)

// 模块级单例状态
const status = ref<ConnectionStatus>('disconnected')
const reconnectAttempt = ref(0)
const errorMessage = ref('')

const isConnected = computed(() => status.value === 'connected')
const isConnecting = computed(() => status.value === 'connecting')

// 监听通信层状态变化
bus.on<ConnectionStatus>('ros:status', (s) => {
  status.value = s
})

bus.on<number>('ros:reconnecting', (n) => {
  reconnectAttempt.value = n
})

bus.on('ros:reconnect_failed', () => {
  errorMessage.value = '重连失败，已达最大重试次数'
})

bus.on('ros:error', () => {
  errorMessage.value = 'WebSocket 连接异常'
})

bus.on('ros:connected', () => {
  errorMessage.value = ''
  reconnectAttempt.value = 0
})

bus.on('ros:disconnected', () => {
  errorMessage.value = '连接已断开'
})

export function useConnection() {
  function connect(): void {
    errorMessage.value = ''
    communicator.setUrl(wsUrl.value)
    communicator.connect()
  }

  function disconnect(): void {
    communicator.disconnect()
  }

  function updateRobotIp(ip: string): void {
    robotIp.value = ip
  }

  return {
    status,
    isConnected,
    isConnecting,
    reconnectAttempt,
    errorMessage,
    robotIp,
    wsUrl,
    videoUrl,
    connect,
    disconnect,
    updateRobotIp,
  }
}
