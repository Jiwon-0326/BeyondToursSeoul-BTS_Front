<script setup>
import { Heart, MapPin, Sparkles } from 'lucide-vue-next'

const savedCourses = [
  {
    id: 1,
    title: '감성 서울 1일 코스',
    route: '성수동 -> 서울숲 -> 뚝섬 한강공원',
    tags: ['감성', '산책', '카페'],
  },
  {
    id: 2,
    title: '야경 중심 코스',
    route: '남산타워 -> 이태원 -> 반포한강공원',
    tags: ['야경', '사진', '데이트'],
  },
]
</script>

<template>
  <div class="saved">
    <header class="saved__header">
      <h1>저장함</h1>
      <p>저장한 여행 코스를 모아볼 수 있어요.</p>
    </header>

    <section class="saved__summary">
      <div class="saved__summary-item">
        <Heart :size="16" :stroke-width="2.2" />
        <span>저장 코스 {{ savedCourses.length }}개</span>
      </div>
      <div class="saved__summary-item">
        <Sparkles :size="16" :stroke-width="2.2" />
        <span>최근 업데이트: 오늘</span>
      </div>
    </section>

    <section class="saved__list">
      <article v-for="course in savedCourses" :key="course.id" class="saved-card">
        <h2 class="saved-card__title">{{ course.title }}</h2>
        <p class="saved-card__route">
          <MapPin :size="14" :stroke-width="2.2" />
          <span>{{ course.route }}</span>
        </p>
        <div class="saved-card__tags">
          <span v-for="tag in course.tags" :key="tag" class="saved-card__tag">#{{ tag }}</span>
        </div>
      </article>
    </section>
  </div>
</template>

<style scoped>
.saved {
  min-height: 100dvh;
  background: #f5f4f0;
  padding: 18px 16px 92px;
}

.saved__header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  color: #1f1f1f;
}

.saved__header p {
  margin: 6px 0 0;
  font-size: 13px;
  color: #7d7d7d;
}

.saved__summary {
  margin-top: 14px;
  display: grid;
  gap: 8px;
}

.saved__summary-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid #f0ece5;
  border-radius: 12px;
  padding: 10px 12px;
  color: #555;
  font-size: 12px;
  font-weight: 700;
}

.saved__list {
  margin-top: 14px;
  display: grid;
  gap: 10px;
}

.saved-card {
  background: #fff;
  border: 1px solid #f0ece5;
  border-radius: 14px;
  padding: 14px;
}

.saved-card__title {
  margin: 0;
  font-size: 15px;
  font-weight: 800;
  color: #222;
}

.saved-card__route {
  margin: 9px 0 0;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 12px;
}

.saved-card__tags {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.saved-card__tag {
  font-size: 11px;
  color: #c97000;
  background: #fff6e7;
  border: 1px solid #ffe2b5;
  border-radius: 999px;
  padding: 3px 8px;
  font-weight: 700;
}
</style>
