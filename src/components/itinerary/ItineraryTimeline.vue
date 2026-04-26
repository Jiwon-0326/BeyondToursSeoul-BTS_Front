<script setup>
import { ref } from 'vue'
import { useTripStore } from '@/stores/useTripStore'
import ItineraryItem from './ItineraryItem.vue'

const tripStore = useTripStore()
const activeDay = ref(1)

const mockDays = [
  {
    day: 1,
    items: [
      { time: '09:00', name: '성수동 카페거리', crowdTag: '혼잡도 보통', crowdLevel: 'medium', desc: '강남 가까운 카페에서 여유롭운 아침입니다!', reason: '행사 진행 중' },
      { time: '11:00', name: '언더스탠드에비뉴', crowdTag: '혼잡도 낮음', crowdLevel: 'low', desc: '복합문화공간에서 전시와 쇼핑 즐기기', reason: '혼잡도 낮음' },
      { time: '13:00', name: '독섬 한강공원', crowdTag: '혼잡도 낮음', crowdLevel: 'low', desc: '한강에서 피크닉으로 점심 박박', reason: '혼잡도 낮음' },
      { time: '15:30', name: '서울숲', crowdTag: '혼잡도 낮음', crowdLevel: 'low', desc: '지역 의미서 산책에서 재충전', reason: '' },
      { time: '18:00', name: '성수 맛집 탐방', crowdTag: '혼잡도 높음', crowdLevel: 'high', desc: '로컬 맛집에서 저녁 식사', reason: '인기 높음 — 예약 권장' },
    ],
  },
  { day: 2, items: [] },
  { day: 3, items: [] },
]

const currentDay = () => mockDays.find(d => d.day === activeDay.value)
</script>

<template>
  <div class="itinerary-timeline">
    <div class="itinerary-timeline__tabs">
      <button
        v-for="d in mockDays"
        :key="d.day"
        class="itinerary-timeline__tab"
        :class="{ 'itinerary-timeline__tab--active': activeDay === d.day }"
        @click="activeDay = d.day"
      >
        DAY {{ d.day }}
      </button>
    </div>

    <div class="itinerary-timeline__list">
      <template v-if="currentDay()?.items.length">
        <ItineraryItem
          v-for="(item, i) in currentDay().items"
          :key="i"
          v-bind="item"
          :is-first="i === 0"
          :is-last="i === currentDay().items.length - 1"
        />
      </template>
      <div v-else class="itinerary-timeline__empty">
        <p>📅 이 날의 일정을 생성 중입니다...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.itinerary-timeline {
  width: 100%;
}

.itinerary-timeline__tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.itinerary-timeline__tab {
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: 1.5px solid #e8e8e8;
  background: #fff;
  font-size: 13px;
  font-weight: 600;
  color: #aaa;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
}

.itinerary-timeline__tab--active {
  border-color: #FE9C00;
  background: #FE9C00;
  color: #fff;
}

.itinerary-timeline__list {
  padding: 4px 0;
}

.itinerary-timeline__empty {
  text-align: center;
  padding: 40px 0;
  color: #aaa;
  font-size: 14px;
}
</style>
