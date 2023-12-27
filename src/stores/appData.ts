import { reactive } from 'vue'
import { defineStore } from 'pinia'
// import VConsole from 'vconsole'
// const vConsole = new VConsole()

export const defaultAppData: AppData = {
  isInApp: false,
  isLogin: false,
  auth: '',
}

export const useAppData = defineStore('appData', () => {
  const appData = reactive(window.appData || defaultAppData)
  return appData
})