import type { InjectionKey } from 'vue'

export const AppDownloadUrl = {
  fsclIos: import.meta.env.VITE_FSCL_APP_DOWNLOAD_URL_IOS,
  fsclAndroid: import.meta.env.VITE_FSCL_APP_DOWNLOAD_URL_ANDROID,
  xueyuanIos: import.meta.env.VITE_XUEYUAN_APP_DOWNLOAD_URL_IOS,
  xueyuanAndroid: import.meta.env.VITE_XUEYUAN_APP_DOWNLOAD_URL_ANDROID,
}

export const ErrorMsg = {
  common: '系统异常，请稍后重试',
  unauthorized: '用户未登录',
  resourceLoadError: '资源加载异常',
  unExistDownloadUrl: '抱歉，暂不支持当前系统',
}

export const GlobalProvideKey = {
  bridge: Symbol() as InjectionKey<AppBridge>
}

export const defaultBridge: AppBridge = {
  isInApp: false,
  isLogin: false,
}