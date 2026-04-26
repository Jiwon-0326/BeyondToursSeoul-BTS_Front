<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTripStore } from '@/stores/useTripStore'
import TravelDensitySlider from './TravelDensitySlider.vue'
import GenerateLoading from './GenerateLoading.vue'

const emit = defineEmits(['close', 'generated'])
const router = useRouter()
const tripStore = useTripStore()

// ── State ──────────────────────────────────────────────────────────────────
const step = ref('input') // 'input' | 'loading'
const loadingRef = ref(null)

const duration = ref('2박 3일')
const customDuration = ref('')
const density = ref(50)
const interests = ref([])
const travelType = ref('커플')

// ── Options ────────────────────────────────────────────────────────────────
const durationOptions = [
  { label: '1박 2일', days: 2 },
  { label: '2박 3일', days: 3 },
  { label: '3박 4일', days: 4 },
  { label: '직접 입력', days: null },
]

const interestOptions = [
  { id: 'cafe',     icon: '☕', label: '카페' },
  { id: 'food',     icon: '🍜', label: '맛집' },
  { id: 'history',  icon: '🏯', label: '역사/문화' },
  { id: 'nature',   icon: '🌿', label: '자연' },
  { id: 'art',      icon: '🎨', label: '예술/전시' },
  { id: 'kpop',     icon: '🎤', label: 'K-팝/아이돌' },
  { id: 'shopping', icon: '🛍️', label: '쇼핑' },
  { id: 'activity', icon: '🏃', label: '액티비티' },
  { id: 'healing',  icon: '🧘', label: '힐링' },
  { id: 'night',    icon: '🌙', label: '야경/바' },
  { id: 'photo',    icon: '📸', label: '포토스팟' },
  { id: 'local',    icon: '📍', label: '로컬 탐방' },
]

const travelTypes = [
  { id: '혼자', icon: '🧍', label: '혼자' },
  { id: '커플', icon: '💑', label: '커플' },
  { id: '친구', icon: '👯', label: '친구' },
  { id: '가족', icon: '👨‍👩‍👧', label: '가족' },
]

// ── Computed ───────────────────────────────────────────────────────────────
const isCustomDuration = computed(() => duration.value === '직접 입력')

const interestCount = computed(() => interests.value.length)
const atMaxInterests = computed(() => interestCount.value >= 3)

const canGenerate = computed(() =>
  duration.value && interests.value.length > 0 && travelType.value
)

// ── Handlers ───────────────────────────────────────────────────────────────
function toggleInterest(id) {
  const idx = interests.value.indexOf(id)
  if (idx === -1) {
    if (!atMaxInterests.value) interests.value.push(id)
  } else {
    interests.value.splice(idx, 1)
  }
}

async function generate() {
  step.value = 'loading'

  const finalDuration = isCustomDuration.value
    ? customDuration.value || '2박 3일'
    : duration.value

  tripStore.setInput({
    duration: finalDuration,
    density: density.value,
    interests: interests.value,
    travelType: travelType.value,
  })

  await tripStore.generateCourse()
  loadingRef.value?.complete()

  setTimeout(() => {
    emit('generated')
    router.push('/result')
  }, 600)
}

// Touch drag-to-close
const sheetRef = ref(null)
let startY = 0

function onTouchStart(e) {
  startY = e.touches[0].clientY
}

function onTouchEnd(e) {
  const dy = e.changedTouches[0].clientY - startY
  if (dy > 80) emit('close')
}
</script>

