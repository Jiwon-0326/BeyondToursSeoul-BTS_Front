<script setup>
import { onMounted, onUnmounted, watch, ref } from 'vue'
import { useMapStore } from '@/stores/useMapStore'

defineProps({
  /** false면 우측 범례 숨김 (AI 채팅 시트 등 임베드용) */
  showLegend: { type: Boolean, default: true },
})

const mapStore = useMapStore()
const mapRef = ref(null)

let mapInstance = null
let naverMarkers = []
let naverPolyline = null
let currentLocationMarker = null

// ── Naver Maps 스크립트 동적 로드 ─────────────────────────────
function loadNaverMapScript() {
  return new Promise((resolve, reject) => {
    if (window.naver?.maps) {
      resolve()
      return
    }
    const existing = document.getElementById('naver-map-script')
    if (existing) {
      existing.addEventListener('load', resolve)
      existing.addEventListener('error', reject)
      return
    }
    const script = document.createElement('script')
    script.id = 'naver-map-script'
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${import.meta.env.VITE_NAVER_MAP_CLIENT_ID}`
    script.async = true
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// ── 현재 위치 마커 ─────────────────────────────────────────────
function buildCurrentLocationIcon() {
  return {
    content: `
      <div style="position:relative;width:24px;height:24px;">
        <div style="
          position:absolute;inset:0;
          border-radius:50%;
          background:rgba(66,133,244,0.25);
          animation:loc-pulse 1.8s ease-out infinite;
        "></div>
        <div style="
          position:absolute;top:50%;left:50%;
          transform:translate(-50%,-50%);
          width:14px;height:14px;
          border-radius:50%;
          background:#4285F4;
          border:2.5px solid #fff;
          box-shadow:0 2px 6px rgba(66,133,244,0.5);
        "></div>
        <style>
          @keyframes loc-pulse {
            0%   { transform:scale(0.5); opacity:0.8; }
            100% { transform:scale(2.2); opacity:0; }
          }
        </style>
      </div>`,
    anchor: new window.naver.maps.Point(12, 12),
  }
}

function syncCurrentLocation(loc) {
  if (currentLocationMarker) {
    currentLocationMarker.setMap(null)
    currentLocationMarker = null
  }
  if (!loc) return
  currentLocationMarker = new window.naver.maps.Marker({
    position: new window.naver.maps.LatLng(loc.lat, loc.lng),
    map: mapInstance,
    icon: buildCurrentLocationIcon(),
    zIndex: 200,
  })
}

// ── 마커 색상 헬퍼 ─────────────────────────────────────────────
function markerColor(type, crowdLevel) {
  if (type === 'start') return '#22c55e'
  if (type === 'end') return '#ef4444'
  if (crowdLevel === 'high') return '#ef4444'
  if (crowdLevel === 'medium') return '#f97316'
  return '#FE9C00'
}

function buildMarkerIcon(label, type, crowdLevel) {
  const color = markerColor(type, crowdLevel)
  const labelHtml = label
    ? `<span style="
        display:block;
        margin-top:4px;
        font-size:11px;
        font-weight:600;
        background:#fff;
        border-radius:6px;
        padding:2px 6px;
        box-shadow:0 1px 4px rgba(0,0,0,.15);
        white-space:nowrap;
        color:#333;
        text-align:center;
      ">${label}</span>`
    : ''
  return {
    content: `
      <div style="
        display:flex;
        flex-direction:column;
        align-items:center;
        cursor:pointer;
      ">
        <div style="
          width:16px;height:16px;
          border-radius:50%;
          background:${color};
          border:2px solid #fff;
          box-shadow:0 2px 6px rgba(0,0,0,.25);
        "></div>
        ${labelHtml}
      </div>`,
    anchor: new window.naver.maps.Point(8, 16),
  }
}

// ── 마커 동기화 ────────────────────────────────────────────────
function syncMarkers(markers) {
  naverMarkers.forEach(m => m.setMap(null))
  naverMarkers = []

  markers.forEach(marker => {
    if (marker.lat == null || marker.lng == null) return
    const nm = new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(marker.lat, marker.lng),
      map: mapInstance,
      icon: buildMarkerIcon(marker.label, marker.type, marker.crowdLevel),
    })
    naverMarkers.push(nm)
  })
}

