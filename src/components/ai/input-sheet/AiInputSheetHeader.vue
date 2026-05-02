<script setup>
import { Sparkles } from 'lucide-vue-next'

defineEmits(['close'])
</script>

<template>
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
    <button class="sheet__close" type="button" aria-label="닫기" @click="$emit('close')">✕</button>
  </div>
</template>

<style scoped>
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
</style>
