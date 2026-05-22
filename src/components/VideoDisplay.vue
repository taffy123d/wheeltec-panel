<script setup lang="ts">
import { useConnection } from '../composables/useConnection'
import SvgIcon from './common/SvgIcon.vue'

const { videoUrl, isConnected } = useConnection()
</script>

<template>
  <div class="video-display">
    <div v-if="!isConnected || !videoUrl" class="video-placeholder">
      <SvgIcon name="camera" :size="48" color="#37474f" />
      <span>连接小车后可查看视频</span>
    </div>

    <!-- MJPEG 流由 web_video_server 提供，img 标签原生支持 -->
    <img
      v-else
      :src="videoUrl"
      class="video-stream"
      alt="摄像头视频流"
    />
  </div>
</template>

<style scoped>
.video-display {
  width: 100%;
  height: 100%;
  max-height: 100%;
  aspect-ratio: 4 / 3;
  background: #05080f;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #37474f;
  font-size: 15px;
}

.video-stream {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
}
</style>
