const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
const GOOGLE_AUTH_URL =
  import.meta.env.VITE_GOOGLE_AUTH_URL || `${API_BASE_URL}/api/v1/auth/google`

function buildUrl(path) {
  return `${API_BASE_URL}${path}`
}

async function parseJson(res) {
  const text = await res.text()
  if (!text) return {}
  try {
    return JSON.parse(text)
  } catch {
    return { message: text }
  }
}

export async function loginWithEmail({ email, password }) {
  const res = await fetch(buildUrl('/api/v1/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await parseJson(res)
  if (!res.ok) throw new Error(data.message || '로그인에 실패했습니다.')
  return data
}

export async function fetchMe(accessToken) {
  const res = await fetch(buildUrl('/api/v1/auth/me'), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  const data = await parseJson(res)
  if (!res.ok) throw new Error(data.message || '내 정보 조회에 실패했습니다.')
  return data
}

export function getGoogleLoginUrl() {
  return GOOGLE_AUTH_URL
}

