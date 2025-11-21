<template>
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <div class="login-box">
      <div class="info-panel pc-only">
        <div class="info-header">
          <span class="badge">{{ t('login.badge') }}</span>
          <h1>{{ t('login.heroTitle') }}</h1>
          <p>{{ t('login.heroDescription') }}</p>
        </div>

        <!-- <div class="stat-cards">
          <div v-for="item in stats" :key="item.label" class="stat-card">
            <p class="stat-label">{{ item.label }}</p>
            <p class="stat-value">{{ item.value }}</p>
            <span
              class="stat-trend"
              :class="{ up: item.trend === 'up', down: item.trend === 'down' }"
            >
              {{ item.delta }}
            </span>
          </div>
        </div> -->

        <div class="info-highlights">
          <div v-for="feature in highlights" :key="feature.title" class="highlight-item">
            <div class="highlight-icon">{{ feature.icon }}</div>
            <div>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <el-card class="login-card" shadow="hover">
        <!-- Logo区域 -->
        <template #header>
          <div class="logo-section">
            <div class="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <h2 class="login-title">{{ t('login.cardTitle') }}</h2>
            <p class="login-subtitle">{{ t('login.cardSubtitle') }}</p>
          </div>
        </template>

        <el-form
          ref="formRef"
          :model="loginForm"
          :rules="rules"
          label-position="top"
          class="login-form"
          @submit.prevent="handleLogin"
        >
          <el-form-item :label="t('login.form.usernameLabel')" prop="name">
            <el-input
              v-model="loginForm.name"
              :placeholder="t('login.form.usernamePlaceholder')"
              autocomplete="username"
              clearable
            />
          </el-form-item>

          <el-form-item :label="t('login.form.passwordLabel')" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              :placeholder="t('login.form.passwordPlaceholder')"
              autocomplete="current-password"
              show-password
              clearable
            />
          </el-form-item>

          <el-form-item>
            <div class="form-extra">
              <el-checkbox v-model="rememberMe">{{ t('login.options.rememberMe') }}</el-checkbox>
              <div class="link-group">
                <el-link type="primary" @click.prevent="handleForgotPassword">
                  {{ t('login.options.forgot') }}
                </el-link>
                <el-divider direction="vertical" />
                <el-link type="success" @click.prevent="handleRegister">
                  {{ t('login.options.register') }}
                </el-link>
              </div>
            </div>
          </el-form-item>

          <el-form-item v-if="errorMessage">
            <div class="error-message">
              {{ errorMessage }}
            </div>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              class="login-button"
              :loading="loading"
              native-type="submit"
              round
              block
            >
              {{ t('login.actions.signIn') }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { loginApi, type LoginParams } from '@/api/login'

const router = useRouter()
const route = useRoute()
const { t, tm } = useI18n()

const loginForm = ref<LoginParams>({
  name: '',
  password: '',
})

const formRef = ref()
const rules = computed(() => ({
  name: [{ required: true, message: t('login.form.nameRequired'), trigger: 'blur' }],
  password: [{ required: true, message: t('login.form.passwordRequired'), trigger: 'blur' }],
}))

type HighlightItem = { icon: string; title: string; desc: string }
// type StatItem = { label: string; value: string; delta: string; trend: 'up' | 'down' }

const toArray = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) {
    return value as T[]
  }
  return []
}

const highlights = computed<HighlightItem[]>(() => toArray<HighlightItem>(tm('login.highlights')))
// const stats = computed<StatItem[]>(() => toArray<StatItem>(tm('login.stats')))

const loading = ref(false)
const errorMessage = ref('')
const rememberMe = ref(false)

onMounted(() => {
  const cachedName = localStorage.getItem('remembered-name')
  const rememberFlag = localStorage.getItem('remember-me') === 'true'
  if (rememberFlag) {
    rememberMe.value = true
    if (cachedName) {
      loginForm.value.name = cachedName
    }
  }
})

const handleForgotPassword = () => {
  ElMessage.info(t('login.messages.forgot'))
}

const handleRegister = () => {
  ElMessage.success(t('login.messages.register'))
}

