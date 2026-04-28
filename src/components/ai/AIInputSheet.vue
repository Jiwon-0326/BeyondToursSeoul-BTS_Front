<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  Camera,
  Car,
  Coffee,
  FileText,
  Footprints,
  Heart,
  Home,
  Landmark,
  Leaf,
  MapPin,
  Moon,
  Music2,
  Palette,
  Plane,
  ShoppingBag,
  Shuffle,
  SkipForward,
  Smartphone,
  Soup,
  Sparkles,
  Train,
  User,
  Users,
  Wifi,
} from 'lucide-vue-next'
import { useTripStore } from '@/stores/useTripStore'
import GenerateLoading from './GenerateLoading.vue'
import TravelDensitySlider from './TravelDensitySlider.vue'
const ticketBoardingPass = new URL(
  '../../../asset/image-Photoroom (2).png',
  import.meta.url,
).href

const emit = defineEmits(['close', 'generated'])
const router = useRouter()
const tripStore = useTripStore()

/** 로컬 기준 YYYY-MM-DD (테스트용 기본 날짜 등) */
function formatLocalIsoDate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const _today = new Date()
const _defaultEnd = new Date(_today)
_defaultEnd.setDate(_defaultEnd.getDate() + 2)

const step = ref('input')
const loadingRef = ref(null)
const flowStage = ref('primary')
const specialRequest = ref('')
const showTopGuide = ref(false)

const startDate = ref(formatLocalIsoDate(_today))
const endDate = ref(formatLocalIsoDate(_defaultEnd))
const arrivalTime = ref('14:00')
const departureTime = ref('10:00')
const partySize = ref(2)
const relationship = ref('친구')
const mobilityMode = ref('public')
const simOption = ref('skip')
const interests = ref([])
/** 슬라이더 0~100 — 값이 클수록 로컬 핀 비중 (↑), 작을수록 관광지 비중 */
const density = ref(50)

const interestOptions = [
  { id: 'cafe', icon: Coffee, color: '#c97000', label: '카페' },
  { id: 'food', icon: Soup, color: '#f97316', label: '맛집' },
  { id: 'history', icon: Landmark, color: '#a16207', label: '역사/문화' },
  { id: 'nature', icon: Leaf, color: '#16a34a', label: '자연' },
  { id: 'art', icon: Palette, color: '#db2777', label: '예술/전시' },
  { id: 'kpop', icon: Music2, color: '#7c3aed', label: 'K-팝/아이돌' },
  { id: 'shopping', icon: ShoppingBag, color: '#0ea5e9', label: '쇼핑' },
  { id: 'activity', icon: Footprints, color: '#ea580c', label: '액티비티' },
  { id: 'healing', icon: Heart, color: '#ef4444', label: '힐링' },
  { id: 'night', icon: Moon, color: '#2563eb', label: '야경/바' },
  { id: 'photo', icon: Camera, color: '#0891b2', label: '포토스팟' },
  { id: 'local', icon: MapPin, color: '#0d9488', label: '로컬 탐방' },
]

const relationshipOptions = [
  { id: '혼자', icon: User, color: '#0ea5e9', label: '혼자' },
  { id: '친구', icon: Users, color: '#6366f1', label: '친구' },
  { id: '가족', icon: Home, color: '#16a34a', label: '가족' },
  { id: '연인', icon: Heart, color: '#e11d48', label: '연인' },
]

const mobilityOptions = [
  { id: 'public', icon: Train, color: '#0284c7', label: '대중교통 중심' },
  { id: 'rental', icon: Car, color: '#f97316', label: '렌트카 중심' },
  { id: 'hybrid', icon: Shuffle, color: '#7c3aed', label: '혼합(상황별)' },
]

const simOptions = [
  { id: 'skip', icon: SkipForward, color: '#64748b', label: '필요 없음' },
  { id: 'esim', icon: Wifi, color: '#0ea5e9', label: 'eSIM 추천' },
  { id: 'sim', icon: Smartphone, color: '#f59e0b', label: 'USIM 추천' },
]

