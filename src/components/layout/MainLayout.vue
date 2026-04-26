<script setup>
import BottomNav from './BottomNav.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const hideNavRoutes = ['/']
</script>

<template>
  <div class="main-layout">
    <main class="main-layout__content">
      <slot />
    </main>
    <BottomNav v-if="!hideNavRoutes.includes(route.path)" />
  </div>
</template>

<style scoped>
.main-layout {
  max-width: 430px;
  margin: 0 auto;
  min-height: 100dvh;
  position: relative;
  background: #fafaf8;
  overflow-x: hidden;
}

.main-layout__content {
  width: 100%;
}
</style>
