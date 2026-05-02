import { normalizeStructured } from '@/utils/structuredNormalize'

const AI_CHAT_BASE_URL =
  import.meta.env.VITE_AI_CHAT_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL_LOCAL ||
  'http://localhost:8080'

/**
 * POST /api/v1/ai/chat 성공 본문 형태 (백엔드 Groq 파싱 결과).
 * @typedef {object} AiChatResponse
 * @property {string} answer - 말풍선용 Markdown (fallback 시 원문만)
 * @property {object|null} [structured] - 카드/일정/예산 UI (파싱 실패 시 null)
 * @property {string} [model] - 사용 모델명
 */

/**
 * 원격 응답을 안전하게 정규화 (structured null·answer 문자열 보장).
 * @param {unknown} raw
 * @returns {{ answer: string, structured: object | null, model?: string }}
 */
export function normalizeAiChatResponse(raw) {
  if (!raw || typeof raw !== 'object') {
    return { answer: '', structured: null, model: undefined }
  }
  const o = /** @type {Record<string, unknown>} */ (raw)
  const answer = typeof o.answer === 'string' ? o.answer : ''
  const rawStructured =
    o.structured !== undefined && o.structured !== null && typeof o.structured === 'object'
      ? o.structured
      : null
  const structured = normalizeStructured(rawStructured)
  const model = typeof o.model === 'string' ? o.model : undefined
  return { answer, structured, model }
}

/**
 * UI 스레드({ role, text }) → API history({ role, content })
 * @param {Array<{ role: string, text?: string, content?: string }>} items
 * @returns {Array<{ role: 'user' | 'assistant', content: string }>}
 */
export function toChatHistoryPayload(items) {
  if (!Array.isArray(items)) return []
  return items
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant'))
    .map((m) => ({
      role: m.role,
      content: String(m.text ?? m.content ?? '').trim(),
    }))
    .filter((m) => m.content.length > 0)
}

/**
 * @param {string} message - 이번 턴 사용자 메시지
 * @param {string} [language]
 * @param {Array<{ role: 'user' | 'assistant', content: string }>} [history] - message 이전 대화 (백엔드가 Groq messages에 합침)
 */
export async function requestAiChat(message, language = 'ko', history = []) {
  const res = await fetch(`${AI_CHAT_BASE_URL}/api/v1/ai/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      language,
      history: Array.isArray(history) ? history : [],
    }),
  })

  const text = await res.text()
  let data = {}
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    data = { answer: text }
  }

  if (!res.ok) {
    throw new Error(data?.message || 'AI 챗 응답을 가져오지 못했습니다.')
  }

  return normalizeAiChatResponse(data)
}

