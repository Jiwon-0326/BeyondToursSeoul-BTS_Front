<script setup>
defineProps({
  variant: { type: String, default: 'primary' }, // 'primary' | 'outline' | 'ghost'
  size: { type: String, default: 'md' },          // 'sm' | 'md' | 'lg'
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  fullWidth: { type: Boolean, default: false },
})

defineEmits(['click'])
</script>

<template>
  <button
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`, { 'btn--full': fullWidth, 'btn--disabled': disabled || loading }]"
    :disabled="disabled || loading"
    @click="$emit('click')"
  >
    <span v-if="loading" class="btn__spinner">⟳</span>
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
  white-space: nowrap;
}

.btn:active:not(.btn--disabled) {
  transform: scale(0.97);
  opacity: 0.88;
}

.btn--full { width: 100%; }

.btn--disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* Variants */
.btn--primary {
  background: #FE9C00;
  color: #fff;
}

.btn--outline {
  background: transparent;
  border: 2px solid #FE9C00;
  color: #FE9C00;
}

.btn--ghost {
  background: transparent;
  color: #FE9C00;
}

/* Sizes */
.btn--sm { padding: 8px 14px;  font-size: 13px; border-radius: 8px; }
.btn--md { padding: 13px 20px; font-size: 15px; }
.btn--lg { padding: 16px 24px; font-size: 17px; }

.btn__spinner {
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
