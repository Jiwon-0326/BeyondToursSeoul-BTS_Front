<script setup>
import { ref } from 'vue'
import { useMapStore } from '@/stores/useMapStore'
import MapView from '@/components/map/MapView.vue'

const mapStore = useMapStore()
const searchQuery = ref('')

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

    <div class="map-page__map">
      <MapView />
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

.map-page__map {
  flex: 1;
  min-height: 0;
}
</style>