const handleLogin = async () => {
  if (!formRef.value) return

  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  errorMessage.value = ''

  try {
    const response = await loginApi(loginForm.value)
    // 登录成功处理
    if (response['sk-token']) {
      // 保存token到localStorage
      localStorage.setItem('token', response['sk-token'])
    }
    if (rememberMe.value) {
      localStorage.setItem('remember-me', 'true')
      localStorage.setItem('remembered-name', loginForm.value.name)
    } else {
      localStorage.removeItem('remember-me')
      localStorage.removeItem('remembered-name')
    }
    // 跳转到原页面或首页
    const redirect = route.query.redirect as string
    router.push(redirect || '/')
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string }
    errorMessage.value =
      err?.response?.data?.message || err?.message || t('login.messages.authFailed')
    ElMessage.error(errorMessage.value)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.pc-only {
  display: block;
  @media (max-width: 768px) {
    display: none;
  }
}

.login-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  overflow: hidden;
}

/* 背景装饰 */
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 20s infinite ease-in-out;
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.circle-2 {
  width: 200px;
  height: 200px;
  bottom: -50px;
  right: -50px;
  animation-delay: 5s;
}

.circle-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  right: 10%;
  animation-delay: 10s;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.login-box {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(300px, 480px) minmax(320px, 420px);
  gap: 32px;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 32px;
  padding: 40px;
  box-shadow: 0 30px 80px rgba(15, 27, 68, 0.2);
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.info-panel {
  background: linear-gradient(165deg, rgba(255, 255, 255, 0.95), rgba(235, 238, 255, 0.85));
  border-radius: 24px;
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.info-header {
  margin-bottom: 28px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  letter-spacing: 0.2em;
  color: #5d5fef;
  background: rgba(93, 95, 239, 0.1);
  padding: 4px 12px;
  border-radius: 999px;
}

.info-header h1 {
  margin: 16px 0 10px;
  font-size: 28px;
  line-height: 1.3;
  color: #1b2559;
}

.info-header p {
  margin: 0;
  color: #4f566b;
  line-height: 1.6;
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 18px;
  padding: 16px;
  border: 1px solid rgba(91, 105, 255, 0.1);
  box-shadow: 0 15px 30px rgba(93, 95, 239, 0.08);
}

.stat-label {
  margin: 0;
  font-size: 13px;
  color: #7f8fa6;
}

.stat-value {
  margin: 8px 0 4px;
  font-size: 26px;
  font-weight: 700;
  color: #1b2559;
}

.stat-trend {
  font-size: 12px;
  color: #7f8fa6;
}

.stat-trend.up {
  color: #1abc9c;
}

.stat-trend.down {
  color: #ff7675;
}

.info-highlights {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.highlight-item {
  display: flex;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(91, 105, 255, 0.08);
  box-shadow: 0 10px 25px rgba(15, 27, 68, 0.08);
}

.highlight-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(93, 95, 239, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.highlight-item h3 {
  margin: 0 0 4px;
  font-size: 15px;
  color: #1b2559;
}

.highlight-item p {
  margin: 0;
  font-size: 13px;
  color: #5f6c7b;
}

.login-card {
  border-radius: 24px;
  border: none;
  box-shadow: 0 20px 45px rgba(15, 27, 68, 0.15);
}

.logo-section {
  text-align: center;
}

.logo-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  color: #667eea;
  animation: pulse 2s infinite;
}

.logo-icon svg {
  width: 100%;
  height: 100%;
}

.login-title {
  margin: 0 0 8px 0;
  color: #1a1a1a;
  font-size: 28px;
  font-weight: 700;
}

.login-subtitle {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.login-form {
  margin-top: 8px;
}

.form-extra {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.link-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.login-button {
  width: 100%;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #6f5bff 100%);
  box-shadow: 0 10px 25px rgba(104, 117, 245, 0.4);
}

.error-message {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  background: rgba(255, 107, 107, 0.12);
  color: #ff6b6b;
  border: 1px solid rgba(255, 107, 107, 0.2);
  text-align: center;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .login-box {
    grid-template-columns: 1fr;
    padding: 32px;
  }

  .info-panel {
    order: 2;
  }
}

@media (max-width: 600px) {
  .login-container {
    padding: 16px;
  }

  .login-box {
    padding: 20px;
    border-radius: 20px;
  }

  .info-panel {
    padding: 20px;
  }

  .stat-cards {
    grid-template-columns: 1fr;
  }
}
</style>
