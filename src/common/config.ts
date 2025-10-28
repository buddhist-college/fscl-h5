export const AppDownloadUrl = {
  fsclIos: import.meta.env.VITE_FSCL_APP_DOWNLOAD_URL_IOS,
  fsclAndroid: import.meta.env.VITE_FSCL_APP_DOWNLOAD_URL_ANDROID,
  xueyuanIos: import.meta.env.VITE_XUEYUAN_APP_DOWNLOAD_URL_IOS,
  xueyuanAndroid: import.meta.env.VITE_XUEYUAN_APP_DOWNLOAD_URL_ANDROID,
}

export const playHistoryLimit = 10

export const LocalStorageKeys = {
  playHistory: 'PLAY_HISTORY',
  appLanguage: 'APP_LANGUAGE',
}

export const TimingSettingOptions = [
  'initial',
  'stopAfterCurrentEpisode',
  'stopAfter30Minutes',
  'stopAfter60Minutes',
] as const

export const PlaybackRateOptions = [2, 1.5, 1.25, 1, 0.75, 0.5] as const
