import { reactive } from 'vue'
import { defineStore } from 'pinia'
import VConsole from 'vconsole'
const vConsole = new VConsole()

console.log(`appData: ${JSON.stringify(window.appData)}`)

export const defaultAppData: AppData = {
  isInApp: true,
  isLogin: true,
}

export const useAppData = defineStore('appData', () => {
  const appData = reactive(window.appData || defaultAppData)

  return appData
})