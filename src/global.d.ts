declare interface AppData {
  isInApp: boolean
  isLogin: boolean
  auth: string
}

declare interface AppChannel {
  postMessage: (...args: any[]) => void
}

interface Window {
  appData: AppData | undefined,
  appChannel: AppChannel | undefined,
  appBridge: Record<string, any>,
  onAppReady: (params: string) => void,
}