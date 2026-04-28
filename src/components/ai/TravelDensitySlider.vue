<script setup>
import { computed, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Number, default: 50 },
})
const emit = defineEmits(['update:modelValue'])

/** 로컬 비중 % — 5단계만 허용 (메인 100/70/50/30/0 과 대응) */
const SNAP_STOPS = Object.freeze([0, 30, 50, 70, 100])

function snapToNearest(raw) {
  let best = SNAP_STOPS[0]
  let bestDist = Math.abs(raw - best)
  for (const stop of SNAP_STOPS) {
    const d = Math.abs(raw - stop)
    if (d < bestDist) {
      best = stop
      bestDist = d
    }
  }
  return best
}

function stopIndex(value) {
  const i = SNAP_STOPS.indexOf(value)
  if (i >= 0) return i
  return SNAP_STOPS.indexOf(snapToNearest(Number(value)))
}

function moveStop(delta) {
  const i = stopIndex(props.modelValue)
  const next = Math.max(0, Math.min(SNAP_STOPS.length - 1, i + delta))
  if (SNAP_STOPS[next] !== props.modelValue)
    emit('update:modelValue', SNAP_STOPS[next])
}

function onInput(e) {
  emit('update:modelValue', snapToNearest(Number(e.target.value)))
}

function onKeydown(e) {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
    e.preventDefault()
    moveStop(-1)
  } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
    e.preventDefault()
    moveStop(1)
  }
}

watch(
  () => props.modelValue,
  (v) => {
    const n = Number(v)
    if (Number.isNaN(n)) return
    const s = snapToNearest(n)
    if (s !== n) emit('update:modelValue', s)
  },
  { immediate: true },
)

/** 네이티브 range 썸 중심: 트랙 양끝 패딩(썸 반지름)만큼만 이동 구간이 짧아짐 — 채움·라벨 모두 동일 계산으로 맞춤 */
const THUMB_PX = 24

const thumbCenterX = computed(() => {
  const v = props.modelValue
  const half = THUMB_PX / 2
  return `calc(${half}px + (100% - ${THUMB_PX}px) * ${v} / 100)`
})

const MODE_LABELS = Object.freeze({
  0: { text: '유명 관광지 완전 위주', emoji: '🏛️' },
  30: { text: '관광지 중심, 로컬 가미', emoji: '🗺️' },
  50: { text: '관광지 & 로컬 균형', emoji: '⚖️' },
  70: { text: '로컬 핀 중심, 관광지 가미', emoji: '📍' },
  100: { text: '완전 로컬 핀 위주', emoji: '🏘️' },
})

const modeLabel = computed(() => MODE_LABELS[props.modelValue] ?? MODE_LABELS[50])
</script>

<template>
  <div class="slider">
    <div class="slider__endpoints">
      <div class="slider__endpoint">
        <span class="slider__endpoint-icon">🏛️</span>
        <span class="slider__endpoint-label">관광지</span>
      </div>
      <p class="slider__mid-label">{{ modeLabel.text }}</p>
      <div class="slider__endpoint slider__endpoint--right">
        <span class="slider__endpoint-icon">📍</span>
        <span class="slider__endpoint-label">로컬 핀</span>
      </div>
    </div>

    <div class="slider__track-wrap">
      <div class="slider__track-bg">
        <div class="slider__track-fill" :style="{ width: thumbCenterX }"></div>
      </div>
      <!-- 네이티브 썸은 드래그 시 중간 위치를 그리므로 숨기고, 표시만 5단계에 고정 -->
      <div
        class="slider__thumb-dot"
        :style="{ left: thumbCenterX }"
        aria-hidden="true"
      />
      <input
        class="slider__input"
        type="range"
        min="0"
        max="100"
        step="1"
        :value="modelValue"
        @input="onInput"
        @keydown="onKeydown"
        :aria-valuenow="modelValue"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuetext="`로컬 비중 약 ${modelValue}% (관광지 ↔ 로컬 핀)`"
        aria-label="여행 밀도"
      />
      <div class="slider__thumb-label" :style="{ left: thumbCenterX }">
        {{ modelValue }}%
      </div>
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
  gap: 8px;
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

.slider__mid-label {
  margin: 0;
  flex: 1;
  text-align: center;
  font-size: 12px;
  font-weight: 700;
  color: #c97000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  transition: width 0.08s ease;
}

.slider__thumb-dot {
  position: absolute;
  top: 50%;
  width: 24px;
  height: 24px;
  margin-top: -12px;
  margin-left: -12px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid #fe9c00;
  box-shadow: 0 2px 8px rgba(254, 156, 0, 0.35);
  pointer-events: none;
  z-index: 2;
  transition: left 0.08s ease;
}

.slider__input {
  position: relative;
  width: 100%;
  height: 36px;
  appearance: none;
  background: transparent;
  cursor: pointer;
  z-index: 3;
}

/* 히트 영역만 유지 — 보이는 포인터는 .slider__thumb-dot */
.slider__input::-webkit-slider-thumb {
  appearance: none;
  width: 24px;
  height: 24px;
  cursor: grab;
  opacity: 0;
}

.slider__input:active::-webkit-slider-thumb {
  cursor: grabbing;
}

.slider__input::-moz-range-thumb {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  cursor: grab;
  border: none;
  opacity: 0;
}

.slider__input::-webkit-slider-runnable-track { background: transparent; }
.slider__input::-moz-range-track { background: transparent; }

/* Floating label above thumb */
.slider__thumb-label {
  position: absolute;
  top: -4px;
  z-index: 4;
  transform: translateX(-50%) translateY(-100%);
  background: #fe9c00;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 7px;
  border-radius: 6px;
  pointer-events: none;
  white-space: nowrap;
  box-shadow: 0 2px 6px rgba(254, 156, 0, 0.4);
  transition: left 0.08s ease;
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

</style>
