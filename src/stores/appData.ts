import { reactive } from 'vue'
import { defineStore } from 'pinia'
import VConsole from 'vconsole'
const vConsole = new VConsole()

export const defaultAppData: AppData = {
  isInApp: false,
  isLogin: false,
}

export const useAppData = defineStore('appData', () => {
  console.log(`appData: ${JSON.stringify(window.appData)}`)
  const appData = reactive(window.appData || defaultAppData)

  return appData
})