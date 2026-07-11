<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRobotControl } from '../composables/useRobotControl'

const { sendCmdVel, stop } = useRobotControl()

const containerRef = ref<HTMLDivElement>()
const knobRef = ref<HTMLDivElement>()

const knobX = ref(0)
const knobY = ref(0)
const isDragging = ref(false)

// 响应式尺寸：大屏用 160x160，小屏用 130x130
const containerSize = 150
const knobSize = 52
const maxTravel = (containerSize - knobSize) / 2

function getCenter(): { cx: number; cy: number } {
  if (!containerRef.value) return { cx: 0, cy: 0 }
  const rect = containerRef.value.getBoundingClientRect()
  return {
    cx: rect.left + rect.width / 2,
    cy: rect.top + rect.height / 2,
  }
}

function handleStart(e: PointerEvent): void {
  e.preventDefault()
  isDragging.value = true
  ;(e.target as HTMLElement)?.setPointerCapture?.(e.pointerId)
  handleMove(e)
}

function handleMove(e: PointerEvent): void {
  if (!isDragging.value) return
  const { cx, cy } = getCenter()
  let dx = e.clientX - cx
  let dy = e.clientY - cy
  const dist = Math.sqrt(dx * dx + dy * dy)
  if (dist > maxTravel) {
    dx = (dx / dist) * maxTravel
    dy = (dy / dist) * maxTravel
  }
  knobX.value = dx
  knobY.value = dy

  // 转换为速度指令：x 方向 = 线速度，y 方向(反转) = 角速度
  const linearX = (dy / maxTravel) * -0.5 // 上推前进（正）
  const angularZ = (dx / maxTravel) * -1.0 // 右推右转
  sendCmdVel(linearX, angularZ)
}

function handleEnd(): void {
  if (!isDragging.value) return
  isDragging.value = false
  knobX.value = 0
  knobY.value = 0
  stop()
}

onMounted(() => {
  window.addEventListener('pointermove', handleMove)
  window.addEventListener('pointerup', handleEnd)
  window.addEventListener('pointercancel', handleEnd)
})

onUnmounted(() => {
  window.removeEventListener('pointermove', handleMove)
  window.removeEventListener('pointerup', handleEnd)
  window.removeEventListener('pointercancel', handleEnd)
})
</script>

<template>
  <div class="joystick-wrapper">
    <div
      ref="containerRef"
      class="joystick-container"
      @pointerdown="handleStart"
    >
      <div class="joystick-ring" />
      <div class="joystick-arrow arrow-up" />
      <div class="joystick-arrow arrow-down" />
      <div class="joystick-arrow arrow-left" />
      <div class="joystick-arrow arrow-right" />

      <div
        ref="knobRef"
        class="joystick-knob"
        :style="{
          transform: `translate(${knobX}px, ${knobY}px)`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out',
        }"
      />
    </div>
  </div>
</template>

<style scoped>
.joystick-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.joystick-container {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: rgba(0, 229, 255, 0.06);
  border: 2px solid rgba(0, 229, 255, 0.2);
  touch-action: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.joystick-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 1px dashed rgba(0, 229, 255, 0.15);
}

.joystick-arrow {
  position: absolute;
  color: rgba(0, 229, 255, 0.25);
  font-size: 20px;
}

.arrow-up {
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-bottom: 10px solid rgba(0, 229, 255, 0.3);
}

.arrow-down {
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 10px solid rgba(0, 229, 255, 0.3);
}

.arrow-left {
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 7px solid transparent;
  border-bottom: 7px solid transparent;
  border-right: 10px solid rgba(0, 229, 255, 0.3);
}

.arrow-right {
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 7px solid transparent;
  border-bottom: 7px solid transparent;
  border-left: 10px solid rgba(0, 229, 255, 0.3);
}

.joystick-knob {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 52px;
  height: 52px;
  margin: -26px 0 0 -26px;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 40%, #00e5ff, #006064);
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.4), 0 0 40px rgba(0, 184, 212, 0.2);
  cursor: grab;
}

.joystick-knob:active {
  cursor: grabbing;
}

/* 小屏缩小摇杆 */
@media (max-width: 540px) {
  .joystick-container {
    width: 120px;
    height: 120px;
  }
  .joystick-ring {
    width: 80px;
    height: 80px;
  }
  .joystick-knob {
    width: 42px;
    height: 42px;
    margin: -21px 0 0 -21px;
  }
}
</style>