const interestCount = computed(() => interests.value.length)
const atMaxInterests = computed(() => interestCount.value >= 3)
const selectedInterestLabels = computed(() =>
  interestOptions
    .filter((item) => interests.value.includes(item.id))
    .map((item) => item.label),
)
const selectedMobilityLabel = computed(
  () => mobilityOptions.find((item) => item.id === mobilityMode.value)?.label || '대중교통 중심',
)
const selectedSimLabel = computed(
  () => simOptions.find((item) => item.id === simOption.value)?.label || '필요 없음',
)

/** 스토어/API 호환용 — 슬라이더 값을 기존 프리셋 id에 근사 매핑 */
const stylePresetFromSlider = computed(() => {
  const local = density.value
  if (local <= 5) return 'main100'
  if (local <= 35) return 'main70'
  if (local <= 65) return 'balanced'
  if (local <= 90) return 'local70'
  return 'local100'
})

const styleRatioFromSlider = computed(() => ({
  main: 100 - density.value,
  local: density.value,
}))

const needsPartyInput = computed(() =>
  relationship.value === '친구' || relationship.value === '가족',
)

watch(
  relationship,
  (id) => {
    if (id === '혼자') partySize.value = 1
    else if (id === '연인') partySize.value = 2
    else if (id === '친구' || id === '가족') {
      if (partySize.value < 2) partySize.value = 2
    }
  },
  { immediate: true },
)

const PARTY_MIN = 2
const PARTY_MAX = 20

function decrementParty() {
  if (!needsPartyInput.value) return
  if (partySize.value > PARTY_MIN) partySize.value -= 1
}

function incrementParty() {
  if (!needsPartyInput.value) return
  if (partySize.value < PARTY_MAX) partySize.value += 1
}

const canGenerate = computed(() => {
  let okParty = partySize.value >= 1 && partySize.value <= 20
  if (relationship.value === '혼자') okParty = partySize.value === 1
  else if (relationship.value === '연인') okParty = partySize.value === 2
  else if (relationship.value === '친구' || relationship.value === '가족')
    okParty = partySize.value >= 2 && partySize.value <= 20

  return (
    startDate.value &&
    endDate.value &&
    startDate.value <= endDate.value &&
    okParty &&
    relationship.value &&
    mobilityMode.value &&
    simOption.value &&
    interests.value.length > 0
  )
})

const canProceedReview = computed(
  () => flowStage.value === 'detail' && canGenerate.value,
)

const canSubmitGenerate = computed(
  () => flowStage.value === 'review' && canGenerate.value,
)

const canProceedPrimary = computed(() => {
  const d0 = startDate.value.trim()
  const d1 = endDate.value.trim()
  return (
    isValidIsoDateStr(d0) &&
    isValidIsoDateStr(d1) &&
    d0 <= d1 &&
    isValidTimeHm(arrivalTime.value) &&
    isValidTimeHm(departureTime.value)
  )
})

// const season = computed(() => {
//   if (!startDate.value) return ''
//   const month = new Date(startDate.value).getMonth() + 1
//   if ([3, 4, 5].includes(month)) return '봄'
//   if ([6, 7, 8].includes(month)) return '여름'
//   if ([9, 10, 11].includes(month)) return '가을'
//   return '겨울'
// })

const durationLabel = computed(() => {
  if (!startDate.value || !endDate.value || startDate.value > endDate.value) return ''
  const from = new Date(startDate.value)
  const to = new Date(endDate.value)
  const nights = Math.ceil((to - from) / 86400000)
  const days = nights + 1
  return `${nights}박 ${days}일`
})

function toggleInterest(id) {
  const index = interests.value.indexOf(id)
  if (index === -1) {
    if (!atMaxInterests.value) interests.value.push(id)
  } else {
    interests.value.splice(index, 1)
  }
}

async function proceedToDetail() {
  if (!canProceedPrimary.value) return
  flowStage.value = 'detail'
}

function proceedToReview() {
  if (!canProceedReview.value) return
  flowStage.value = 'review'
}

function backToDetail() {
  flowStage.value = 'detail'
}