<template>
  <Transition name="sheet-overlay">
    <div class="sheet-overlay" @click.self="emit('close')">
      <Transition name="sheet-slide">
        <div
          class="sheet"
          ref="sheetRef"
          @touchstart.passive="onTouchStart"
          @touchend.passive="onTouchEnd"
        >
          <!-- Handle -->
          <div class="sheet__handle-area" @click="emit('close')">
            <div class="sheet__handle"></div>
          </div>

          <!-- Header -->
          <div class="sheet__header">
            <div class="sheet__header-left">
              <span class="sheet__header-icon">✨</span>
              <div>
                <p class="sheet__title">AI 여행 코스 짜기</p>
                <p class="sheet__subtitle">취향을 알려주시면 딱 맞는 코스를 짜드려요</p>
              </div>
            </div>
            <button class="sheet__close" @click="emit('close')" aria-label="닫기">✕</button>
          </div>

          <!-- ── Input step ─────────────────────────────────────────────── -->
          <div v-if="step === 'input'" class="sheet__body">

            <!-- 1. Duration -->
            <section class="sheet__section">
              <div class="sheet__section-label">
                <span class="sheet__step-num">1</span>
                <span class="sheet__step-text">여행 기간</span>
              </div>
              <div class="sheet__chip-row">
                <button
                  v-for="opt in durationOptions"
                  :key="opt.label"
                  class="chip"
                  :class="{ 'chip--active': duration === opt.label }"
                  @click="duration = opt.label"
                >
                  <template v-if="opt.days">
                    <span class="chip__days">{{ opt.days }}일</span>
                    <span class="chip__nights">{{ opt.label }}</span>
                  </template>
                  <template v-else>{{ opt.label }}</template>
                </button>
              </div>
              <Transition name="fade">
                <input
                  v-if="isCustomDuration"
                  v-model="customDuration"
                  class="sheet__text-input"
                  type="text"
                  placeholder="예: 4박 5일"
                  maxlength="10"
                />
              </Transition>
            </section>

            <!-- 2. Density -->
            <section class="sheet__section">
              <div class="sheet__section-label">
                <span class="sheet__step-num">2</span>
                <span class="sheet__step-text">여행 스타일</span>
                <span class="sheet__step-hint">관광지 vs 로컬</span>
              </div>
              <TravelDensitySlider v-model="density" />
            </section>

            <!-- 3. Interests -->
            <section class="sheet__section">
              <div class="sheet__section-label">
                <span class="sheet__step-num">3</span>
                <span class="sheet__step-text">관심사 선택</span>
                <span class="sheet__interest-counter" :class="{ 'sheet__interest-counter--max': atMaxInterests }">
                  {{ interestCount }}<span style="color:#ccc">/3</span>
                </span>
              </div>
              <div class="sheet__interest-grid">
                <button
                  v-for="item in interestOptions"
                  :key="item.id"
                  class="interest-btn"
                  :class="{
                    'interest-btn--active': interests.includes(item.id),
                    'interest-btn--disabled': atMaxInterests && !interests.includes(item.id),
                  }"
                  @click="toggleInterest(item.id)"
                  :disabled="atMaxInterests && !interests.includes(item.id)"
                >
                  <span class="interest-btn__icon">{{ item.icon }}</span>
                  <span class="interest-btn__label">{{ item.label }}</span>
                  <span v-if="interests.includes(item.id)" class="interest-btn__check">✓</span>
                </button>
              </div>
            </section>

            <!-- 4. Travel Type -->
            <section class="sheet__section">
              <div class="sheet__section-label">
                <span class="sheet__step-num">4</span>
                <span class="sheet__step-text">동행 유형</span>
              </div>
              <div class="sheet__chip-row">
                <button
                  v-for="t in travelTypes"
                  :key="t.id"
                  class="travel-type-btn"
                  :class="{ 'travel-type-btn--active': travelType === t.id }"
                  @click="travelType = t.id"
                >
                  <span class="travel-type-btn__icon">{{ t.icon }}</span>
                  <span class="travel-type-btn__label">{{ t.label }}</span>
                </button>
              </div>
            </section>

            <!-- Submit -->
            <button
              class="sheet__submit"
              :class="{ 'sheet__submit--disabled': !canGenerate }"
              :disabled="!canGenerate"
              @click="generate"
            >
              <span class="sheet__submit-icon">✨</span>
              AI가 코스를 생성할게요!
            </button>

            <p v-if="!canGenerate" class="sheet__submit-hint">
              관심사를 1개 이상 선택해 주세요
            </p>
          </div>

          <!-- ── Loading step ────────────────────────────────────────────── -->
          <div v-else class="sheet__body sheet__body--loading">
            <GenerateLoading ref="loadingRef" />
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
/* ─── Overlay ────────────────────────────────────────────────────────────── */
.sheet-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 200;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

/* ─── Sheet ──────────────────────────────────────────────────────────────── */
.sheet {
  width: 100%;
  max-width: 430px;
  background: #fff;
  border-radius: 24px 24px 0 0;
  max-height: 92dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sheet__handle-area {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  padding: 12px 0 4px;
  cursor: pointer;
}

.sheet__handle {
  width: 40px;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
}

/* ─── Header ─────────────────────────────────────────────────────────────── */
.sheet__header {
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 8px 20px 16px;
  border-bottom: 1px solid #f5f5f5;
}

.sheet__header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sheet__header-icon {
  font-size: 28px;
  line-height: 1;
}

.sheet__title {
  font-size: 18px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 2px;
}

.sheet__subtitle {
  font-size: 12px;
  color: #aaa;
  margin: 0;
}

.sheet__close {
  background: #f5f5f5;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  font-size: 14px;
  color: #888;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
  transition: background 0.15s;
}

.sheet__close:hover { background: #ebebeb; }

/* ─── Body ───────────────────────────────────────────────────────────────── */
.sheet__body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 20px 32px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  scrollbar-width: none;
}

.sheet__body::-webkit-scrollbar { display: none; }

.sheet__body--loading {
  justify-content: center;
  align-items: center;
  min-height: 280px;
}

/* ─── Section ────────────────────────────────────────────────────────────── */
.sheet__section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sheet__section-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sheet__step-num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #FE9C00;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sheet__step-text {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
}