// ── 폴리라인 동기화 ────────────────────────────────────────────
function syncPolyline(points) {
  if (naverPolyline) {
    naverPolyline.setMap(null)
    naverPolyline = null
  }
  const latLngPoints = points.filter(p => p.lat != null && p.lng != null)
  if (latLngPoints.length < 2) return

  naverPolyline = new window.naver.maps.Polyline({
    map: mapInstance,
    path: latLngPoints.map(p => new window.naver.maps.LatLng(p.lat, p.lng)),
    strokeColor: '#FE9C00',
    strokeWeight: 4,
    strokeOpacity: 0.9,
    strokeLineCap: 'round',
    strokeLineJoin: 'round',
  })
}

// ── 지도 초기화 ────────────────────────────────────────────────
onMounted(async () => {
  window.navermap_authFailure = () => {
    console.error('[NaverMap] 인증 실패: ncpKeyId를 확인하세요.')
  }

  await loadNaverMapScript()

  const { lat, lng } = mapStore.mapCenter
  mapInstance = new window.naver.maps.Map(mapRef.value, {
    center: new window.naver.maps.LatLng(lat, lng),
    zoom: 14,
    mapTypeControl: false,
    scaleControl: false,
    logoControl: true,
    mapDataControl: false,
  })

  syncMarkers(mapStore.markers)
  syncPolyline(mapStore.polyline)
  syncCurrentLocation(mapStore.currentLocation)
})

onUnmounted(() => {
  naverMarkers.forEach(m => m.setMap(null))
  if (naverPolyline) naverPolyline.setMap(null)
  if (currentLocationMarker) currentLocationMarker.setMap(null)
  mapInstance = null
  delete window.navermap_authFailure
})

// ── store 변경 반응 ────────────────────────────────────────────
watch(
  () => mapStore.markers,
  (markers) => { if (mapInstance) syncMarkers(markers) },
  { deep: true },
)

watch(
  () => mapStore.polyline,
  (points) => { if (mapInstance) syncPolyline(points) },
  { deep: true },
)

watch(
  () => mapStore.mapCenter,
  ({ lat, lng }) => {
    if (mapInstance)
      mapInstance.setCenter(new window.naver.maps.LatLng(lat, lng))
  },
)

watch(
  () => mapStore.currentLocation,
  (loc) => { if (mapInstance) syncCurrentLocation(loc) },
)
</script>

<template>
  <div class="map-view">
    <div ref="mapRef" class="map-view__canvas"></div>

    <div v-if="showLegend" class="map-view__legend">
      <div class="legend-item"><span class="legend-dot legend-dot--ai"></span>AI 추천 동선</div>
      <div class="legend-item"><span class="legend-dot legend-dot--suggest"></span>추가 소재</div>
      <div class="legend-item"><span class="legend-dot legend-dot--facility"></span>동반 편의시설</div>
      <div class="legend-item crowd-row">
        <span>혼잡도</span>
        <span class="crowd-dot crowd-dot--low"></span><span>낮음</span>
        <span class="crowd-dot crowd-dot--medium"></span><span>보통</span>
        <span class="crowd-dot crowd-dot--high"></span><span>높음</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.map-view {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.map-view__canvas {
  width: 100%;
  height: 100%;
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
  gap: 5px;
  font-size: 11px;
  color: #444;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(4px);
  z-index: 10;
  pointer-events: none;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.crowd-row {
  gap: 4px;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}

.legend-dot--ai       { background: #FE9C00; }
.legend-dot--suggest  { background: #22c55e; }
.legend-dot--facility { background: #3b82f6; }

.crowd-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}

.crowd-dot--low    { background: #22c55e; }
.crowd-dot--medium { background: #f97316; }
.crowd-dot--high   { background: #ef4444; }
</style>
