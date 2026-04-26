/**
 * AI 여행 코스 생성 서비스
 * 실제 API 연동 전까지는 mock 데이터를 반환합니다.
 */

const MOCK_ITINERARY = [
  {
    day: 1,
    items: [
      {
        time: '09:00',
        name: '성수동 카페거리',
        crowdTag: '혼잡도 보통',
        crowdLevel: 'medium',
        desc: '강남 가까운 카페에서 여유로운 아침을 시작하세요.',
        reason: '행사 진행 중',
        lat: 37.5447, lng: 127.0561,
      },
      {
        time: '11:00',
        name: '언더스탠드에비뉴',
        crowdTag: '혼잡도 낮음',
        crowdLevel: 'low',
        desc: '복합문화공간에서 전시와 쇼핑 즐기기',
        reason: '혼잡도 낮음',
        lat: 37.5444, lng: 127.0575,
      },
      {
        time: '13:00',
        name: '독섬 한강공원',
        crowdTag: '혼잡도 낮음',
        crowdLevel: 'low',
        desc: '한강에서 피크닉으로 점심 휴식',
        reason: '혼잡도 낮음',
        lat: 37.5294, lng: 127.0664,
      },
      {
        time: '15:30',
        name: '서울숲',
        crowdTag: '혼잡도 낮음',
        crowdLevel: 'low',
        desc: '지역 의미 있는 산책으로 재충전',
        reason: '',
        lat: 37.5443, lng: 127.0374,
      },
      {
        time: '18:00',
        name: '성수 맛집 탐방',
        crowdTag: '혼잡도 높음',
        crowdLevel: 'high',
        desc: '로컬 맛집에서 저녁 식사',
        reason: '인기 높음 — 예약 권장',
        lat: 37.5447, lng: 127.0561,
      },
    ],
  },
  { day: 2, items: [] },
  { day: 3, items: [] },
]

/**
 * @param {{ duration: string, density: number, interests: string[], travelType: string }} input
 * @returns {Promise<Array>}
 */
export async function generateCourse(input) {
  // TODO: 실제 백엔드 API 호출로 교체
  await new Promise((resolve) => setTimeout(resolve, 2000))
  return MOCK_ITINERARY
}
