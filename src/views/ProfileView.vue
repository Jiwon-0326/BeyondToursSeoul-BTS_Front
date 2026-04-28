<script setup>
import { Bell, Globe, Settings, UserRound } from 'lucide-vue-next'

const menuItems = [
  { id: 'lang', icon: Globe, label: '언어 설정', value: '한국어' },
  { id: 'alarm', icon: Bell, label: '알림 설정', value: '켜짐' },
  { id: 'pref', icon: Settings, label: '여행 취향 관리', value: '수정 가능' },
]
</script>

<template>
  <div class="profile">
    <header class="profile__header">
      <div class="profile__avatar">
        <UserRound :size="30" :stroke-width="2.1" />
      </div>
      <div>
        <h1>마이페이지</h1>
        <p>Beyond Tours Seoul 계정</p>
      </div>
    </header>

    <section class="profile__card">
      <p class="profile__name">Explorer 님</p>
      <p class="profile__email">explorer@bts.app</p>
    </section>

    <section class="profile__menu">
      <button v-for="item in menuItems" :key="item.id" class="profile__menu-item" type="button">
        <span class="profile__menu-left">
          <component :is="item.icon" :size="16" :stroke-width="2.2" />
          <span>{{ item.label }}</span>
        </span>
        <span class="profile__menu-value">{{ item.value }}</span>
      </button>
    </section>
  </div>
</template>

<style scoped>
.profile {
  min-height: 100dvh;
  background: #f5f4f0;
  padding: 18px 16px 92px;
}

.profile__header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile__avatar {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: linear-gradient(160deg, #ffba4d 0%, #fe9c00 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile__header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  color: #1f1f1f;
}

.profile__header p {
  margin: 4px 0 0;
  font-size: 13px;
  color: #7d7d7d;
}

.profile__card {
  margin-top: 14px;
  background: #fff;
  border: 1px solid #f0ece5;
  border-radius: 14px;
  padding: 14px;
}

.profile__name {
  margin: 0;
  font-size: 15px;
  font-weight: 800;
  color: #222;
}

.profile__email {
  margin: 6px 0 0;
  font-size: 12px;
  color: #7d7d7d;
}

.profile__menu {
  margin-top: 14px;
  display: grid;
  gap: 8px;
}

.profile__menu-item {
  width: 100%;
  border: 1px solid #f0ece5;
  border-radius: 12px;
  background: #fff;
  padding: 11px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.profile__menu-left {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #333;
  font-size: 13px;
  font-weight: 700;
}

.profile__menu-value {
  color: #8b8b8b;
  font-size: 12px;
  font-weight: 700;
}
</style>
