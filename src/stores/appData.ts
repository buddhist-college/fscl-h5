import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const defaultAppData: AppData = {
  isInApp: false,
  isLogin: false,
}

export const useAppData = defineStore('appData', () => {
  const appData = reactive(window.appData || defaultAppData)

  return appData
})