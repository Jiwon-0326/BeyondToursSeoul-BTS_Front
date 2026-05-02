/**
 * 아침 → 오전 코스 → 점심 → 오후 코스 → 저녁 → 밤 코스 순 정렬·표시용
 * type / label 문자열로 단계 추정 (백엔드 키가 조금 달라도 매칭)
 */

const PHASES = [
  {
    id: 'breakfast',
    shortLabel: '아침',
    match: (t, l) =>
      matchesAny(t, l, ['breakfast', 'morning_meal', '아침', '조식']),
  },
  {
    id: 'morning_course',
    shortLabel: '오전 코스',
    match: (t, l) =>
      matchesAny(t, l, [
        'morning_course',
        'am_course',
        'forenoon',
        '오전',
        '오전코스',
        '오전 코스',
      ]),
  },
  {
    id: 'lunch',
    shortLabel: '점심',
    match: (t, l) =>
      matchesAny(t, l, ['lunch', '점심', '런치']),
  },
  {
    id: 'afternoon_course',
    shortLabel: '오후 코스',
    match: (t, l) =>
      matchesAny(t, l, [
        'afternoon_course',
        'pm_course',
        'afternoon',
        '오후',
        '오후코스',
        '오후 코스',
      ]),
  },
  {
    id: 'dinner',
    shortLabel: '저녁',
    match: (t, l) =>
      matchesAny(t, l, ['dinner', '저녁', '디너', '석식']),
  },
  {
    id: 'night_course',
    shortLabel: '밤 코스',
    match: (t, l) =>
      matchesAny(t, l, [
        'night_course',
        'evening_course',
        'night',
        '밤',
        '야간',
        '밤코스',
        '야경',
      ]),
  },
]

function matchesAny(typeStr, labelStr, needles) {
  const hay = `${typeStr} ${labelStr}`.toLowerCase()
  return needles.some((n) => hay.includes(n.toLowerCase()))
}

/** @returns {number} 0..PHASES.length-1 또는 PHASES.length(미분류) */
export function getSlotPhaseOrder(slot) {
  const t = String(slot?.type ?? '')
  const l = String(slot?.label ?? '')
  for (let i = 0; i < PHASES.length; i += 1) {
    if (PHASES[i].match(t, l)) return i
  }
  return PHASES.length
}

/** 표시용 짧은 구간 이름 */
export function getPhaseShortLabel(slot) {
  const i = getSlotPhaseOrder(slot)
  if (i < PHASES.length) return PHASES[i].shortLabel
  const raw = String(slot?.label || slot?.type || '').trim()
  return raw || '일정'
}

/**
 * 한 일의 slots를 타임라인 순으로 정렬 (같은 단계면 원래 배열 순 유지)
 * @returns {Array<{ slot: object, originalIndex: number }>}
 */
export function sortSlotsForTimeline(slots) {
  if (!Array.isArray(slots)) return []
  const withIdx = slots.map((slot, originalIndex) => ({ slot, originalIndex }))
  return withIdx.sort((a, b) => {
    const pa = getSlotPhaseOrder(a.slot)
    const pb = getSlotPhaseOrder(b.slot)
    if (pa !== pb) return pa - pb
    return a.originalIndex - b.originalIndex
  })
}