async function generate() {
  if (!canSubmitGenerate.value) return

  step.value = 'loading'

  tripStore.setInput({
    duration: durationLabel.value || '1박 2일',
    interests: interests.value,
    travelType: relationship.value,
    density: styleRatioFromSlider.value.main,
    dateRange: {
      startDate: startDate.value,
      endDate: endDate.value,
    },
    // season: season.value,
    flight: {
      arrivalTime: arrivalTime.value,
      departureTime: departureTime.value,
    },
    partySize: partySize.value,
    relationship: relationship.value,
    mobilityMode: mobilityMode.value,
    simOption: simOption.value,
    stylePreset: stylePresetFromSlider.value,
    styleRatio: styleRatioFromSlider.value,
    specialRequest: specialRequest.value.trim(),
  })

  await tripStore.generateCourse()
  loadingRef.value?.complete()

  setTimeout(() => {
    emit('generated')
    router.push('/result')
  }, 600)
}

const sheetRef = ref(null)
let startYPoint = 0

function onTouchStart(e) {
  startYPoint = e.touches[0].clientY
}

function onTouchEnd(e) {
  const deltaY = e.changedTouches[0].clientY - startYPoint
  if (deltaY > 80) emit('close')
}

const showTicketModal = computed(
  () => step.value === 'input' && flowStage.value === 'primary',
)

/** 네이티브 date/time 대신 text + inputmode 로 모바일 숫자 키패드 유도 (PC는 OS 제약상 일반 키보드) */
function isValidIsoDateStr(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false
  const t = new Date(`${s}T12:00:00`).getTime()
  return !Number.isNaN(t)
}

function isValidTimeHm(s) {
  const m = /^(\d{1,2}):(\d{2})$/.exec((s || '').trim())
  if (!m) return false
  const h = Number(m[1])
  const min = Number(m[2])
  return h >= 0 && h <= 23 && min >= 0 && min <= 59
}

