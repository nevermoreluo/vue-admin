import { createRouter, createWebHistory } from 'vue-router'
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import HomeView from '@/views/HomeView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
        },
        {
          path: 'log',
          name: 'log',
          component: () => import('@/views/LogView.vue')
        },
        {
          path: 'devicelist',
          name: 'devicelist',
          component: () => import('@/views/DeviceListView.vue')
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('@/views/AboutView.vue'),
        },

      ],
    },
  ],
})

// 路由守卫：检查登录状态
router.beforeEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const token = localStorage.getItem('token')
    const isAuthenticated = !!token

    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

    if (requiresAuth) {
      if (!isAuthenticated) {
        // 未登录，跳转到登录页
        next({ name: 'login', query: { redirect: to.fullPath } })
      } else {
        // 已登录，允许访问
        next()
      }
    } else {
      // 登录页面，如果已登录则跳转到首页
      if (to.name === 'login' && isAuthenticated) {
        next({ name: 'home' })
      } else {
        next()
      }
    }
  },
)

export default router
