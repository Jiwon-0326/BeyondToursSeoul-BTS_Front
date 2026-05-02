<script setup>
import { ref, watch } from 'vue'
import { MessageCircle, Sparkles } from 'lucide-vue-next'
import { requestAiChat } from '@/services/aiChatService'

const props = defineProps({
  summaryText: { type: String, default: '' },
  canSubmitGenerate: { type: Boolean, default: false },
})

const emit = defineEmits(['back', 'generate'])

const thread = ref([])
const chatInput = ref('')
const isChatLoading = ref(false)
const chatError = ref('')

const introAssistant =
  '위에 정리해 주신 일정·취향·추가 요청을 바탕으로 여행 계획을 같이 다듬어 볼게요. 수정하거나 더 넣고 싶은 점은 아래 채팅으로 보내 주세요. 준비되면 「코스 생성」으로 진행할 수 있어요.'

function seedThread() {
  thread.value = [
    { id: 'u0', role: 'user', text: props.summaryText || '(입력 요약)' },
    { id: 'a0', role: 'assistant', text: introAssistant },
  ]
}

watch(
  () => props.summaryText,
  () => seedThread(),
  { immediate: true },
)

async function sendChat() {
  const t = chatInput.value.trim()
  if (!t || isChatLoading.value) return
  chatError.value = ''
  thread.value.push({ id: `u-${Date.now()}`, role: 'user', text: t })
  chatInput.value = ''
  isChatLoading.value = true
  try {
    const data = await requestAiChat(t, 'ko')
    thread.value.push({
      id: `a-${Date.now()}`,
      role: 'assistant',
      text: data.answer || '응답을 받지 못했습니다.',
    })
  } catch (e) {
    chatError.value = e.message || '요청 중 오류가 났어요.'
  } finally {
    isChatLoading.value = false
  }
}
</script>

<template>
  <div class="chat-step">
    <div class="chat-step__head">
      <div class="chat-step__head-label">
        <MessageCircle :size="18" :stroke-width="2.3" class="chat-step__head-icon" />
        <span>AI와 여행 계획</span>
      </div>
      <p class="chat-step__head-sub">
        위 말풍선은 동행·이동·테마·추가 요청까지 반영한 요약이에요. 채팅으로 더 물어보거나 코스를 만들어 보세요.
      </p>
    </div>

    <div class="chat-step__thread">
      <article
        v-for="msg in thread"
        :key="msg.id"
        class="chat-step__bubble"
        :class="
          msg.role === 'user' ? 'chat-step__bubble--user' : 'chat-step__bubble--assistant'
        "
      >
        {{ msg.text }}
      </article>
      <p v-if="chatError" class="chat-step__error">{{ chatError }}</p>
    </div>

    <div class="chat-step__composer">
      <input
        v-model="chatInput"
        class="chat-step__input"
        type="text"
        placeholder="AI에게 질문하기 (예: 비 오는 날 실내 위주로)"
        :disabled="isChatLoading"
        @keydown.enter.prevent="sendChat"
      />
      <button class="chat-step__send" type="button" :disabled="isChatLoading" @click="sendChat">
        {{ isChatLoading ? '…' : '전송' }}
      </button>
    </div>

    <div class="chat-step__actions">
      <button type="button" class="chat-step__ghost" @click="emit('back')">이전</button>
      <button
        type="button"
        class="chat-step__primary"
        :class="{ 'chat-step__primary--disabled': !canSubmitGenerate }"
        :disabled="!canSubmitGenerate"
        @click="emit('generate')"
      >
        <Sparkles :size="18" :stroke-width="2.4" />
        코스 생성
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-step {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
  flex: 1;
  height: 100%;
  overflow: hidden;
}

.chat-step__head-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 800;
  color: #1a1a1a;
}

.chat-step__head-icon {
  color: #fe9c00;
}

.chat-step__head-sub {
  margin: 6px 0 0;
  font-size: 12px;
  color: #888;
  line-height: 1.45;
}

.chat-step__thread {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  border-radius: 14px;
  background: #f7f6f2;
  border: 1px solid #eceae4;
  -webkit-overflow-scrolling: touch;
}

.chat-step__bubble {
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 12px;
  line-height: 1.45;
  white-space: pre-wrap;
  word-break: break-word;
}

.chat-step__bubble--user {
  align-self: flex-end;
  max-width: 92%;
  background: #fe9c00;
  color: #fff;
}

.chat-step__bubble--assistant {
  align-self: flex-start;
  max-width: 92%;
  background: #fff;
  color: #333;
  border: 1px solid #ebe9e4;
}

.chat-step__error {
  margin: 0;
  font-size: 11px;
  color: #ef4444;
}

.chat-step__composer {
  display: flex;
  gap: 8px;
}

.chat-step__input {
  flex: 1;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 13px;
  background: #fff;
}

.chat-step__send {
  flex-shrink: 0;
  padding: 0 14px;
  border: none;
  border-radius: 12px;
  background: #333;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.chat-step__send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chat-step__actions {
  display: grid;
  grid-template-columns: 96px 1fr;
  gap: 10px;
  margin-top: 4px;
}

.chat-step__ghost {
  border: 1px solid #e5e5e5;
  background: #fff;
  color: #666;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 700;
  min-height: 52px;
  cursor: pointer;
}

.chat-step__primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 16px;
  min-height: 52px;
  background: #fe9c00;
  color: #fff;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 18px rgba(254, 156, 0, 0.4);
}

.chat-step__primary--disabled,
.chat-step__primary:disabled {
  background: #e0e0e0;
  color: #aaa;
  box-shadow: none;
  cursor: not-allowed;
}
</style>
