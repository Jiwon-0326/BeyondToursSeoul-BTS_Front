<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  ChevronLeft,
  MapPin,
  Clock,
  Navigation,
  Share2,
  Package,
  AlertCircle,
} from 'lucide-vue-next'
import { fetchLockerById } from '@/services/attractionService'

const props = defineProps({
  lockerId: { default: null },
})
const emit = defineEmits(['close'])

const router = useRouter()
const route = useRoute()

const locker = ref(null)
const loading = ref(true)
const error = ref(null)

const resolvedId = computed(() => props.lockerId ?? route.params.id)

watch(
  resolvedId,
  async (id) => {
    if (!id) return
    loading.value = true
    error.value = null
    locker.value = null
    try {
      locker.value = await fetchLockerById(id)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  },
  { immediate: true },
)

const d = computed(() => {
  const l = locker.value
  if (!l) return null
  return {
    id: l.id,
    lockerId: l.lockerId ?? '',
    lockerName: l.lockerName ?? '',
    stationName: l.stationName ?? '',
    detailLocation: l.detailLocation ?? '',
    latitude: l.latitude ?? null,
    longitude: l.longitude ?? null,
    totalCnt: l.totalCnt ?? null,
    weekdayOperTime: l.weekdayOperTime ?? '',
    weekendOperTime: l.weekendOperTime ?? '',
    sizeInfo: l.sizeInfo ?? '',
    basePriceInfo: l.basePriceInfo ?? '',
    addPriceInfo: l.addPriceInfo ?? '',
    limitItemsInfo: l.limitItemsInfo ?? '',
  }
})

function formatOperTime(raw) {
  if (!raw) return ''
  const parts = raw.split('~').map((s) => s.trim())
  if (parts.length !== 2) return raw.replace(/\r\n/g, '\n')
  const fmt = (t) => {
    const s = t.replace(/\s/g, '')
    if (s.length === 6 && /^\d+$/.test(s)) return `${s.slice(0, 2)}:${s.slice(2, 4)}`
    return t
  }
  return `${fmt(parts[0])} ~ ${fmt(parts[1])}`
}

function goBack() {
  if (props.lockerId != null) {
    emit('close')
    return
  }
  if (window.history.length > 1) router.back()
  else router.push('/map')
}

function openMap() {
  const row = d.value
  if (!row) return
  const lat = row.latitude
  const lng = row.longitude
  const dname = encodeURIComponent(row.lockerName || row.stationName || '')
  const appname = encodeURIComponent(window.location.hostname || 'bts-seoul')
  const ua = navigator.userAgent
  const isAndroid = /Android/i.test(ua) && /Mobile|Tablet/i.test(ua)
  const isIOS = /iPhone|iPad|iPod/i.test(ua) && !window.MSStream
  const isMobile = isAndroid || isIOS

  const webFallback = () => {
    const q = encodeURIComponent(row.lockerName || row.stationName || '')
    window.open(`https://map.naver.com/v5/search/${q}`, '_blank', 'noopener')
  }

  if (!isMobile || lat == null || lng == null) {
    webFallback()
    return
  }

  if (isAndroid) {
    window.location.href =
      `intent://navigation?dlat=${lat}&dlng=${lng}&dname=${dname}&appname=${appname}` +
      `#Intent;scheme=nmap;action=android.intent.action.VIEW;` +
      `category=android.intent.category.BROWSABLE;package=com.nhn.android.nmap;end`
  } else {
    const clickedAt = Date.now()
    window.location.href =
      `nmap://navigation?dlat=${lat}&dlng=${lng}&dname=${dname}&appname=${appname}`
    setTimeout(() => {
      if (Date.now() - clickedAt < 2000) {
        window.location.href = 'http://itunes.apple.com/app/id311867728?mt=8'
      }
    }, 1500)
  }
}

function shareLocker() {
  const name = d.value?.lockerName
  const url = window.location.href
  if (navigator.share) navigator.share({ title: name, url })
  else navigator.clipboard?.writeText(url)
}
</script>

<template>
  <div class="ld-root">
    <div v-if="loading" class="ld-loading">
      <div class="ld-spinner" />
      <p>불러오는 중...</p>
    </div>

    <div v-else-if="error" class="ld-error">
      <p>{{ error }}</p>
      <button type="button" class="ld-error__back" @click="goBack">돌아가기</button>
    </div>

    <div v-else-if="d" class="ld">
      <div class="ld__hero">
        <div class="ld__hero-pattern" aria-hidden="true" />
        <div class="ld__hero-actions">
          <button type="button" class="ld__icon-btn" aria-label="뒤로가기" @click="goBack">
            <ChevronLeft :size="22" :stroke-width="2.5" />
          </button>
          <button type="button" class="ld__icon-btn" aria-label="공유" @click="shareLocker">
            <Share2 :size="20" :stroke-width="2.2" />
          </button>
        </div>
        <div class="ld__hero-icon-wrap">
          <Package :size="36" :stroke-width="1.8" />
        </div>
        <p v-if="d.stationName" class="ld__hero-station">{{ d.stationName }}</p>
        <h1 class="ld__hero-title">{{ d.lockerName }}</h1>
        <span v-if="d.lockerId" class="ld__hero-badge">{{ d.lockerId }}</span>
      </div>

      <div class="ld__card">
        <div v-if="d.totalCnt != null" class="ld__stat">
          <span class="ld__stat-num">{{ d.totalCnt }}</span>
          <span class="ld__stat-label">보관함 개수</span>
        </div>

        <div class="ld__quick-actions">
          <button type="button" class="ld__action-btn" @click="openMap">
            <span class="ld__action-icon"><Navigation :size="18" :stroke-width="2" /></span>
            <span>길찾기</span>
          </button>
        </div>

        <div class="ld__divider" />

        <section v-if="d.detailLocation" class="ld__section">
          <h2 class="ld__section-title">
            <MapPin :size="16" class="ld__section-title-icon" />
            위치
          </h2>
          <p class="ld__text">{{ d.detailLocation }}</p>
        </section>

        <div v-if="d.detailLocation" class="ld__divider" />

        <section v-if="d.weekdayOperTime || d.weekendOperTime" class="ld__section">
          <h2 class="ld__section-title">
            <Clock :size="16" class="ld__section-title-icon" />
            운영 시간
          </h2>
          <ul class="ld__time-list">
            <li v-if="d.weekdayOperTime">
              <span class="ld__time-label">평일</span>
              <span class="ld__time-value">{{ formatOperTime(d.weekdayOperTime) }}</span>
            </li>
            <li v-if="d.weekendOperTime">
              <span class="ld__time-label">주말</span>
              <span class="ld__time-value">{{ formatOperTime(d.weekendOperTime) }}</span>
            </li>
          </ul>
          <p class="ld__hint">※ 표시는 역(출입구) 운영시간 기준일 수 있습니다.</p>
        </section>

        <div v-if="d.weekdayOperTime || d.weekendOperTime" class="ld__divider" />

        <section v-if="d.sizeInfo" class="ld__section">
          <h2 class="ld__section-title">보관함 크기</h2>
          <p class="ld__text ld__text--pre">{{ d.sizeInfo.replace(/\r\n/g, '\n') }}</p>
        </section>

        <div v-if="d.sizeInfo" class="ld__divider" />

        <section v-if="d.basePriceInfo" class="ld__section">
          <h2 class="ld__section-title">이용 요금</h2>
          <p class="ld__text ld__text--pre">{{ d.basePriceInfo.replace(/\r\n/g, '\n') }}</p>
        </section>

        <div v-if="d.basePriceInfo" class="ld__divider" />

        <section v-if="d.addPriceInfo" class="ld__section">
          <h2 class="ld__section-title">추가 요금</h2>
          <p class="ld__text ld__text--pre">{{ d.addPriceInfo.replace(/\r\n/g, '\n') }}</p>
        </section>

        <div v-if="d.addPriceInfo" class="ld__divider" />

        <section v-if="d.limitItemsInfo" class="ld__section ld__section--warning">
          <h2 class="ld__section-title">
            <AlertCircle :size="16" class="ld__section-title-icon ld__warn-icon" />
            보관 제한 물품
          </h2>
          <p class="ld__text ld__text--pre">{{ d.limitItemsInfo.replace(/\r\n/g, '\n') }}</p>
        </section>

        <div class="ld__spacer" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.ld-root {
  min-height: 0;
}

.ld-loading,
.ld-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 48px 24px;
  color: #888;
  font-size: 14px;
}

