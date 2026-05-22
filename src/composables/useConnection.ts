import { ref, computed } from 'vue'
import { communicator } from '../communication/RosCommunicator'
import { bus } from '../events/EventBus'
import { useLocalStorage } from './useLocalStorage'
import type { ConnectionStatus } from '../communication/types'

// 模块级单例存储配置
const wsUrl = useLocalStorage<string>('wheeltec:wsUrl', 'ws://100.122.158.62:9090')
const videoUrl = useLocalStorage<string>('wheeltec:videoUrl', 'http://100.122.158.62:8080/stream?topic=/camera/color/image_raw')

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

  function updateWsUrl(url: string): void {
    wsUrl.value = url
  }

  function updateVideoUrl(url: string): void {
    videoUrl.value = url
  }

  return {
    status,
    isConnected,
    isConnecting,
    reconnectAttempt,
    errorMessage,
    wsUrl,
    videoUrl,
    connect,
    disconnect,
    updateWsUrl,
    updateVideoUrl,
  }
}
