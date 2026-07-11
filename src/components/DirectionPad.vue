<script setup lang="ts">
import { useRobotControl } from '../composables/useRobotControl'
import SvgIcon from './common/SvgIcon.vue'

const { startDpadMove, stopDpad, maxLinearSpeed, maxAngularSpeed } = useRobotControl()

function onForwardStart(): void {
  startDpadMove(maxLinearSpeed.value, 0)
}

function onBackwardStart(): void {
  startDpadMove(-maxLinearSpeed.value, 0)
}

function onLeftStart(): void {
  startDpadMove(0, maxAngularSpeed.value)
}

function onRightStart(): void {
  startDpadMove(0, -maxAngularSpeed.value)
}

function onForwardLeftStart(): void {
  startDpadMove(maxLinearSpeed.value * 0.7, maxAngularSpeed.value * 0.7)
}

function onForwardRightStart(): void {
  startDpadMove(maxLinearSpeed.value * 0.7, -maxAngularSpeed.value * 0.7)
}

function onBackwardLeftStart(): void {
  startDpadMove(-maxLinearSpeed.value * 0.7, maxAngularSpeed.value * 0.7)
}

function onBackwardRightStart(): void {
  startDpadMove(-maxLinearSpeed.value * 0.7, -maxAngularSpeed.value * 0.7)
}
</script>

<template>
  <div class="dpad">
    <div class="dpad-row">
      <button
        class="dpad-btn diagonal"
        @pointerdown.prevent="onForwardLeftStart"
        @pointerup.prevent="stopDpad"
        @pointerleave="stopDpad"
      >
        <span>↖</span>
      </button>
      <button
        class="dpad-btn"
        @pointerdown.prevent="onForwardStart"
        @pointerup.prevent="stopDpad"
        @pointerleave="stopDpad"
      >
        <SvgIcon name="arrow-up" :size="28" />
      </button>
      <button
        class="dpad-btn diagonal"
        @pointerdown.prevent="onForwardRightStart"
        @pointerup.prevent="stopDpad"
        @pointerleave="stopDpad"
      >
        <span>↗</span>
      </button>
    </div>
    <div class="dpad-row">
      <button
        class="dpad-btn"
        @pointerdown.prevent="onLeftStart"
        @pointerup.prevent="stopDpad"
        @pointerleave="stopDpad"
      >
        <SvgIcon name="arrow-left" :size="28" />
      </button>
      <div class="dpad-center" />
      <button
        class="dpad-btn"
        @pointerdown.prevent="onRightStart"
        @pointerup.prevent="stopDpad"
        @pointerleave="stopDpad"
      >
        <SvgIcon name="arrow-right" :size="28" />
      </button>
    </div>
    <div class="dpad-row">
      <button
        class="dpad-btn diagonal"
        @pointerdown.prevent="onBackwardLeftStart"
        @pointerup.prevent="stopDpad"
        @pointerleave="stopDpad"
      >
        <span>↙</span>
      </button>
      <button
        class="dpad-btn"
        @pointerdown.prevent="onBackwardStart"
        @pointerup.prevent="stopDpad"
        @pointerleave="stopDpad"
      >
        <SvgIcon name="arrow-down" :size="28" />
      </button>
      <button
        class="dpad-btn diagonal"
        @pointerdown.prevent="onBackwardRightStart"
        @pointerup.prevent="stopDpad"
        @pointerleave="stopDpad"
      >
        <span>↘</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.dpad {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px;
}

.dpad-row {
  display: flex;
  gap: 4px;
}

.dpad-btn {
  width: 58px;
  height: 58px;
  min-width: 48px;
  min-height: 48px;
  border: 1px solid rgba(0, 229, 255, 0.2);
  border-radius: 12px;
  background: rgba(0, 229, 255, 0.08);
  color: #00e5ff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  touch-action: manipulation;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: all 0.1s;
}

.dpad-btn:active {
  background: rgba(0, 229, 255, 0.25);
  box-shadow: 0 0 16px rgba(0, 229, 255, 0.3);
}

.dpad-btn.diagonal {
  width: 48px;
  height: 48px;
  font-size: 18px;
  color: rgba(0, 229, 255, 0.5);
  border-color: rgba(0, 229, 255, 0.1);
}

.dpad-center {
  width: 58px;
  height: 58px;
}
</style>
