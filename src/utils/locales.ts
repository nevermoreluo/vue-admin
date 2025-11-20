import enCommon from '@/locales/en/common.json'

import zhCNCommon from '@/locales/zh-CN/common.json'

export const commonLocales = {
  en: enCommon,
  'zh-CN': zhCNCommon,
} as const

export const commonLocaleBundles = {
  en: {
    ...enCommon,
  },
  'zh-CN': {
    ...zhCNCommon,
  },
}
