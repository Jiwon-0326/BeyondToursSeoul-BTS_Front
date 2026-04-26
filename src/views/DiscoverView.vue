<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import HotAreaCarousel from '@/components/discover/HotAreaCarousel.vue'
import AIInputSheet from '@/components/ai/AIInputSheet.vue'

const router = useRouter()
const showAISheet = ref(false)
const activeCategory = ref(null)

// ── Mock data ──────────────────────────────────────────────────────────────
const hotAreas = [
  {
    id: 1, name: '성수동', emoji: '🏭', isHot: true,
    score: 92.8, event: '성수 수제맥 페스티벌', period: '05.24 – 06.02',
    tags: ['브루어리', '팝업', '포토스팟'],
  },
  {
    id: 2, name: '망원동', emoji: '🎪', isHot: false,
    score: 95.2, event: '플라타딜 야시장', period: '05.18 – 05.25',
    tags: ['야시장', '로컬', '한강'],
  },
  {
    id: 3, name: '익선동', emoji: '🏯', isHot: false,
    score: 93.1, event: '한옥 문화 체험 주간', period: '05.20 – 05.30',
    tags: ['한옥', '전통', '카페'],
  },
  {
    id: 4, name: '을지로', emoji: '🎨', isHot: false,
    score: 88.4, event: '힙지로 아트위크', period: '05.22 – 05.28',
    tags: ['아트', '빈티지', '바'],
  },
]

const trends = [
  { icon: '🌡️', label: '날씨', value: '22℃ / 맑음 봄' },
  { icon: '🎪', label: '행사', value: '14건 진행 중' },
  { icon: '📊', label: '실시간 혼잡도', value: '성수동 보통' },
  { icon: '💵', label: '환율 정보', value: '1USD = 1,350₩' },
]

const categories = [
  { id: 'food',    icon: '🍜', label: '맛집' },
  { id: 'cafe',    icon: '☕', label: '카페' },
  { id: 'nature',  icon: '🌿', label: '자연/힐링' },
  { id: 'culture', icon: '🏛️', label: '전통문화' },
  { id: 'travel',  icon: '✈️', label: '여행' },
  { id: 'shop',    icon: '🛍️', label: '쇼핑' },
]

function selectCategory(id) {
  activeCategory.value = activeCategory.value === id ? null : id
}

function onCourseGenerated() {
  showAISheet.value = false
  router.push('/result')
}
</script>

<template>
  <div class="discover">

    <!-- ── Header ─────────────────────────────────────────────────────── -->
    <header class="discover__header">
      <div class="discover__brand">
        <span class="discover__brand-bts">BTS</span>
        <span class="discover__brand-sub">Beyond Tours Seoul</span>
      </div>
      <div class="discover__header-right">
        <button class="discover__icon-btn" aria-label="알림">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="discover__notif-dot"></span>
        </button>
        <div class="discover__avatar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8"/>
            <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </div>
      </div>
    </header>

    <!-- ── Greeting ───────────────────────────────────────────────────── -->
    <div class="discover__greeting">
      <h2 class="discover__greeting-title">Hi, Explorer! 🔥</h2>
      <p class="discover__greeting-sub">오늘 서울은 어디가 핫할까요?</p>
    </div>

    <!-- ── Hot Areas ──────────────────────────────────────────────────── -->
    <section class="discover__section">
      <div class="discover__section-row">
        <h3 class="discover__section-title">K-로컬 핀 지수 TOP 3 🔥</h3>
      </div>
      <HotAreaCarousel :items="hotAreas" />
    </section>

    <!-- ── Real-time Trends ───────────────────────────────────────────── -->
    <section class="discover__section">
      <h3 class="discover__section-title">실시간 서울 트렌드</h3>
      <div class="discover__trend-grid">
        <div v-for="t in trends" :key="t.label" class="trend-card">
          <span class="trend-card__icon">{{ t.icon }}</span>
          <div class="trend-card__text">
            <p class="trend-card__label">{{ t.label }}</p>
            <p class="trend-card__value">{{ t.value }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Theme Categories ───────────────────────────────────────────── -->
    <section class="discover__section discover__section--last">
      <h3 class="discover__section-title">테마별 추천</h3>
      <div class="discover__category-row">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="cat-btn"
          :class="{ 'cat-btn--active': activeCategory === cat.id }"
          @click="selectCategory(cat.id)"
        >
          <span class="cat-btn__icon">{{ cat.icon }}</span>
          <span class="cat-btn__label">{{ cat.label }}</span>
        </button>
      </div>
    </section>

    <!-- ── Floating AI Button ─────────────────────────────────────────── -->
    <button class="discover__fab" @click="showAISheet = true" aria-label="AI 여행 코스 짜기">
      <span class="discover__fab-pulse"></span>
      <span class="discover__fab-inner">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z"/>
        </svg>
        AI 여행 코스 짜기
      </span>
    </button>

    <!-- ── Bottom Nav (4 items) ───────────────────────────────────────── -->
    <nav class="discover__nav">
      <button class="nav-btn nav-btn--active" aria-label="홈">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M3 12L12 3l9 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>홈</span>
      </button>

      <button class="nav-btn" aria-label="지도">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4M9 7l6-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>지도</span>
      </button>

      <!-- 중앙 빈 공간 (FAB 자리) -->
      <div class="nav-spacer"></div>

      <button class="nav-btn" aria-label="저장함">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>저장함</span>
      </button>

      <button class="nav-btn" aria-label="마이">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8"/>
          <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
        <span>마이</span>
      </button>
    </nav>

    <!-- ── AI Sheet ───────────────────────────────────────────────────── -->
    <AIInputSheet
      v-if="showAISheet"
      @close="showAISheet = false"
      @generated="onCourseGenerated"
    />
  </div>
</template>

<style scoped>
/* ─── Root ───────────────────────────────────────────────────────────────── */
.discover {
  min-height: 100dvh;
  background: #f5f4f0;
  padding-bottom: 80px;
  position: relative;
}

/* ─── Header ─────────────────────────────────────────────────────────────── */
.discover__header {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: rgba(255,255,255,0.96);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #f0f0f0;
}

.discover__brand { display: flex; flex-direction: column; line-height: 1.1; }

.discover__brand-bts {
  font-size: 22px;
  font-weight: 900;
  color: #FE9C00;
  letter-spacing: -0.5px;
}

.discover__brand-sub {
  font-size: 10px;
  color: #ccc;
  letter-spacing: 0.02em;
}

.discover__header-right { display: flex; align-items: center; gap: 12px; }

.discover__icon-btn {
  position: relative;
  background: none;
  border: none;
  color: #555;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
}

.discover__notif-dot {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #ef4444;
  border: 1.5px solid #fff;
}

.discover__avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #f0ede8;
  border: 2px solid #e8e5e0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
}

