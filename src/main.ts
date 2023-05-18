import '@/common/bridge'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@/App.vue'
import router from '@/router'

import 'normalize.css'
import '@/assets/main.css'

const app = createApp(App)

app.directive('visible', (el, bind) => {
  el.style.visibility=(bind.value) ? 'visible' : 'hidden'
})

app.use(createPinia())
app.use(router)

let mountFlag = false
if (navigator.userAgent.indexOf('fscl_app') > -1) {
  console.log('env: app')
  window.onAppReady = (appDataStr) => {
    if (mountFlag) {
      return
    }
    console.log(`onAppReady param: ${appDataStr}`)
    try {
      const appData = JSON.parse(appDataStr)
      window.appData = {
        ...appData,
        isInApp: true,
      }
    } catch(err) {
      console.log(err)
    }
    console.log(`appData: ${JSON.stringify(window.appData)}`)
    console.log('app launching..')
    mountFlag = true
    app.mount('#app')
  }
} else {
  console.log('env: h5')
  console.log(`appData: ${JSON.stringify(window.appData)}`)
  console.log('h5 launching..')
  mountFlag = true
  app.mount('#app')
}