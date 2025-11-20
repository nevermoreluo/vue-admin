import '@/assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { commonLocaleBundles } from '@/utils/locales.ts'

import App from '@/App.vue'
import router from '@/router'

const SUPPORTED_LOCALES: string[] = ['en', 'zh-CN'] as const
const DEFAULT_LOCALE = 'zh-CN'

/**
 * Create i18n instance with proper configuration
 * @param locale - Current locale
 * @param messages - Locale messages
 * @returns Configured i18n instance
 */
const createI18nInstance = (
  locale: string,
  messages: Record<string, Record<string, string | Record<string, unknown>>>,
) => {
  return createI18n({
    locale: SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE,
    fallbackLocale: DEFAULT_LOCALE,
    messages,
    missingWarn: false, // Disable missing key warnings in production
    legacy: false, // 必须设置为 false，否则在 Vue 3 中无法使用 Composition API
    globalInjection: true, // 允许全局使用 $t 方法
  })
}

const messages = {
  en: {
    ...commonLocaleBundles['en'],
  },
  'zh-CN': {
    ...commonLocaleBundles['zh-CN'],
  },
}

const app = createApp(App)
const i18n = createI18nInstance(DEFAULT_LOCALE, messages)
app.use(i18n)
app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')
