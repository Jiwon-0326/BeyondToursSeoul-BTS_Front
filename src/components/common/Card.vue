<script setup>
defineProps({
  padding: { type: String, default: 'md' }, // 'sm' | 'md' | 'lg' | 'none'
  shadow: { type: Boolean, default: false },
  border: { type: Boolean, default: true },
  clickable: { type: Boolean, default: false },
})

defineEmits(['click'])
</script>

<template>
  <div
    class="card"
    :class="[
      `card--pad-${padding}`,
      { 'card--shadow': shadow, 'card--border': border, 'card--clickable': clickable }
    ]"
    @click="clickable && $emit('click')"
  >
    <slot />
  </div>
</template>

<style scoped>
.card {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
}

.card--border  { border: 1px solid #f0f0f0; }
.card--shadow  { box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08); }
.card--clickable { cursor: pointer; transition: transform 0.15s; }
.card--clickable:active { transform: scale(0.98); }

.card--pad-none { padding: 0; }
.card--pad-sm   { padding: 10px; }
.card--pad-md   { padding: 14px; }
.card--pad-lg   { padding: 20px; }
</style>
