<template>
  <el-container class="admin-layout">
    <el-aside :width="isCollapse ? '64px' : '220px'" class="admin-aside">
      <div class="brand" @click="goHome">
        <el-icon class="brand-icon"><Cpu /></el-icon>
        <span v-if="!isCollapse">Vue Admin</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        background-color="transparent"
        class="admin-menu"
        router
      >
        <el-menu-item index="/">
          <el-icon><House /></el-icon>
          <span>{{ t('layout.menu.home') }}</span>
        </el-menu-item>
        <el-menu-item index="/about">
          <el-icon><InfoFilled /></el-icon>
          <span>{{ t('layout.menu.about') }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="admin-header">
        <div class="header-left">
          <el-button text circle class="collapse-btn" @click="toggleCollapse">
            <el-icon>
              <component :is="isCollapse ? Expand : Fold" />
            </el-icon>
          </el-button>
          <h1>{{ t('layout.title') }}</h1>
        </div>
        <div class="header-right">
          <el-select
            v-model="currentLocale"
            class="lang-select"
            size="small"
            @change="changeLocale"
          >
            <el-option label="中文" value="zh-CN" />
            <el-option label="English" value="en" />
          </el-select>
          <el-dropdown trigger="click" @command="handleCommand">
            <span class="user-area">
              <el-avatar size="small">
                <el-icon><UserFilled /></el-icon>
              </el-avatar>
              <span class="user-name">{{ t('layout.user.greeting') }}, Admin</span>
              <el-icon><CaretBottom /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">
                  {{ t('layout.user.logout') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="admin-main">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  CaretBottom,
  Cpu,
  Expand,
  Fold,
  House,
  InfoFilled,
  UserFilled,
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const { t, locale } = useI18n()

const isCollapse = ref(false)
const currentLocale = ref(locale.value)

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const goHome = () => {
  router.push('/')
}

const activeMenu = computed(() => route.path || '/')

const changeLocale = (value: string) => {
  locale.value = value
  localStorage.setItem('preferred-locale', value)
}

const handleCommand = (command: string) => {
  if (command === 'logout') {
    localStorage.removeItem('token')
    router.replace({ name: 'login' })
  }
}
</script>

<style scoped>
.admin-layout {
  height: 100vh;
  background: #f5f6fb;
}

.admin-aside {
  background: #111a34;
  color: #fff;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px 16px;
  font-weight: 600;
  cursor: pointer;
  color: #fff;
}

.brand-icon {
  font-size: 22px;
}

.admin-menu {
  border-right: none;
  color: rgba(255, 255, 255, 0.9);
}

.admin-menu :deep(.el-menu-item) {
  color: rgba(255, 255, 255, 0.7);
}

.admin-menu :deep(.el-menu-item.is-active) {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-left h1 {
  font-size: 18px;
  margin: 0;
}

.collapse-btn {
  font-size: 18px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.lang-select {
  width: 120px;
}

.user-area {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #1f2d3d;
}

.user-name {
  font-weight: 500;
}

.admin-main {
  padding: 20px;
  background: #f5f6fb;
  overflow-y: auto;
}
</style>

