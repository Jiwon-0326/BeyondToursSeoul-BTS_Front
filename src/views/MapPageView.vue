<script setup>
import { ref, onMounted } from 'vue'
import { useMapStore } from '@/stores/useMapStore'
import MapView from '@/components/map/MapView.vue'

const mapStore = useMapStore()
const searchQuery = ref('')

// GPS 상태
const gpsLoading = ref(false)
const gpsError = ref('')   // 에러 메시지 (빈 문자열이면 숨김)

const AREAS = [
  { label: '성수', lat: 37.5444, lng: 127.0557 },
  { label: '홍대', lat: 37.5563, lng: 126.9234 },
  { label: '강남', lat: 37.4979, lng: 127.0276 },
  { label: '명동', lat: 37.5636, lng: 126.9826 },
  { label: '이태원', lat: 37.5345, lng: 126.9944 },
]

function focusArea(area) {
  mapStore.setCenter(area.lat, area.lng)
}

// ── GPS 위치 조회 ────────────────────────────────────────────────
function fetchCurrentLocation() {
  if (!navigator.geolocation) {
    gpsError.value = '이 브라우저는 위치 서비스를 지원하지 않습니다.'
    return
  }

  gpsLoading.value = true
  gpsError.value = ''

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude: lat, longitude: lng } = pos.coords
      mapStore.setCurrentLocation(lat, lng)
      mapStore.setCenter(lat, lng)
      gpsLoading.value = false
    },
    (err) => {
      gpsLoading.value = false
      switch (err.code) {
        case err.PERMISSION_DENIED:
          gpsError.value = '위치 접근 권한이 거부되었습니다.'
          break
        case err.POSITION_UNAVAILABLE:
          gpsError.value = '위치 정보를 가져올 수 없습니다.'
          break
        case err.TIMEOUT:
          gpsError.value = '위치 조회 시간이 초과되었습니다.'
          break
        default:
          gpsError.value = '위치를 가져오지 못했습니다.'
      }
      // 3초 후 에러 메시지 자동 제거
      setTimeout(() => { gpsError.value = '' }, 3000)
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
  )
}

onMounted(() => {
  fetchCurrentLocation()
})
</script>

<template>
  <div class="map-page">
    <header class="map-page__header">
      <h1 class="map-page__title">서울 지도</h1>

      <div class="map-page__search-wrap">
        <span class="map-page__search-icon">🔍</span>
        <input
          v-model="searchQuery"
          class="map-page__search-input"
          type="text"
          placeholder="장소, 지역 검색"
          readonly
        />
      </div>
    </header>

    <div class="map-page__chips">
      <button
        v-for="area in AREAS"
        :key="area.label"
        class="map-page__chip"
        @click="focusArea(area)"
      >
        {{ area.label }}
      </button>
    </div>

    <!-- 에러 토스트 -->
    <Transition name="toast">
      <div v-if="gpsError" class="map-page__toast">
        ⚠️ {{ gpsError }}
      </div>
    </Transition>

    <div class="map-page__map">
      <MapView />

      <!-- 현재 위치로 재중심 버튼 -->
      <button
        class="map-page__locate-btn"
        :class="{ 'map-page__locate-btn--loading': gpsLoading }"
        :disabled="gpsLoading"
        @click="fetchCurrentLocation"
        aria-label="현재 위치로 이동"
      >
        <span v-if="gpsLoading" class="map-page__locate-spinner"></span>
        <span v-else>📍</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.map-page {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  background: #fafaf8;
  padding-bottom: max(64px, calc(64px + env(safe-area-inset-bottom)));
}

/* 헤더 */
.map-page__header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px 10px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.map-page__title {
  font-size: 17px;
  font-weight: 700;
  color: #1a1a1a;
  white-space: nowrap;
}

.map-page__search-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f5f5f3;
  border-radius: 10px;
  padding: 8px 12px;
}

.map-page__search-icon {
  font-size: 14px;
  flex-shrink: 0;
}

.map-page__search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  color: #1a1a1a;
  outline: none;
}

.map-page__search-input::placeholder {
  color: #aaa;
}

/* 지역 칩 */
.map-page__chips {
  display: flex;
  gap: 8px;
  padding: 10px 20px;
  overflow-x: auto;
  scrollbar-width: none;
  flex-shrink: 0;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.map-page__chips::-webkit-scrollbar {
  display: none;
}

.map-page__chip {
  flex-shrink: 0;
  padding: 5px 14px;
  border-radius: 20px;
  border: 1.5px solid #e0e0e0;
  background: #fff;
  font-size: 13px;
  font-weight: 600;
  color: #444;
  cursor: pointer;
  transition: all 0.15s;
}

.map-page__chip:active {
  background: #FE9C00;
  border-color: #FE9C00;
  color: #fff;
}

/* 지도 영역 */
.map-page__map {
  flex: 1;
  min-height: 0;
  position: relative;
}

/* 현재 위치 버튼 */
.map-page__locate-btn {
  position: absolute;
  bottom: 20px;
  right: 16px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #fff;
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.18);
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 20;
  transition: transform 0.15s, box-shadow 0.15s;
}

.map-page__locate-btn:active {
  transform: scale(0.93);
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.14);
}

.map-page__locate-btn--loading {
  cursor: default;
  opacity: 0.7;
}

/* 로딩 스피너 */
.map-page__locate-spinner {
  width: 20px;
  height: 20px;
  border: 2.5px solid #e0e0e0;
  border-top-color: #4285F4;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 에러 토스트 */
.map-page__toast {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(40, 40, 40, 0.88);
  color: #fff;
  font-size: 13px;
  padding: 10px 18px;
  border-radius: 20px;
  white-space: nowrap;
  z-index: 50;
  pointer-events: none;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-8px);
}
</style>
