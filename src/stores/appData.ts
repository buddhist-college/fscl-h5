import { reactive } from 'vue'
import { defineStore } from 'pinia'

let div: any = document.createElement('div')
div.innerHTML = `appData: ${typeof window.appData} ${JSON.stringify(window.appData)}`
document.body.appendChild(div)
div = null

export const defaultAppData: AppData = {
  isInApp: false,
  isLogin: false,
}

export const useAppData = defineStore('appData', () => {
  const appData = reactive(window.appData || defaultAppData)

  return appData
})