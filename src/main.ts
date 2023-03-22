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

app.mount('#app')
