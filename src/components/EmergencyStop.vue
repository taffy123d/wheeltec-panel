<script setup lang="ts">
import { ref } from 'vue'
import { useRobotControl } from '../composables/useRobotControl'
import SvgIcon from './common/SvgIcon.vue'

const { stop } = useRobotControl()
const pressed = ref(false)

function onPress(): void {
  pressed.value = true
  stop()
}

function onRelease(): void {
  pressed.value = false
}
</script>

<template>
  <button
    class="emergency-stop"
    :class="{ pressed }"
    @pointerdown.prevent="onPress"
    @pointerup.prevent="onRelease"
    @pointerleave.prevent="onRelease"
    @pointercancel.prevent="onRelease"
  >
    <SvgIcon name="stop" :size="28" color="#ff1744" />
    <span>急停</span>
  </button>
</template>

<style scoped>
.emergency-stop {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #ff1744;
  background: rgba(255, 23, 68, 0.1);
  color: #ff1744;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  user-select: none;
  touch-action: manipulation;
  transition: all 0.15s;
  -webkit-tap-highlight-color: transparent;
}

.emergency-stop.pressed,
.emergency-stop:active {
  background: rgba(255, 23, 68, 0.35);
  transform: scale(0.92);
  box-shadow: 0 0 24px rgba(255, 23, 68, 0.5);
}
</style>
