import { reactive } from 'vue'
import { defineStore } from 'pinia'

console.log(`appData: ${JSON.stringify(window.appData)}`)

export const defaultAppData: AppData = {
  isInApp: false,
  isLogin: false,
}

export const useAppData = defineStore('appData', () => {
  const appData = reactive(window.appData || defaultAppData)

  return appData
})