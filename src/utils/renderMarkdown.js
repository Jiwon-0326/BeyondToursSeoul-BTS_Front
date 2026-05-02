import { marked } from 'marked'

marked.setOptions({
  breaks: true,
})

/** 백엔드 answer 필드(Markdown) → 안전하게 HTML로 (어시스턴트 말풍선용) */
export function renderMarkdownHtml(src) {
  const s = src == null ? '' : String(src)
  if (!s.trim()) return ''
  return marked.parse(s)
}
