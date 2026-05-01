<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const router = useRouter()
const authStore = useAuthStore()
const status = ref('로그인 정보를 확인 중입니다...')

function readFromUrl() {
  const url = new URL(window.location.href)
  const query = url.searchParams
  const hash = new URLSearchParams(url.hash.replace(/^#/, ''))

  const pick = (key) => query.get(key) || hash.get(key) || ''

  return {
    accessToken: pick('accessToken') || pick('access_token'),
    refreshToken: pick('refreshToken') || pick('refresh_token'),
    tokenType: pick('tokenType') || pick('token_type') || 'Bearer',
    expiresIn: Number(pick('expiresIn') || pick('expires_in') || 0),
    email: pick('email'),
    userId: pick('userId') || pick('user_id'),
  }
}

onMounted(async () => {
  try {
    const payload = readFromUrl()
    if (!payload.accessToken) {
      status.value = '토큰을 찾지 못했습니다. 로그인 화면으로 이동합니다.'
      setTimeout(() => router.replace('/'), 1200)
      return
    }

    authStore.setSession(payload)
    await authStore.loadMe().catch(() => null)
    status.value = '로그인 완료! 홈으로 이동합니다.'
    setTimeout(() => router.replace('/discover'), 500)
  } catch {
    status.value = '로그인 처리 중 오류가 발생했습니다.'
    setTimeout(() => router.replace('/'), 1200)
  }
})
</script>

<template>
  <div class="auth-callback">
    <p>{{ status }}</p>
  </div>
</template>

<style scoped>
.auth-callback {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #f5f4f0;
  color: #444;
  font-size: 14px;
  font-weight: 700;
}
</style>

