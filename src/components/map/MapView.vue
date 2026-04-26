<script setup>
import { useMapStore } from '@/stores/useMapStore'
import MapMarker from './MapMarker.vue'
import RoutePolyline from './RoutePolyline.vue'

const mapStore = useMapStore()
</script>

<template>
  <div class="map-view">
    <div class="map-view__placeholder">
      <p class="map-view__placeholder-text">🗺️ 지도 영역</p>
      <p class="map-view__placeholder-sub">Kakao Map / Naver Map 연동 예정</p>
    </div>

    <div class="map-view__overlay" v-if="mapStore.markers.length">
      <RoutePolyline :points="mapStore.polyline" />
      <MapMarker
        v-for="(marker, i) in mapStore.markers"
        :key="i"
        :label="marker.label"
        :type="marker.type"
        :crowd-level="marker.crowdLevel"
        :style="{ left: `${marker.x}%`, top: `${marker.y}%` }"
      />
    </div>

    <div class="map-view__legend">
      <div class="legend-item"><span class="legend-dot legend-dot--ai"></span>AI 추천 동선</div>
      <div class="legend-item"><span class="legend-dot legend-dot--suggest"></span>추가 소재</div>
      <div class="legend-item"><span class="legend-dot legend-dot--facility"></span>동반보험함</div>
      <div class="legend-item">
        <span>실시간 혼잡도</span>
        <span class="crowd-dot crowd-dot--low"></span>낮음
        <span class="crowd-dot crowd-dot--medium"></span>보통
        <span class="crowd-dot crowd-dot--high"></span>높음
      </div>
    </div>
  </div>
</template>

<style scoped>
.map-view {
  width: 100%;
  height: 100%;
  position: relative;
  background: #e8ede0;
  overflow: hidden;
}

.map-view__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #d4e0c8 0%, #c0d0b0 100%);
}

.map-view__placeholder-text {
  font-size: 32px;
  margin: 0;
}

.map-view__placeholder-sub {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.map-view__overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.map-view__legend {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 10px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 11px;
  color: #444;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.legend-dot--ai       { background: #FE9C00; }
.legend-dot--suggest  { background: #22c55e; }
.legend-dot--facility { background: #3b82f6; }

.crowd-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.crowd-dot--low    { background: #22c55e; }
.crowd-dot--medium { background: #f97316; }
.crowd-dot--high   { background: #ef4444; }
</style>
