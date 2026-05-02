<script setup>
import { ref, computed, watch } from 'vue'
import ItineraryItem from './ItineraryItem.vue'

const props = defineProps({
  /**
   * undefined: 기본 mock 일정 (Result 등)
   * 배열: 채팅 structured 등 외부 일정 (DAY 1..n + items)
   */
  sourceDays: { type: Array, default: undefined },
  /** 선택된 일차 (1부터). 없으면 내부 state */
  modelValue: { type: Number, default: undefined },
})

const emit = defineEmits(['update:modelValue'])

const internalActive = ref(1)

const mockDays = [
  {
    day: 1,
    date: '',
    label: '',
    items: [
      {
        time: '09:00',
        name: '성수동 카페거리',
        crowdTag: '혼잡도 보통',
        crowdLevel: 'medium',
        desc: '강남 가까운 카페에서 여유롭운 아침입니다!',
        reason: '행사 진행 중',
      },
      {
        time: '11:00',
        name: '언더스탠드에비뉴',
        crowdTag: '혼잡도 낮음',
        crowdLevel: 'low',
        desc: '복합문화공간에서 전시와 쇼핑 즐기기',
        reason: '혼잡도 낮음',
      },
      {
        time: '13:00',
        name: '독섬 한강공원',
        crowdTag: '혼잡도 낮음',
        crowdLevel: 'low',
        desc: '한강에서 피크닉으로 점심 박박',
        reason: '혼잡도 낮음',
      },
      {
        time: '15:30',
        name: '서울숲',
        crowdTag: '혼잡도 낮음',
        crowdLevel: 'low',
        desc: '지역 의미서 산책에서 재충전',
        reason: '',
      },
      {
        time: '18:00',
        name: '성수 맛집 탐방',
        crowdTag: '혼잡도 높음',
        crowdLevel: 'high',
        desc: '로컬 맛집에서 저녁 식사',
        reason: '인기 높음 — 예약 권장',
      },
    ],
  },
  { day: 2, date: '', label: '', items: [] },
  { day: 3, date: '', label: '', items: [] },
]

const displayDays = computed(() => {
  if (props.sourceDays !== undefined) return props.sourceDays
  return mockDays
})

const activeDay = computed({
  get() {
    if (props.modelValue != null) return props.modelValue
    return internalActive.value
  },
  set(v) {
    const n = Number(v)
    internalActive.value = n
    emit('update:modelValue', n)
  },
})

watch(
  displayDays,
  (list) => {
    const maxD = list.length ? Math.max(...list.map((x) => x.day)) : 1
    if (activeDay.value > maxD) {
      activeDay.value = maxD
    }
    if (activeDay.value < 1) activeDay.value = 1
  },
  { deep: true },
)

function currentDayData() {
  return displayDays.value.find((d) => d.day === activeDay.value)
}

function setDay(d) {
  activeDay.value = d.day
}
</script>

<template>
  <div v-if="!displayDays.length" class="itinerary-timeline itinerary-timeline--emptyroot">
    <p class="itinerary-timeline__empty itinerary-timeline__empty--root">표시할 일정이 없습니다.</p>
  </div>
  <div v-else class="itinerary-timeline">
    <div class="itinerary-timeline__tabs">
      <button
        v-for="d in displayDays"
        :key="d.day"
        type="button"
        class="itinerary-timeline__tab"
        :class="{ 'itinerary-timeline__tab--active': activeDay === d.day }"
        @click="setDay(d)"
      >
        <span class="itinerary-timeline__tab-main">DAY {{ d.day }}</span>
        <span v-if="d.date || d.label" class="itinerary-timeline__tab-sub">{{
          d.date || d.label
        }}</span>
      </button>
    </div>

    <div class="itinerary-timeline__list">
      <template v-if="currentDayData()?.items?.length">
        <ItineraryItem
          v-for="(item, i) in currentDayData().items"
          :key="`${activeDay}-${i}`"
          v-bind="item"
          :is-first="i === 0"
          :is-last="i === currentDayData().items.length - 1"
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
  min-width: 0;
  padding: 10px 6px;
  border-radius: 10px;
  border: 1.5px solid #e8e8e8;
  background: #fff;
  font-size: 13px;
  font-weight: 600;
  color: #aaa;
  cursor: pointer;
  transition:
    border-color 0.2s,
    color 0.2s,
    background 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.itinerary-timeline__tab-main {
  font-size: 13px;
  font-weight: 700;
}

.itinerary-timeline__tab-sub {
  font-size: 10px;
  font-weight: 600;
  color: inherit;
  opacity: 0.85;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.itinerary-timeline__tab--active {
  border-color: #fe9c00;
  background: #fe9c00;
  color: #fff;
}

.itinerary-timeline__tab--active .itinerary-timeline__tab-sub {
  opacity: 0.95;
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

.itinerary-timeline--emptyroot {
  padding: 16px 0;
}

.itinerary-timeline__empty--root {
  margin: 0;
  padding: 12px;
  font-size: 13px;
}
</style>
