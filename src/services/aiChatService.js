const AI_CHAT_BASE_URL =
  import.meta.env.VITE_AI_CHAT_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL_LOCAL ||
  'http://localhost:8080'

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

  return data
}

