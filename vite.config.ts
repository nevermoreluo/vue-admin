import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  build: {
    // 拆分 chunk 规则
    rollupOptions: {
      output: {
        // 自定义 chunk 拆分
        manualChunks: {
          // 将 vue/vue-router 等核心库拆分为 vendor chunk
          vendor: ['vue', 'vue-router', 'pinia'],
          // 将 echarts 单独拆分为 echarts chunk
          echarts: ['echarts'],
          // 将 element-plus 单独拆分
          elementPlus: ['element-plus'],
        },
      },
    },
    // 可选：调整警告阈值（若仍有警告，临时调高）
    chunkSizeWarningLimit: 500, // 单位：kB，默认500
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