/* ─── Greeting ───────────────────────────────────────────────────────────── */
.discover__greeting {
  padding: 18px 20px 12px;
  background: #fff;
  border-bottom: 1px solid #f5f5f5;
}

.discover__greeting-title {
  font-size: 24px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 3px;
}

.discover__greeting-sub {
  font-size: 14px;
  color: #888;
  margin: 0;
}

/* ─── Sections ───────────────────────────────────────────────────────────── */
.discover__section {
  padding: 20px 20px 0;
  background: #fff;
  margin-top: 8px;
}

.discover__section--last {
  padding-bottom: 20px;
}

.discover__section-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.discover__section-title {
  font-size: 15px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 14px;
}

/* ─── Trend grid ─────────────────────────────────────────────────────────── */
.discover__trend-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding-bottom: 20px;
}

.trend-card {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fafaf8;
  border: 1px solid #efefed;
  border-radius: 12px;
  padding: 12px 12px;
}

.trend-card__icon { font-size: 22px; flex-shrink: 0; }

.trend-card__text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }

.trend-card__label {
  font-size: 10px;
  color: #aaa;
  font-weight: 500;
  margin: 0;
}

.trend-card__value {
  font-size: 12px;
  font-weight: 700;
  color: #333;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ─── Category row ───────────────────────────────────────────────────────── */
.discover__category-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 4px;
}

.discover__category-row::-webkit-scrollbar { display: none; }

.cat-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  padding: 14px 16px 12px;
  background: #fafaf8;
  border: 1.5px solid #efefed;
  border-radius: 14px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, transform 0.1s;
  min-width: 68px;
}

.cat-btn:active { transform: scale(0.93); }

.cat-btn--active {
  border-color: #FE9C00;
  background: #fff8ec;
}

.cat-btn__icon { font-size: 26px; line-height: 1; }

.cat-btn__label {
  font-size: 11px;
  font-weight: 600;
  color: #555;
  white-space: nowrap;
}

.cat-btn--active .cat-btn__label { color: #c97000; }

/* ─── Floating AI Button ─────────────────────────────────────────────────── */
.discover__fab {
  position: fixed;
  bottom: 76px;        /* nav 높이(64px) + 여백 12px */
  left: 50%;
  transform: translateX(-50%);
  z-index: 110;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.discover__fab-pulse {
  position: absolute;
  inset: -8px;
  border-radius: 50px;
  background: rgba(254,156,0,0.22);
  animation: pulse 2.2s ease-in-out infinite;
  pointer-events: none;
}

@keyframes pulse {
  0%, 100% { transform: scale(1);   opacity: 0.7; }
  50%       { transform: scale(1.12); opacity: 0.15; }
}

.discover__fab-inner {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #FE9C00;
  color: #fff;
  border-radius: 50px;
  padding: 14px 26px;
  font-size: 15px;
  font-weight: 800;
  box-shadow: 0 6px 28px rgba(254,156,0,0.55);
  white-space: nowrap;
  transition: transform 0.12s;
}

.discover__fab:active .discover__fab-inner {
  transform: scale(0.96);
}

/* ─── Bottom Nav ─────────────────────────────────────────────────────────── */
.discover__nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 430px;
  height: 64px;
  background: #fff;
  border-top: 1px solid #efefef;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-bottom: max(0px, env(safe-area-inset-bottom));
  z-index: 100;
}

.nav-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  background: none;
  border: none;
  cursor: pointer;
  color: #c0bdb8;
  padding: 4px 10px;
  transition: color 0.15s;
  flex: 1;
}

.nav-btn span {
  font-size: 10px;
  font-weight: 600;
}

.nav-btn--active { color: #FE9C00; }

/* 중앙 FAB 자리 빈 공간 */
.nav-spacer {
  flex: 1;
}
</style>
