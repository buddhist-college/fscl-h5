export const AppDownloadUrl = {
  fsclIos: import.meta.env.VITE_FSCL_APP_DOWNLOAD_URL_IOS,
  fsclAndroid: import.meta.env.VITE_FSCL_APP_DOWNLOAD_URL_ANDROID,
  xueyuanIos: import.meta.env.VITE_XUEYUAN_APP_DOWNLOAD_URL_IOS,
  xueyuanAndroid: import.meta.env.VITE_XUEYUAN_APP_DOWNLOAD_URL_ANDROID,
}

export const ErrorMsg = {
  common: '系統異常，請稍後重試',
  unauthorized: '用戶未登錄',
  resourceLoadError: '資源加載異常',
  unExistDownloadUrl: '抱歉，暫不支持當前系統',
  hlsNotSupported: '抱歉，暫不支持當前系統',
  loginInfoRequired: '請填寫用戶名和密碼',
}

export const TimingSettingOptions = [
  'initial',
  'stopAfterCurrentEpisode',
  'stopAfter30Minutes',
  'stopAfter60Minutes',
] as const

export const PlaybackRateOptions = [
  { label: '2倍', value: 2 },
  { label: '1.5倍', value: 1.5 },
  { label: '1.25倍', value: 1.25 },
  { label: '1倍', value: 1 },
  { label: '0.75倍', value: 0.75 },
  { label: '0.5倍', value: 0.5 },
]