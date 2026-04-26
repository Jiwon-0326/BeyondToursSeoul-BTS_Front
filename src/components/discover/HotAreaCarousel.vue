<script setup>
import { ref } from 'vue'

const props = defineProps({
  items: { type: Array, required: true },
})

const emit = defineEmits(['select'])

const trackRef = ref(null)
const activeIndex = ref(0)

// Dark, Seoul-district-style photo gradients
const photoGradients = [
  'linear-gradient(160deg, #2c1810 0%, #4a2c1a 40%, #1a0f08 100%)',  // 성수동 - warm dark brown
  'linear-gradient(160deg, #0d1f3a 0%, #1a3a5c 40%, #0a1525 100%)',  // 망원동 - cool navy
  'linear-gradient(160deg, #1a1208 0%, #3d2e12 40%, #0f0c05 100%)',  // 익선동 - dark golden
  'linear-gradient(160deg, #1c1c2e 0%, #2d2d44 40%, #0f0f1a 100%)',  // 을지로 - purple dark
]

const districtEmojis = ['🏭', '🎪', '🏯', '🎨']

function onScroll(e) {
  const el = e.target
  // Card width = 140px + 12px gap
  const CARD_W = 152
  activeIndex.value = Math.round(el.scrollLeft / CARD_W)
}

function scrollTo(i) {
  const CARD_W = 152
  trackRef.value?.scrollTo({ left: CARD_W * i, behavior: 'smooth' })
  activeIndex.value = i
}
</script>

<template>
  <div class="carousel">
    <div class="carousel__track" ref="trackRef" @scroll="onScroll">
      <div
        v-for="(item, i) in items"
        :key="item.id"
        class="carousel__card"
        :style="{ background: photoGradients[i % photoGradients.length] }"
        @click="emit('select', item)"
      >
        <!-- Photo overlay gradient -->
        <div class="card__photo-overlay"></div>

        <!-- Top: rank + badge -->
        <div class="card__top">
          <span class="card__rank">{{ i + 1 }}</span>
          <span class="card__badge" :class="item.isHot ? 'card__badge--hot' : 'card__badge--pin'">
            {{ item.isHot ? 'HOT 행사 중' : '핀 지수 ' + item.score }}
          </span>
        </div>

        <!-- District emoji -->
        <div class="card__emoji-wrap">
          <span class="card__emoji">{{ districtEmojis[i % districtEmojis.length] }}</span>
        </div>

        <!-- Bottom: name + event + period -->
        <div class="card__bottom">
          <p class="card__name">{{ item.name }}</p>
          <p class="card__event">{{ item.event }}</p>
          <p class="card__period">{{ item.period }}</p>
        </div>
      </div>
    </div>

    <!-- Dots -->
    <div class="carousel__dots">
      <button
        v-for="(_, i) in items"
        :key="i"
        class="carousel__dot"
        :class="{ 'carousel__dot--active': activeIndex === i }"
        @click="scrollTo(i)"
        :aria-label="`${i + 1}번 핫플`"
      />
    </div>
  </div>
</template>

<style scoped>
.carousel {
  width: 100%;
}

.carousel__track {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  padding: 4px 0 6px;
}

.carousel__track::-webkit-scrollbar { display: none; }

/* ─── Card ───────────────────────────────────────────────────────────────── */
.carousel__card {
  position: relative;
  min-width: 140px;
  height: 196px;
  flex-shrink: 0;
  scroll-snap-align: start;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px 10px 12px;
  transition: transform 0.2s;
}

.carousel__card:active { transform: scale(0.96); }

/* Dark bottom-to-top gradient to ensure text legibility */
.card__photo-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.15) 0%,
    rgba(0,0,0,0.05) 35%,
    rgba(0,0,0,0.6)  75%,
    rgba(0,0,0,0.85) 100%
  );
  pointer-events: none;
}

/* ─── Top ────────────────────────────────────────────────────────────────── */
.card__top {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 4px;
}

.card__rank {
  font-size: 28px;
  font-weight: 900;
  color: #fff;
  line-height: 1;
  text-shadow: 0 2px 8px rgba(0,0,0,0.5);
}

.card__badge {
  font-size: 10px;
  font-weight: 700;
  padding: 3px 7px;
  border-radius: 6px;
  white-space: nowrap;
  backdrop-filter: blur(4px);
  line-height: 1.4;
}

.card__badge--hot {
  background: rgba(239,68,68,0.88);
  color: #fff;
}

.card__badge--pin {
  background: rgba(254,156,0,0.9);
  color: #fff;
}

/* ─── Middle emoji ───────────────────────────────────────────────────────── */
.card__emoji-wrap {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  pointer-events: none;
}

.card__emoji {
  font-size: 48px;
  opacity: 0.35;
  filter: blur(0.5px);
}

/* ─── Bottom ─────────────────────────────────────────────────────────────── */
.card__bottom {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.card__name {
  font-size: 17px;
  font-weight: 800;
  color: #fff;
  margin: 0;
  line-height: 1.1;
  text-shadow: 0 1px 4px rgba(0,0,0,0.6);
}

.card__event {
  font-size: 11px;
  color: rgba(255,255,255,0.8);
  margin: 0;
  font-weight: 500;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.card__period {
  font-size: 10px;
  color: rgba(255,255,255,0.55);
  margin: 0;
}

/* ─── Dots ───────────────────────────────────────────────────────────────── */
.carousel__dots {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 10px;
}

.carousel__dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  border: none;
  background: #d8d8d8;
  padding: 0;
  cursor: pointer;
  transition: width 0.25s, background 0.25s;
}

.carousel__dot--active {
  width: 18px;
  border-radius: 3px;
  background: #FE9C00;
}
</style>
