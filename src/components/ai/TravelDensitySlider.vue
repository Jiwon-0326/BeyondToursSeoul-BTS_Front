<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Number, default: 50 },
})
const emit = defineEmits(['update:modelValue'])

function onInput(e) {
  emit('update:modelValue', Number(e.target.value))
}

// Corrects thumb label offset so it stays centered over the native range thumb
// Native thumb is ~20px wide; this formula accounts for that drift
const thumbLeft = computed(() => {
  const v = props.modelValue
  return `calc(${v}% + (${10 - v * 0.2}px))`
})

const modeLabel = computed(() => {
  const v = props.modelValue
  if (v <= 20) return { text: '유명 관광지 완전 위주', emoji: '🏛️' }
  if (v <= 40) return { text: '관광지 중심, 로컬 가미', emoji: '🗺️' }
  if (v <= 60) return { text: '관광지 & 로컬 균형', emoji: '⚖️' }
  if (v <= 80) return { text: '로컬 핀 중심, 관광지 가미', emoji: '📍' }
  return { text: '완전 로컬 핀 위주', emoji: '🏘️' }
})

const fillPercent = computed(() => `${props.modelValue}%`)
</script>

<template>
  <div class="slider">
    <div class="slider__endpoints">
      <div class="slider__endpoint">
        <span class="slider__endpoint-icon">🏛️</span>
        <span class="slider__endpoint-label">관광지</span>
      </div>
      <div class="slider__endpoint slider__endpoint--right">
        <span class="slider__endpoint-icon">📍</span>
        <span class="slider__endpoint-label">로컬 핀</span>
      </div>
    </div>

    <div class="slider__track-wrap">
      <div class="slider__track-bg">
        <div class="slider__track-fill" :style="{ width: fillPercent }"></div>
      </div>
      <input
        class="slider__input"
        type="range"
        min="0"
        max="100"
        step="1"
        :value="modelValue"
        @input="onInput"
        aria-label="여행 밀도"
      />
      <div class="slider__thumb-label" :style="{ left: thumbLeft }">
        {{ modelValue }}%
      </div>
    </div>

    <div class="slider__mode">
      <span class="slider__mode-emoji">{{ modeLabel.emoji }}</span>
      <span class="slider__mode-text">{{ modeLabel.text }}</span>
    </div>
  </div>
</template>

<style scoped>
.slider {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.slider__endpoints {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.slider__endpoint {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.slider__endpoint--right {
  align-items: flex-end;
}

.slider__endpoint-icon {
  font-size: 18px;
}

.slider__endpoint-label {
  font-size: 10px;
  color: #aaa;
  font-weight: 500;
}

/* Track */
.slider__track-wrap {
  position: relative;
  height: 36px;
  display: flex;
  align-items: center;
}

.slider__track-bg {
  position: absolute;
  left: 0;
  right: 0;
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
  pointer-events: none;
}

.slider__track-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffd580, #FE9C00);
  border-radius: 3px;
  transition: width 0.05s;
}

.slider__input {
  position: relative;
  width: 100%;
  height: 36px;
  appearance: none;
  background: transparent;
  cursor: pointer;
  z-index: 1;
}

.slider__input::-webkit-slider-thumb {
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid #FE9C00;
  box-shadow: 0 2px 8px rgba(254, 156, 0, 0.35);
  cursor: grab;
  transition: transform 0.1s;
}

.slider__input:active::-webkit-slider-thumb {
  transform: scale(1.15);
  cursor: grabbing;
}

.slider__input::-moz-range-thumb {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid #FE9C00;
  box-shadow: 0 2px 8px rgba(254, 156, 0, 0.35);
  cursor: grab;
}

.slider__input::-webkit-slider-runnable-track { background: transparent; }
.slider__input::-moz-range-track { background: transparent; }

/* Floating label above thumb */
.slider__thumb-label {
  position: absolute;
  top: -4px;
  transform: translateX(-50%) translateY(-100%);
  background: #FE9C00;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 7px;
  border-radius: 6px;
  pointer-events: none;
  white-space: nowrap;
  box-shadow: 0 2px 6px rgba(254, 156, 0, 0.4);
}

.slider__thumb-label::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: #FE9C00;
}

/* Mode description */
.slider__mode {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: #fef9f0;
  border: 1px solid #fde8b8;
  border-radius: 10px;
  padding: 8px 12px;
}

.slider__mode-emoji {
  font-size: 16px;
}

.slider__mode-text {
  font-size: 13px;
  font-weight: 600;
  color: #c97000;
}
</style>
