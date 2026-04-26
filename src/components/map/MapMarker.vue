<script setup>
defineProps({
  label: { type: String, default: '' },
  type: { type: String, default: 'default' }, // 'start' | 'end' | 'default'
  crowdLevel: { type: String, default: 'low' }, // 'low' | 'medium' | 'high'
})
</script>

<template>
  <div class="map-marker" :class="`map-marker--${type} map-marker--crowd-${crowdLevel}`">
    <div class="map-marker__dot"></div>
    <span v-if="label" class="map-marker__label">{{ label }}</span>
  </div>
</template>

<style scoped>
.map-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  position: absolute;
  transform: translate(-50%, -100%);
  cursor: pointer;
}

.map-marker__dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #FE9C00;
  border: 2px solid #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.25);
}

.map-marker--start .map-marker__dot { background: #22c55e; }
.map-marker--end   .map-marker__dot { background: #ef4444; }

.map-marker--crowd-medium .map-marker__dot { background: #f97316; }
.map-marker--crowd-high   .map-marker__dot { background: #ef4444; }

.map-marker__label {
  font-size: 11px;
  font-weight: 600;
  background: #fff;
  border-radius: 6px;
  padding: 2px 6px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.15);
  white-space: nowrap;
  color: #333;
}
</style>
