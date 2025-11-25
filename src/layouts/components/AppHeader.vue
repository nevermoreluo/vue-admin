<template>
  <el-header class="app-header">
    <div class="header-left">
      <div class="collapse-btn" @click="toggleCollapse">
        <el-icon :size="20" :class="{ 'is-active': !collapse }">
          <component :is="collapse ? Expand : Fold" />
        </el-icon>
      </div>
      <h1 class="page-title">{{ t('layout.title') }}</h1>
    </div>
    
    <div class="header-right">
      <div class="action-item">
        <el-dropdown trigger="click" @command="changeLocale">
          <span class="lang-trigger">
            <span class="lang-text">{{ currentLocale === 'zh-CN' ? '中文' : 'EN' }}</span>
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="zh-CN" :disabled="currentLocale === 'zh-CN'">中文</el-dropdown-item>
              <el-dropdown-item command="en" :disabled="currentLocale === 'en'">English</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <div class="divider"></div>

      <el-dropdown trigger="click" @command="handleCommand">
        <div class="user-profile">
          <el-avatar :size="32" class="user-avatar">
            <el-icon><UserFilled /></el-icon>
          </el-avatar>
          <div class="user-info">
            <span class="user-name">Admin</span>
            <span class="user-role">{{ t('layout.user.greeting') }}</span>
          </div>
          <el-icon class="el-icon--right"><CaretBottom /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu class="user-dropdown">
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>
              Profile
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>
              {{ t('layout.user.logout') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  CaretBottom,
  Expand,
  Fold,
  UserFilled,
  ArrowDown,
  User,
  SwitchButton
} from '@element-plus/icons-vue'

const props = defineProps<{
  collapse: boolean
}>()

const emit = defineEmits<{
  (e: 'update:collapse', value: boolean): void
}>()

const router = useRouter()
const { t, locale } = useI18n()
const currentLocale = ref(locale.value)

const toggleCollapse = () => {
  emit('update:collapse', !props.collapse)
}

const changeLocale = (value: string) => {
  currentLocale.value = value
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
.app-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 9;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;
}

.collapse-btn:hover {
  background: #f1f5f9;
  color: #3b82f6;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.action-item {
  display: flex;
  align-items: center;
}

.lang-trigger {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 6px;
  transition: background 0.2s;
  color: #64748b;
  font-size: 14px;
}

.lang-trigger:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.divider {
  width: 1px;
  height: 24px;
  background: #e2e8f0;
  margin: 0 8px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background 0.2s;
}

.user-profile:hover {
  background: #f1f5f9;
}

.user-avatar {
  background: #eff6ff;
  color: #3b82f6;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.user-info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.user-role {
  font-size: 12px;
  color: #94a3b8;
}

.el-icon--right {
  color: #94a3b8;
  font-size: 12px;
}
</style>
