import { createRouter, createWebHistory } from 'vue-router'
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
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
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/AboutView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

// 路由守卫：检查登录状态
router.beforeEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const token = localStorage.getItem('token')
    const isAuthenticated = !!token

    // 如果路由需要认证
    if (to.meta.requiresAuth) {
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
