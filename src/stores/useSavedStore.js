import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'bts:saved:v1'

function parsePlacesFromRoute(routeText) {
  if (!routeText) return []
  return routeText
    .split(/\s*→\s*/)
    .map((name) => name.trim())
    .filter(Boolean)
}

export const useSavedStore = defineStore('saved', () => {
  const savedItems = ref([])
  const placesById = ref({})
  const eventsById = ref({})
  const coursesById = ref({})

  const savedCourses = computed(() =>
    savedItems.value
      .filter((item) => item.type === 'course')
      .map((item) => coursesById.value[item.refId])
      .filter(Boolean),
  )

  const savedPlaces = computed(() => {
    const merged = new Map()

    savedItems.value
      .filter((item) => item.type === 'place')
      .map((item) => placesById.value[item.refId])
      .filter(Boolean)
      .forEach((place) => merged.set(place.id, place))

    savedCourses.value.forEach((course) => {
      ;(course.placeIds || []).forEach((id) => {
        const p = placesById.value[id]
        if (p) merged.set(p.id, p)
      })
    })

    return [...merged.values()]
  })

  const savedEvents = computed(() => {
    const merged = new Map()

    savedItems.value
      .filter((item) => item.type === 'event')
      .map((item) => eventsById.value[item.refId])
      .filter(Boolean)
      .forEach((event) => merged.set(event.id, event))

    savedCourses.value.forEach((course) => {
      ;(course.eventIds || []).forEach((id) => {
        const e = eventsById.value[id]
        if (e) merged.set(e.id, e)
      })
    })

    return [...merged.values()]
  })

  function hydrate() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw)
      savedItems.value = parsed.savedItems || []
      placesById.value = parsed.placesById || {}
      eventsById.value = parsed.eventsById || {}
      coursesById.value = parsed.coursesById || {}
    } catch {
      savedItems.value = []
      placesById.value = {}
      eventsById.value = {}
      coursesById.value = {}
    }
  }

  function persist() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        savedItems: savedItems.value,
        placesById: placesById.value,
        eventsById: eventsById.value,
        coursesById: coursesById.value,
      }),
    )
  }

  watch([savedItems, placesById, eventsById, coursesById], persist, { deep: true })

  function isSaved(type, refId) {
    return savedItems.value.some((item) => item.type === type && item.refId === refId)
  }

  function removeSaved(type, refId) {
    savedItems.value = savedItems.value.filter(
      (item) => !(item.type === type && item.refId === refId),
    )
  }

  function addSaved(type, refId, source = 'manual') {
    if (isSaved(type, refId)) return
    savedItems.value.unshift({
      id: `${type}:${refId}`,
      type,
      refId,
      source,
      savedAt: new Date().toISOString(),
    })
  }

  function saveCourseFromHome({ course, densityModeId }) {
    const courseId = `course:${densityModeId}:${course.id}`
    const placeNames = parsePlacesFromRoute(course.route)
    const placeIds = placeNames.map((name) => `place:${name}`)

    placeNames.forEach((name, i) => {
      const pid = placeIds[i]
      if (!placesById.value[pid]) {
        placesById.value[pid] = {
          id: pid,
          name,
          source: 'course',
        }
      }
    })

    coursesById.value[courseId] = {
      id: courseId,
      title: course.title,
      route: course.route,
      tags: course.tags || [],
      densityModeId,
      placeIds,
      eventIds: [],
    }

    addSaved('course', courseId, 'home_recommendation')
  }

  function toggleCourseFromHome(payload) {
    const refId = `course:${payload.densityModeId}:${payload.course.id}`
    if (isSaved('course', refId)) {
      removeSaved('course', refId)
      return false
    }
    saveCourseFromHome(payload)
    return true
  }

  hydrate()

  return {
    savedItems,
    placesById,
    eventsById,
    coursesById,
    savedCourses,
    savedPlaces,
    savedEvents,
    isSaved,
    removeSaved,
    addSaved,
    saveCourseFromHome,
    toggleCourseFromHome,
  }
})
