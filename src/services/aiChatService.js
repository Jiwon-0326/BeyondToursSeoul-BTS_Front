const AI_CHAT_BASE_URL =
  import.meta.env.VITE_AI_CHAT_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL_LOCAL ||
  'http://localhost:8080'

export async function requestAiChat(message, language = 'ko') {
  const res = await fetch(`${AI_CHAT_BASE_URL}/api/v1/ai/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, language }),
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