.ld-spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #e8e6e0;
  border-top-color: #0d9488;
  border-radius: 50%;
  animation: ld-spin 0.75s linear infinite;
}

@keyframes ld-spin {
  to { transform: rotate(360deg); }
}

.ld-error p {
  color: #ef4444;
  text-align: center;
}

.ld-error__back {
  margin-top: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  background: #0d9488;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
}

.ld {
  display: flex;
  flex-direction: column;
  background: #fafaf8;
}

.ld__hero {
  position: relative;
  min-height: 168px;
  padding: 52px 16px 20px;
  background: linear-gradient(135deg, #0d9488 0%, #0f766e 45%, #115e59 100%);
  color: #fff;
  overflow: hidden;
}

.ld__hero-pattern {
  position: absolute;
  inset: 0;
  opacity: 0.12;
  background-image:
    radial-gradient(circle at 20% 30%, #fff 0, transparent 45%),
    radial-gradient(circle at 80% 70%, #fff 0, transparent 40%);
  pointer-events: none;
}

.ld__hero-actions {
  position: absolute;
  top: 10px;
  left: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 2;
}

.ld__icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(4px);
}

.ld__hero-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  position: relative;
  z-index: 1;
}

.ld__hero-station {
  margin: 0 0 4px;
  font-size: 12px;
  font-weight: 700;
  opacity: 0.9;
  letter-spacing: 0.02em;
  position: relative;
  z-index: 1;
}

.ld__hero-title {
  margin: 0 0 10px;
  font-size: 20px;
  font-weight: 800;
  line-height: 1.35;
  position: relative;
  z-index: 1;
}

.ld__hero-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.35);
  position: relative;
  z-index: 1;
}

