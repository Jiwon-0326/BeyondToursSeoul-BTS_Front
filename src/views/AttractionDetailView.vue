<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronLeft, MapPin, Phone, Clock, Globe, Heart } from 'lucide-vue-next'
import { fetchAttractionById } from '@/services/attractionService'

const route = useRoute()
const router = useRouter()

const attraction = ref(null)
const loading = ref(true)
const error = ref(null)
const isSaved = ref(false)

onMounted(async () => {
  try {
    attraction.value = await fetchAttractionById(route.params.id)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})

function goBack() {
  router.back()
}

function toggleSave() {
  isSaved.value = !isSaved.value
}
</script>

<template>
  <div class="detail">
    <!-- Loading -->
    <div v-if="loading" class="detail__loading">
      <div class="detail__spinner"></div>
      <p>불러오는 중...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="detail__error">
      <p>{{ error }}</p>
      <button class="detail__back-btn-plain" @click="goBack">돌아가기</button>
    </div>

    <!-- Content -->
    <template v-else-if="attraction">
      <!-- Hero Image -->
      <div class="detail__hero">
        <img
          v-if="attraction.imageUrl || attraction.image_url || attraction.thumbnail"
          class="detail__hero-img"
          :src="attraction.imageUrl || attraction.image_url || attraction.thumbnail"
          :alt="attraction.name"
        />
        <div v-else class="detail__hero-placeholder"></div>
        <div class="detail__hero-overlay"></div>

        <!-- Back button -->
        <button class="detail__back-btn" aria-label="뒤로가기" @click="goBack">
          <ChevronLeft :size="20" :stroke-width="2.4" />
        </button>

        <!-- Save button -->
        <button
          class="detail__save-btn"
          :class="{ 'detail__save-btn--active': isSaved }"
          aria-label="저장하기"
          @click="toggleSave"
        >
          <Heart :size="18" :stroke-width="2.2" />
        </button>

        <!-- Title overlay -->
        <div class="detail__hero-info">
          <span v-if="attraction.category" class="detail__category-badge">
            {{ attraction.category }}
          </span>
          <h1 class="detail__title">{{ attraction.name }}</h1>
          <div v-if="attraction.address" class="detail__hero-address">
            <MapPin :size="12" :stroke-width="2" />
            <span>{{ attraction.address }}</span>
          </div>
        </div>
      </div>

      <!-- Body -->
      <div class="detail__body">
        <!-- Description -->
        <section v-if="attraction.description || attraction.desc" class="detail__section">
          <h2 class="detail__section-title">소개</h2>
          <p class="detail__desc">{{ attraction.description || attraction.desc }}</p>
        </section>

        <!-- Info list -->
        <section class="detail__section detail__section--info">
          <h2 class="detail__section-title">기본 정보</h2>
          <ul class="detail__info-list">
            <li v-if="attraction.address" class="detail__info-item">
              <MapPin :size="15" :stroke-width="2" class="detail__info-icon" />
              <span>{{ attraction.address }}</span>
            </li>
            <li v-if="attraction.phone || attraction.tel" class="detail__info-item">
              <Phone :size="15" :stroke-width="2" class="detail__info-icon" />
              <span>{{ attraction.phone || attraction.tel }}</span>
            </li>
            <li v-if="attraction.openingHours || attraction.opening_hours" class="detail__info-item">
              <Clock :size="15" :stroke-width="2" class="detail__info-icon" />
              <span>{{ attraction.openingHours || attraction.opening_hours }}</span>
            </li>
            <li v-if="attraction.website || attraction.url" class="detail__info-item">
              <Globe :size="15" :stroke-width="2" class="detail__info-icon" />
              <a
                class="detail__link"
                :href="attraction.website || attraction.url"
                target="_blank"
                rel="noopener"
              >
                {{ attraction.website || attraction.url }}
              </a>
            </li>
          </ul>
        </section>

        <!-- Tags -->
        <section v-if="attraction.tags?.length" class="detail__section">
          <h2 class="detail__section-title">태그</h2>
          <div class="detail__tags">
            <span v-for="tag in attraction.tags" :key="tag" class="detail__tag">#{{ tag }}</span>
          </div>
        </section>
      </div>
    </template>
  </div>
</template>

<style scoped>
.detail {
  min-height: 100dvh;
  background: #f5f4f0;
  padding-bottom: 32px;
}

/* ── Loading / Error ─────────────────────────────────────────────────────── */
.detail__loading,
.detail__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60dvh;
  gap: 16px;
  color: #888;
  font-size: 14px;
}

.detail__spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #ffe3ba;
  border-top-color: #fe9c00;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.detail__back-btn-plain {
  background: none;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px 20px;
  cursor: pointer;
  font-size: 14px;
  color: #555;
}

/* ── Hero ────────────────────────────────────────────────────────────────── */
.detail__hero {
  position: relative;
  width: 100%;
  height: 300px;
  background: #1a1a1a;
  overflow: hidden;
}

.detail__hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail__hero-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(160deg, #2c2c3a 0%, #1a1a28 100%);
}

.detail__hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.1) 0%,
    rgba(0,0,0,0.08) 30%,
    rgba(0,0,0,0.62) 70%,
    rgba(0,0,0,0.88) 100%
  );
}

.detail__back-btn {
  position: absolute;
  top: max(14px, env(safe-area-inset-top, 14px));
  left: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.35);
  background: rgba(0,0,0,0.3);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  backdrop-filter: blur(4px);
}

.detail__save-btn {
  position: absolute;
  top: max(14px, env(safe-area-inset-top, 14px));
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.35);
  background: rgba(0,0,0,0.3);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  backdrop-filter: blur(4px);
  transition: background 0.15s, border-color 0.15s;
}

.detail__save-btn--active {
  background: rgba(254, 156, 0, 0.9);
  border-color: rgba(255, 233, 194, 0.9);
}

.detail__hero-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 20px;
  z-index: 5;
}

.detail__category-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  background: rgba(254, 156, 0, 0.85);
  border-radius: 999px;
  padding: 3px 10px;
  margin-bottom: 8px;
}

.detail__title {
  margin: 0 0 6px;
  font-size: 22px;
  font-weight: 900;
  color: #fff;
  text-shadow: 0 1px 6px rgba(0,0,0,0.45);
  line-height: 1.25;
}

.detail__hero-address {
  display: flex;
  align-items: center;
  gap: 4px;
  color: rgba(255,255,255,0.82);
  font-size: 12px;
}

/* ── Body ────────────────────────────────────────────────────────────────── */
.detail__body {
  padding: 0;
}

.detail__section {
  background: #fff;
  margin-top: 8px;
  padding: 20px;
}

.detail__section-title {
  font-size: 14px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 12px;
}

.detail__desc {
  font-size: 14px;
  color: #444;
  line-height: 1.7;
  margin: 0;
}

/* ── Info list ───────────────────────────────────────────────────────────── */
.detail__section--info { padding-bottom: 20px; }

.detail__info-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail__info-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  color: #444;
  line-height: 1.5;
}

.detail__info-icon {
  color: #fe9c00;
  flex-shrink: 0;
  margin-top: 1px;
}

.detail__link {
  color: #2563eb;
  text-decoration: none;
  word-break: break-all;
}

/* ── Tags ────────────────────────────────────────────────────────────────── */
.detail__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.detail__tag {
  font-size: 12px;
  font-weight: 700;
  color: #a36b18;
  background: #fff8ec;
  border: 1.5px solid #ffe3ba;
  border-radius: 999px;
  padding: 4px 12px;
}
</style>
