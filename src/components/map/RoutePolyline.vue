<script setup>
defineProps({
  points: {
    type: Array,
    default: () => [],
    // [{ x: Number, y: Number }] - SVG coordinate space
  },
  color: { type: String, default: '#FE9C00' },
  dashed: { type: Boolean, default: false },
})
</script>

<template>
  <svg class="route-polyline" xmlns="http://www.w3.org/2000/svg">
    <polyline
      v-if="points.length > 1"
      :points="points.map(p => `${p.x},${p.y}`).join(' ')"
      :stroke="color"
      stroke-width="3"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
      :stroke-dasharray="dashed ? '8 6' : undefined"
    />
  </svg>
</template>

<style scoped>
.route-polyline {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