.sheet__step-hint {
  font-size: 12px;
  color: #bbb;
  margin-left: auto;
}

.sheet__interest-counter {
  margin-left: auto;
  font-size: 14px;
  font-weight: 800;
  color: #FE9C00;
  transition: color 0.2s;
}

.sheet__interest-counter--max { color: #ef4444; }

/* ─── Duration chips ─────────────────────────────────────────────────────── */
.sheet__chip-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
}

.sheet__chip-row::-webkit-scrollbar { display: none; }

.chip {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 18px;
  border-radius: 14px;
  border: 2px solid #ebebeb;
  background: #fafaf8;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}

.chip--active {
  border-color: #FE9C00;
  background: #fff8ec;
}

.chip__days {
  font-size: 16px;
  font-weight: 800;
  color: #1a1a1a;
  line-height: 1.2;
}

.chip--active .chip__days { color: #FE9C00; }

.chip__nights {
  font-size: 10px;
  color: #aaa;
  margin-top: 2px;
}

.chip--active .chip__nights { color: #c97000; }

/* Custom duration input */
.sheet__text-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #FE9C00;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  outline: none;
  background: #fff8ec;
  color: #1a1a1a;
}

.sheet__text-input::placeholder { color: #ccc; }

/* ─── Interest grid ──────────────────────────────────────────────────────── */
.sheet__interest-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.interest-btn {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 12px 4px 10px;
  border-radius: 12px;
  border: 2px solid #ebebeb;
  background: #fafaf8;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, transform 0.1s;
}

.interest-btn:active { transform: scale(0.93); }

.interest-btn--active {
  border-color: #FE9C00;
  background: #fff8ec;
}

.interest-btn--disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.interest-btn__icon { font-size: 22px; line-height: 1; }

.interest-btn__label {
  font-size: 11px;
  font-weight: 600;
  color: #555;
  text-align: center;
  line-height: 1.2;
}

.interest-btn--active .interest-btn__label { color: #c97000; }

.interest-btn__check {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #FE9C00;
  color: #fff;
  font-size: 9px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ─── Travel type ────────────────────────────────────────────────────────── */
.travel-type-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 8px;
  border-radius: 14px;
  border: 2px solid #ebebeb;
  background: #fafaf8;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  min-width: 0;
}

.travel-type-btn--active {
  border-color: #FE9C00;
  background: #fff8ec;
}

.travel-type-btn__icon { font-size: 22px; line-height: 1; }

.travel-type-btn__label {
  font-size: 12px;
  font-weight: 700;
  color: #555;
}

.travel-type-btn--active .travel-type-btn__label { color: #FE9C00; }

/* ─── Submit ─────────────────────────────────────────────────────────────── */
.sheet__submit {
  width: 100%;
  padding: 17px;
  background: #FE9C00;
  color: #fff;
  border: none;
  border-radius: 16px;
  font-size: 17px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 18px rgba(254, 156, 0, 0.4);
  transition: opacity 0.2s, transform 0.1s;
  letter-spacing: -0.2px;
}

.sheet__submit:active { transform: scale(0.98); opacity: 0.9; }

.sheet__submit--disabled {
  background: #e0e0e0;
  color: #aaa;
  box-shadow: none;
  cursor: not-allowed;
}

.sheet__submit-icon { font-size: 20px; }

.sheet__submit-hint {
  text-align: center;
  font-size: 12px;
  color: #bbb;
  margin: -16px 0 0;
}

/* ─── Transitions ────────────────────────────────────────────────────────── */
.sheet-overlay-enter-active, .sheet-overlay-leave-active {
  transition: background 0.3s;
}
.sheet-overlay-enter-from, .sheet-overlay-leave-to {
  background: rgba(0, 0, 0, 0);
}

.sheet-slide-enter-active {
  transition: transform 0.38s cubic-bezier(0.32, 0.72, 0, 1);
}
.sheet-slide-leave-active {
  transition: transform 0.28s cubic-bezier(0.32, 0.72, 0, 1);
}
.sheet-slide-enter-from, .sheet-slide-leave-to {
  transform: translateY(100%);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s, max-height 0.25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; max-height: 0; }
.fade-enter-to, .fade-leave-from { opacity: 1; max-height: 80px; }
</style>
