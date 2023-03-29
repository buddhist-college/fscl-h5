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
}