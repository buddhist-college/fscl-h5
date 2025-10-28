import { createI18n } from 'vue-i18n'
import { getItem, setItem } from '@/common/storage'
import { LocalStorageKeys } from '@/common/config'

import zhCN from '@/locales/zh-CN.json'
import zhTW from '@/locales/zh-TW.json'

// 将 URL 的 lang 参数转换为内部 locale
function convertLangToLocale(lang: string | null): string | null {
  if (lang === 'zh-hant') {
    return 'zh-TW'
  } else if (lang === 'zh-hans') {
    return 'zh-CN'
  }
  return null
}

// 从 URL Hash 参数中获取语言设置
function getLanguageFromUrl(): string | null {
  const hash = window.location.hash
  const queryString = hash.split('?')[1]
  
  if (queryString) {
    const hashParams = new URLSearchParams(queryString)
    const lang = hashParams.get('lang')?.toLowerCase() || null
    return convertLangToLocale(lang)
  }
  
  return null
}

// 获取初始语言设置
function getInitialLanguage(): string {
  // 1. 优先从 URL 参数获取
  const urlLang = getLanguageFromUrl()
  if (urlLang) {
    // 保存到 storage
    setItem(LocalStorageKeys.appLanguage, urlLang)
    return urlLang
  }
  
  // 2. 从 storage 中读取
  const storedLang = getItem(LocalStorageKeys.appLanguage)
  if (storedLang && (storedLang === 'zh-CN' || storedLang === 'zh-TW')) {
    return storedLang
  }
  
  // 3. 默认返回繁体中文
  return 'zh-TW'
}

const i18n = createI18n({
  legacy: false,
  locale: getInitialLanguage(),
  fallbackLocale: 'zh-TW',
  messages: {
    'zh-TW': zhTW,
    'zh-CN': zhCN,
  },
})

export default i18n