function normalizeTimeHm(s) {
  const m = /^(\d{1,2}):(\d{2})$/.exec((s || '').trim())
  if (!m) return s
  const h = Math.min(23, Math.max(0, parseInt(m[1], 10)))
  const min = Math.min(59, Math.max(0, parseInt(m[2], 10)))
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`
}

function blurArrivalTime() {
  if (arrivalTime.value) arrivalTime.value = normalizeTimeHm(arrivalTime.value)
}

function blurDepartureTime() {
  if (departureTime.value) departureTime.value = normalizeTimeHm(departureTime.value)
}

function focusStartDate() {
  showTopGuide.value = true
}

function blurStartDate() {
  showTopGuide.value = false
}
</script>

<template>
  <Transition name="sheet-overlay">
    <div
      class="sheet-overlay"
      :class="{ 'sheet-overlay--ticket': showTicketModal }"
      @click.self="emit('close')"
    >
      <Transition name="guide-fade">
        <p v-if="showTicketModal && showTopGuide" class="sheet-top-guide">
          출발일은 항공편 기준으로 입력해 주세요. (YYYY-MM-DD)
        </p>
      </Transition>
      <!-- 1단계: 티켓 이미지 + 어두운 배경, 입력은 흰 영역 -->
      <div v-if="showTicketModal" class="ticket-modal" @click.stop>
        <div class="ticket-modal__pass">
          <img class="ticket-modal__img" :src="ticketBoardingPass" alt="" />
          <div class="ticket-modal__fields">
            <div class="ticket-modal__title-row">
              <p class="ticket-modal__title">
                탑승권
                <span class="ticket-modal__title-sub">BOARDING PASS</span>
              </p>
              <span class="ticket-modal__flight-no">BTS-0724</span>
            </div>
            <div class="ticket-modal__route-row">
              <div class="ticket-modal__route-strip" aria-hidden="true">
                <span class="ticket-modal__airport-code">ICN</span>
                <Plane class="ticket-modal__route-plane" :size="11" :stroke-width="2.3" />
                <span class="ticket-modal__airport-code">GMP</span>
              </div>
              <span class="ticket-modal__route-duration">· {{ durationLabel || '-' }}</span>
            </div>
            <div class="ticket-modal__grid">
              <label class="ticket-modal__field">
                <span class="ticket-modal__label">출발일</span>
                <input
                  v-model="startDate"
                  class="ticket-modal__input"
                  type="text"
                  inputmode="numeric"
                  autocomplete="off"
                  spellcheck="false"
                  enterkeyhint="done"
                  placeholder="YYYY-MM-DD"
                  maxlength="10"
                  @focus="focusStartDate"
                  @blur="blurStartDate"
                />
              </label>
              <label class="ticket-modal__field">
                <span class="ticket-modal__label">도착 시간</span>
                <input
                  v-model="arrivalTime"
                  class="ticket-modal__input"
                  type="text"
                  inputmode="numeric"
                  autocomplete="off"
                  spellcheck="false"
                  enterkeyhint="done"
                  placeholder="HH:MM"
                  maxlength="5"
                  @blur="blurArrivalTime"
                />
              </label>
              <label class="ticket-modal__field">
                <span class="ticket-modal__label">떠나는 날짜</span>
                <input
                  v-model="endDate"
                  class="ticket-modal__input"
                  type="text"
                  inputmode="numeric"
                  autocomplete="off"
                  spellcheck="false"
                  enterkeyhint="done"
                  placeholder="YYYY-MM-DD"
                  maxlength="10"
                />
              </label>
              <label class="ticket-modal__field">
                <span class="ticket-modal__label">출발 시간</span>
                <input
                  v-model="departureTime"
                  class="ticket-modal__input"
                  type="text"
                  inputmode="numeric"
                  autocomplete="off"
                  spellcheck="false"
                  enterkeyhint="done"
                  placeholder="HH:MM"
                  maxlength="5"
                  @blur="blurDepartureTime"
                />
              </label>
            </div>
            <div class="ticket-modal__tearline" aria-hidden="true"></div>
          </div>
          <aside class="ticket-modal__brand-panel" aria-hidden="true">
            <Plane class="ticket-modal__brand-plane" :size="42" :stroke-width="2.1" />
            <div class="ticket-modal__brand-copy">
              <span class="ticket-modal__brand-bts">BTS</span>
              <span class="ticket-modal__brand-sub">Beyond Tours Seoul</span>
            </div>
          </aside>
        </div>
        <button
          class="ticket-modal__next"
          :class="{ 'ticket-modal__next--disabled': !canProceedPrimary }"
          type="button"
          :disabled="!canProceedPrimary"
          @click="proceedToDetail"
        >
          다음 질문 보기
        </button>
      </div>

      <Transition v-else name="sheet-slide">
        <div
          ref="sheetRef"
          class="sheet"
          @touchstart.passive="onTouchStart"
          @touchend.passive="onTouchEnd"
        >
          <div class="sheet__handle-area" @click="emit('close')">
            <div class="sheet__handle"></div>
          </div>

          <div class="sheet__header">
            <div class="sheet__header-left">
              <span class="sheet__header-icon">
                <Sparkles :size="26" :stroke-width="2.3" />
              </span>
              <div>
                <p class="sheet__title">AI 여행 코스 짜기</p>
                <p class="sheet__subtitle">여행 정보와 취향을 알려주시면 맞춤 코스를 생성해요</p>
              </div>
            </div>
            <button class="sheet__close" @click="emit('close')" aria-label="닫기">✕</button>
          </div>

          <div v-if="step === 'input'" class="sheet__body">
            <section v-if="flowStage === 'detail'" class="sheet__section">
              <div class="sheet__section-label">
                <span class="sheet__step-num">2</span>
                <span class="sheet__step-text">동행 유형 · 인원</span>
              </div>
              <div class="sheet__chip-row">
                <button
                  v-for="item in relationshipOptions"
                  :key="item.id"
                  class="travel-type-btn"
                  :class="{ 'travel-type-btn--active': relationship === item.id }"
                  @click="relationship = item.id"
                >
                  <component
                    :is="item.icon"
                    class="travel-type-btn__icon"
                    :size="20"
                    :stroke-width="relationship === item.id ? 2.5 : 2.2"
                    :color="item.color"
                  />
                  <span class="travel-type-btn__label">{{ item.label }}</span>
                </button>
              </div>
              <div class="sheet__party-extra">
                <span class="sheet__field-label">인원 수</span>
                <div
                  class="sheet__stepper"
                  :class="{ 'sheet__stepper--locked': !needsPartyInput }"
                  role="group"
                  aria-label="인원 수 조절"
                  :aria-disabled="!needsPartyInput"
                >
                  <button
                    type="button"
                    class="sheet__stepper-btn"
                    aria-label="한 명 빼기"
                    :disabled="!needsPartyInput || partySize <= PARTY_MIN"
                    @click="decrementParty"
                  >
                    −
                  </button>
                  <span class="sheet__stepper-value">{{ partySize }}명</span>
                  <button
                    type="button"
                    class="sheet__stepper-btn"
                    aria-label="한 명 추가"
                    :disabled="!needsPartyInput || partySize >= PARTY_MAX"
                    @click="incrementParty"
                  >
                    +
                  </button>
                </div>
                <p v-if="!needsPartyInput" class="sheet__party-lock-hint">
                  혼자·연인은 인원이 고정됩니다.
                </p>
              </div>
            </section>

            <section v-if="flowStage === 'detail'" class="sheet__section">
              <div class="sheet__section-label">
                <span class="sheet__step-num">3</span>
                <span class="sheet__step-text">이동 방식</span>
                <span class="sheet__step-hint">코스 동선 전략</span>
              </div>
              <div class="sheet__option-grid">
                <button
                  v-for="item in mobilityOptions"
                  :key="item.id"
                  class="sheet__option-btn"
                  :class="{ 'sheet__option-btn--active': mobilityMode === item.id }"
                  @click="mobilityMode = item.id"
                >
                  <component
                    :is="item.icon"
                    class="sheet__option-icon"
                    :size="20"
                    :stroke-width="mobilityMode === item.id ? 2.5 : 2.2"
                    :color="item.color"
                  />
                  <span class="sheet__option-label">{{ item.label }}</span>
                </button>
              </div>
            </section>

            <section v-if="flowStage === 'detail'" class="sheet__section">
              <div class="sheet__section-label">
                <span class="sheet__step-num">4</span>
                <span class="sheet__step-text">여행 스타일</span>
                <span class="sheet__step-hint">관광지 ↔ 로컬</span>
              </div>
              <TravelDensitySlider v-model="density" />
            </section>

            <section v-if="flowStage === 'detail'" class="sheet__section">
              <div class="sheet__section-label">
                <span class="sheet__step-num">5</span>
                <span class="sheet__step-text">테마 선택</span>
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
                  :disabled="atMaxInterests && !interests.includes(item.id)"
                  @click="toggleInterest(item.id)"
                >
                  <component
                    :is="item.icon"
                    class="interest-btn__icon"
                    :size="22"
                    :stroke-width="interests.includes(item.id) ? 2.5 : 2.2"
                    :color="item.color"
                  />
                  <span class="interest-btn__label">{{ item.label }}</span>
                  <span v-if="interests.includes(item.id)" class="interest-btn__check">✓</span>
                </button>
              </div>
            </section>

            <button
              v-if="flowStage === 'detail'"
              class="sheet__submit"
              :class="{ 'sheet__submit--disabled': !canProceedReview }"
              :disabled="!canProceedReview"
              @click="proceedToReview"
            >
              <span class="sheet__submit-icon">
                <FileText :size="20" :stroke-width="2.4" color="#fff" />
              </span>
              입력 내용 확인하기
            </button>

            <p v-if="flowStage === 'detail' && !canProceedReview" class="sheet__submit-hint">
              동행·인원·테마·스타일을 모두 입력해 주세요
            </p>

            <section v-if="flowStage === 'review'" class="sheet__section sheet__review">
              <div class="sheet__section-label">
                <span class="sheet__step-num">6</span>
                <span class="sheet__step-text">입력 내용 확인</span>
              </div>

              <div class="sheet__summary-card">
                <div class="sheet__summary-row">
                  <span class="sheet__summary-key">여행 기간</span>
                  <span class="sheet__summary-value">{{ startDate }} ~ {{ endDate }} · {{ durationLabel }}</span>
                </div>
                <div class="sheet__summary-row">
                  <span class="sheet__summary-key">비행 시간</span>
                  <span class="sheet__summary-value">도착 {{ arrivalTime }} · 출발 {{ departureTime }}</span>
                </div>
                <div class="sheet__summary-row">
                  <span class="sheet__summary-key">동행/인원</span>
                  <span class="sheet__summary-value">{{ relationship }} · {{ partySize }}명</span>
                </div>
                <div class="sheet__summary-row">
                  <span class="sheet__summary-key">여행 스타일</span>
                  <span class="sheet__summary-value">로컬 {{ density }}% · 관광지 {{ 100 - density }}%</span>
                </div>
                <div class="sheet__summary-row">
                  <span class="sheet__summary-key">이동 방식</span>
                  <span class="sheet__summary-value">{{ selectedMobilityLabel }}</span>
                </div>
                <div class="sheet__summary-row">
                  <span class="sheet__summary-key">테마</span>
                  <span class="sheet__summary-value">{{ selectedInterestLabels.join(', ') }}</span>
                </div>
                <div class="sheet__summary-row">
                  <span class="sheet__summary-key">유심</span>
                  <span class="sheet__summary-value">{{ selectedSimLabel }}</span>
                </div>
              </div>

              <section class="sheet__section sheet__section--compact">
                <div class="sheet__section-label">
                  <span class="sheet__step-text">유심/연결 옵션</span>
                  <span class="sheet__step-hint">선택 사항</span>
                </div>
                <div class="sheet__option-grid sheet__option-grid--sim">
                  <button
                    v-for="item in simOptions"
                    :key="item.id"
                    class="sheet__option-btn"
                    :class="{ 'sheet__option-btn--active': simOption === item.id }"
                    @click="simOption = item.id"
                  >
                    <component
                      :is="item.icon"
                      class="sheet__option-icon"
                      :size="20"
                      :stroke-width="simOption === item.id ? 2.5 : 2.2"
                      :color="item.color"
                    />
                    <span class="sheet__option-label">{{ item.label }}</span>
                  </button>
                </div>
              </section>

              <label class="sheet__field">
                <span class="sheet__field-label">특이사항 / 추가 요청사항 (선택)</span>
                <textarea
                  v-model="specialRequest"
                  class="sheet__textarea"
                  maxlength="300"
                  placeholder="원하는 분위기, 피하고 싶은 요소, 이동 방식 등을 자유롭게 적어주세요."
                />
                <span class="sheet__textarea-count">{{ specialRequest.length }}/300</span>
              </label>

              <div class="sheet__review-actions">
                <button type="button" class="sheet__ghost-btn" @click="backToDetail">
                  이전으로
                </button>
                <button
                  type="button"
                  class="sheet__submit"
                  :class="{ 'sheet__submit--disabled': !canSubmitGenerate }"
                  :disabled="!canSubmitGenerate"
                  @click="generate"
                >
                  <span class="sheet__submit-icon">
                    <Sparkles :size="20" :stroke-width="2.4" color="#fff" />
                  </span>
                  이 내용으로 코스 생성
                </button>
              </div>
            </section>
          </div>

          <div v-else class="sheet__body sheet__body--loading">
            <GenerateLoading ref="loadingRef" />
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
.sheet-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 200;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.sheet-top-guide {
  position: absolute;
  top: calc(max(10px, env(safe-area-inset-top)) + 2px);
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  width: min(92vw, 430px);
  padding: 10px 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.96);
  color: #4b4b4b;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.16);
  z-index: 220;
}

/* 티켓 단계: 중앙이 아니라 상단 ~30% 구역에 두어 키보드 올라올 때 여유 */
.sheet-overlay--ticket {
  align-items: flex-start;
  justify-content: center;
  padding-top: calc(max(12px, env(safe-area-inset-top)) + clamp(12px, 8vh, 56px));
  padding-right: max(14px, env(safe-area-inset-right));
  padding-bottom: max(12px, env(safe-area-inset-bottom));
  padding-left: max(14px, env(safe-area-inset-left));
  background: rgba(0, 0, 0, 0.5);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.ticket-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  max-width: 60%;
  flex-shrink: 0;
}

.ticket-modal__pass {
  position: relative;
  width: min(86vw, 450px);
  max-width: 100%;
}

.ticket-modal__img {
  width: 100%;
  height: auto;
  display: block;
}

/* 티켓 왼쪽 흰 영역(~70%)에 맞춤 — 이미지 비율 유지용 퍼센트 */
.ticket-modal__fields {
  position: absolute;
  left: 17%;
  top: 24%;
  width: 47%;
  height: 54%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: auto;
  box-sizing: border-box;

}

.ticket-modal__title {
  margin: 0;
  font-size: 11px;
  font-weight: 800;
  color: rgba(0, 0, 0, 0.6);
  letter-spacing: -0.01em;
}

.ticket-modal__title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.ticket-modal__title-sub {
  margin-left: 4px;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: rgba(0, 0, 0, 0.36);
}

.ticket-modal__flight-no {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 6px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.5);
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.06em;
  white-space: nowrap;
}

.ticket-modal__route-strip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  color: rgba(0, 0, 0, 0.5);
}

.ticket-modal__route-row {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -1px;
}

.ticket-modal__airport-code {
  font-size: 8px;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.ticket-modal__route-plane {
  transform: rotate(4deg);
}

.ticket-modal__route-duration {
  position: absolute;
  right: 0;
  font-size: 8px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.42);
  letter-spacing: -0.01em;
}

.ticket-modal__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 12px;
  flex: 1;
  min-height: 0;
  align-content: start;
}

.ticket-modal__field {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.ticket-modal__label {
  font-size: 10px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.48);
  letter-spacing: -0.02em;
}

.ticket-modal__input {
  width: 100%;
  box-sizing: border-box;
  padding: 7px 9px;
  border: 1px solid rgba(0, 0, 0, 0.14);
  border-radius: 9px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.97);
  color: #1a1a1a;
  min-height: 34px;
}

.ticket-modal__input:focus {
  outline: none;
  border-color: #fe9c00;
}

.ticket-modal__tearline {
  height: 1px;
  margin: 1px 0 3px;
  background-image: repeating-linear-gradient(
    to right,
    rgba(0, 0, 0, 0.2) 0 4px,
    transparent 4px 7px
  );
}

.ticket-modal__brand-panel {
  position: absolute;
  right: 8%;
  top: 18%;
  width: 24%;
  height: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: #fff;
}

.ticket-modal__brand-plane {
  opacity: 0.94;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.16));
}

.ticket-modal__brand-copy {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.08;
  text-align: center;
}

.ticket-modal__brand-bts {
  font-size: 19px;
  font-weight: 900;
  letter-spacing: -0.02em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
}

.ticket-modal__brand-sub {
  margin-top: 2px;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.92);
}

.ticket-modal__next {
  width: min(86vw, 440px);
  padding: 14px 20px;
  border: none;
  border-radius: 14px;
  background: #fe9c00;
  color: #fff;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 18px rgba(254, 156, 0, 0.35);
}

.ticket-modal__next--disabled,
.ticket-modal__next:disabled {
  background: #e0e0e0;
  color: #aaa;
  box-shadow: none;
  cursor: not-allowed;
}

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
  margin-top: 2px;
}

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
  background: #fe9c00;
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

.sheet__chip-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
}

.sheet__chip-row::-webkit-scrollbar { display: none; }

.sheet__date-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.sheet__schedule-grid {
  display: grid;
  gap: 12px;
}

.sheet__schedule-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.sheet__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sheet__field-label {
  font-size: 12px;
  font-weight: 700;
  color: #787878;
  margin: 0;
}

.sheet__meta-row {
  display: flex;
  gap: 8px;
}

.sheet__meta-pill {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  background: #fff8ec;
  color: #c97000;
  font-weight: 700;
}

.sheet__text-input {
  width: 100%;
  padding: 12px 14px;
  border: 2px solid #ebebeb;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  outline: none;
  background: #fafaf8;
}

.sheet__text-input:focus {
  border-color: #fe9c00;
  background: #fff8ec;
}

.chip {
  flex-shrink: 0;
  border: 2px solid #ebebeb;
  border-radius: 12px;
  background: #fafaf8;
  color: #555;
  font-weight: 700;
  font-size: 12px;
  padding: 8px 12px;
  cursor: pointer;
}

.chip--active {
  border-color: #fe9c00;
  background: #fff8ec;
  color: #c97000;
}

.sheet__interest-counter {
  margin-left: auto;
  font-size: 14px;
  font-weight: 800;
  color: #fe9c00;
}

.sheet__interest-counter--max { color: #ef4444; }

.sheet__option-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.sheet__option-grid--sim {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.sheet__option-btn {
  border: 2px solid #ebebeb;
  border-radius: 12px;
  background: #fafaf8;
  color: #555;
  padding: 11px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.sheet__option-btn--active {
  border-color: #fe9c00;
  background: #fff8ec;
  color: #c97000;
}

.sheet__option-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.sheet__option-label {
  text-align: center;
  font-size: 12px;
  font-weight: 700;
}

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
}

.interest-btn--active {
  border-color: #fe9c00;
  background: #fff8ec;
}

.interest-btn--disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.interest-btn__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
}

.interest-btn__label {
  font-size: 11px;
  font-weight: 600;
  color: #555;
  text-align: center;
}

.interest-btn__check {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fe9c00;
  color: #fff;
  font-size: 9px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
}

.travel-type-btn {
  min-width: 84px;
  border: 2px solid #ebebeb;
  border-radius: 12px;
  background: #fafaf8;
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.travel-type-btn--active {
  border-color: #fe9c00;
  background: #fff8ec;
}

.travel-type-btn__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.travel-type-btn__label {
  font-size: 12px;
  font-weight: 700;
  color: #555;
}

.sheet__party-extra {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
}

.sheet__stepper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  border: 2px solid #ebebeb;
  border-radius: 14px;
  background: #fafaf8;
  overflow: hidden;
  max-width: 220px;
}

.sheet__stepper-btn {
  flex: 0 0 48px;
  height: 48px;
  border: none;
  background: #fff;
  font-size: 22px;
  font-weight: 700;
  color: #fe9c00;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;
}

.sheet__stepper-btn:hover:not(:disabled) {
  background: #fff8ec;
}

.sheet__stepper-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  color: #ccc;
}

.sheet__stepper-value {
  flex: 1;
  text-align: center;
  font-size: 17px;
  font-weight: 800;
  color: #1a1a1a;
  min-width: 72px;
}

.sheet__stepper--locked {
  opacity: 0.72;
}

.sheet__party-lock-hint {
  margin: 6px 0 0;
  font-size: 11px;
  color: #aaa;
  font-weight: 500;
}

.sheet__submit {
  width: 100%;
  padding: 17px;
  background: #fe9c00;
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
}

.sheet__submit--disabled {
  background: #e0e0e0;
  color: #aaa;
  box-shadow: none;
  cursor: not-allowed;
}

.sheet__submit-hint {
  text-align: center;
  font-size: 12px;
  color: #bbb;
  margin: -16px 0 0;
}

.sheet__review {
  gap: 14px;
}

.sheet__section--compact {
  gap: 10px;
}

.sheet__summary-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  border: 1px solid #f0e5d2;
  border-radius: 14px;
  background: #fffaf1;
}

.sheet__summary-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.sheet__summary-key {
  flex: 0 0 76px;
  color: #9a9a9a;
  font-size: 12px;
  font-weight: 700;
}

.sheet__summary-value {
  flex: 1;
  text-align: right;
  color: #363636;
  font-size: 13px;
  font-weight: 700;
}

.sheet__textarea {
  width: 100%;
  min-height: 96px;
  resize: vertical;
  border: 2px solid #ebebeb;
  border-radius: 12px;
  background: #fafaf8;
  padding: 10px 12px;
  font-size: 13px;
  line-height: 1.45;
  color: #333;
  outline: none;
  box-sizing: border-box;
}

.sheet__textarea:focus {
  border-color: #fe9c00;
  background: #fff8ec;
}

.sheet__textarea-count {
  align-self: flex-end;
  font-size: 11px;
  color: #b0b0b0;
  font-weight: 600;
}

.sheet__review-actions {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 10px;
}

.sheet__ghost-btn {
  border: 1px solid #e5e5e5;
  background: #fff;
  color: #666;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 700;
  padding: 0 12px;
  min-height: 54px;
  cursor: pointer;
}

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

.guide-fade-enter-active,
.guide-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.guide-fade-enter-from,
.guide-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-6px);
}
</style>
