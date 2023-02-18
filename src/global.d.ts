declare interface AppBridge {
  isInApp: boolean
  isLogin: boolean
}

declare const appBridge: AppBridge | undefined