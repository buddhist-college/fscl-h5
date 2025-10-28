import { createRouter, createWebHashHistory } from 'vue-router'
import AudioDetailView from '@/views/AudioDetailView.vue'
import AudiosView from '@/views/AudiosView.vue'
import VideoDetailView from '@/views/VideoDetailView.vue'
import VideosView from '@/views/VideosView.vue'
import ArticleView from '@/views/ArticleView.vue'
import DownloadView from '@/views/DownloadView.vue'
import LiveView from '@/views/LiveView.vue'
import DeleteAccountView from '@/views/DeleteAccountView.vue'
import i18n from '@/locales'
import { setItem } from '@/common/storage'
import { LocalStorageKeys } from '@/common/config'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/intro/:id',
      name: 'intro',
      component: ArticleView,
    },
    {
      path: '/article/:id',
      name: 'article',
      component: ArticleView,
    },
    {
      path: '/audioDetail/:id',
      name: 'audioDetail',
      component: AudioDetailView,
    },
    {
      path: '/audios/:id',
      name: 'audios',
      component: AudiosView,
    },
    {
      path: '/videoDetail/:id',
      name: 'videoDetail',
      component: VideoDetailView,
    },
    {
      path: '/videos/:id',
      name: 'videos',
      component: VideosView,
    },
    {
      path: '/download/:type',
      name: 'download',
      component: DownloadView,
    },
    {
      path: '/live/:channel?',
      name: 'live',
      component: LiveView,
    },
    {
      path: '/deleteAccount',
      name: 'deleteAccount',
      component: DeleteAccountView
    },
  ]
})

// router.beforeEach((to) => {
//   const lang = (to.query.lang as string)?.toLowerCase()
  
//   if (lang) {
//     let locale: 'zh-TW' | 'zh-CN' | null = null
    
//     if (lang === 'zh-hant') {
//       locale = 'zh-TW'
//     } else if (lang === 'zh-hans') {
//       locale = 'zh-CN'
//     }

//     if (locale && i18n.global.locale.value !== locale) {
//       i18n.global.locale.value = locale
//       setItem(LocalStorageKeys.appLanguage, locale)
//     }
//   }
// })

export default router
