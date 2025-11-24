<template>
  <el-aside :width="collapse ? '64px' : '240px'" class="app-sidebar">
    <div class="brand" @click="goHome">
      <div class="logo-container">
        <el-icon class="brand-icon" :class="{ 'is-spinning': !collapse }"><Cpu /></el-icon>
      </div>
      <transition name="fade">
        <span v-if="!collapse" class="brand-text">Vue Admin</span>
      </transition>
    </div>
    
    <el-scrollbar>
      <el-menu
        :default-active="activeMenu"
        :collapse="collapse"
        background-color="transparent"
        text-color="#a0aec0"
        active-text-color="#fff"
        class="sidebar-menu"
        :collapse-transition="false"
        router
      >
        <el-menu-item index="/">
          <el-icon><House /></el-icon>
          <template #title>
            <span>{{ t('layout.menu.home') }}</span>
          </template>
        </el-menu-item>
        
        <el-menu-item index="/about">
          <el-icon><InfoFilled /></el-icon>
          <template #title>
            <span>{{ t('layout.menu.about') }}</span>
          </template>
        </el-menu-item>
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  Cpu,
  House,
  InfoFilled,
} from '@element-plus/icons-vue'

const props = defineProps<{
  collapse: boolean
}>()

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const goHome = () => {
  router.push('/')
}

const activeMenu = computed(() => route.path || '/')
</script>

<style scoped>
.app-sidebar {
  background: #0f172a; /* Slate 900 */
  color: #fff;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 4px 0 24px 0 rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.brand {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  overflow: hidden;
}

.logo-container {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  flex-shrink: 0;
}

.brand-icon {
  font-size: 20px;
  color: #fff;
}

.brand-text {
  margin-left: 12px;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  letter-spacing: 0.5px;
  background: linear-gradient(90deg, #fff, #94a3b8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.sidebar-menu {
  border-right: none;
  padding: 16px 8px;
}

.sidebar-menu :deep(.el-menu-item) {
  border-radius: 8px;
  margin-bottom: 4px;
  height: 50px;
  line-height: 50px;
}

.sidebar-menu :deep(.el-menu-item:hover) {
  background-color: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  color: #fff;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.sidebar-menu :deep(.el-menu-item .el-icon) {
  font-size: 20px;
  margin-right: 12px;
  transition: transform 0.3s;
}

.sidebar-menu :deep(.el-menu-item.is-active .el-icon) {
  transform: scale(1.1);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
