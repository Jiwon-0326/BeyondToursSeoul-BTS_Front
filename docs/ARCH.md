# Frontend Architecture (Vue3)

## 1. Views

- LandingView
- DiscoverView
- ResultView

---

## 2. 주요 컴포넌트

### Layout

- MainLayout
- BottomNav

### AI

- AIInputSheet
- TravelDensitySlider
- GenerateLoading

### Map

- MapView
- RoutePolyline
- MapMarker

### Itinerary

- ItineraryTimeline
- ItineraryItem

### Common

- Button
- Card

---

## 3. 상태 관리 (Pinia)

### useTripStore

- tripInput
- itinerary
- weatherMode

### useMapStore

- markers
- polyline

---

## 4. 핵심 흐름

1. 사용자 입력
2. AI 코스 생성
3. 지도 + 일정 렌더링
4. 날씨/상황 반영 업데이트
