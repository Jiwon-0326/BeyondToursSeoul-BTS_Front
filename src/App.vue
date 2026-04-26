<script setup>
import MainLayout from '@/components/layout/MainLayout.vue'
</script>

<template>
  <MainLayout>
    <RouterView />
  </MainLayout>
</template>

<style>
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --color-primary: #FE9C00;
  --color-bg: #fafaf8;
  --color-text: #1a1a1a;
  --color-muted: #888;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans KR', sans-serif;
  -webkit-font-smoothing: antialiased;
}

body {
  background: #f0f0ec;
}

button {
  font-family: inherit;
}
</style>
