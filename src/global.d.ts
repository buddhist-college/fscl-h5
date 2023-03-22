declare interface AppData {
  isInApp: boolean
  isLogin: boolean
}

declare interface AppChannel {
  postMessage: (...args: any[]) => void
}

interface Window {
  appData: AppData | undefined,
  appChannel: AppChannel | undefined,
  appBridge: Record<string, any>,
}