<template>
  <el-container class="admin-layout">
    <AppSidebar :collapse="isCollapse" />

    <el-container class="main-container">
      <AppHeader 
        :collapse="isCollapse" 
        @update:collapse="isCollapse = $event" 
      />
      
      <el-main class="admin-main">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from '@/layouts/components/AppSidebar.vue'
import AppHeader from '@/layouts/components/AppHeader.vue'

const isCollapse = ref(false)
</script>

<style scoped>
.admin-layout {
  height: 100vh;
  background: #f8fafc;
}

.main-container {
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.admin-main {
  padding: 24px;
  background: #f8fafc;
  overflow-y: auto;
  position: relative;
}

/* Page transition */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s ease;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>