.ld__card {
  margin-top: -14px;
  position: relative;
  z-index: 2;
  background: #fff;
  border-radius: 18px 18px 0 0;
  padding: 18px 18px 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.06);
}

.ld__stat {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 14px;
}

.ld__stat-num {
  font-size: 28px;
  font-weight: 900;
  color: #0d9488;
  line-height: 1;
}

.ld__stat-label {
  font-size: 13px;
  font-weight: 600;
  color: #888;
}

.ld__quick-actions {
  display: flex;
  gap: 10px;
}

.ld__action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border-radius: 12px;
  border: 1.5px solid #e8e6e0;
  background: #fafaf8;
  font-size: 13px;
  font-weight: 700;
  color: #333;
  cursor: pointer;
}

.ld__action-btn:active {
  background: #f0fffb;
  border-color: #99f6e4;
}

.ld__action-icon {
  color: #0d9488;
  display: flex;
}

.ld__divider {
  height: 1px;
  background: #efefed;
  margin: 16px 0;
}

.ld__section {
  margin: 0;
}

.ld__section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 800;
  color: #1a1a1a;
}

.ld__section-title-icon {
  color: #0d9488;
  flex-shrink: 0;
}

.ld__section--warning .ld__section-title {
  color: #b45309;
}

.ld__warn-icon {
  color: #d97706;
}

.ld__text {
  margin: 0;
  font-size: 13px;
  line-height: 1.65;
  color: #444;
}

.ld__text--pre {
  white-space: pre-wrap;
  word-break: keep-all;
}

.ld__time-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ld__time-list li {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  font-size: 13px;
}

.ld__time-label {
  font-weight: 700;
  color: #666;
  flex-shrink: 0;
}

.ld__time-value {
  color: #1a1a1a;
  font-weight: 600;
  text-align: right;
}

.ld__hint {
  margin: 10px 0 0;
  font-size: 11px;
  color: #999;
  line-height: 1.4;
}

.ld__section--warning {
  padding: 12px;
  border-radius: 12px;
  background: #fffbeb;
  border: 1px solid #fde68a;
}

.ld__section--warning .ld__text {
  color: #57534e;
}

.ld__spacer {
  height: 32px;
}
</style>