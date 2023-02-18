import { createRouter, createWebHashHistory } from 'vue-router'
import AudioDetailView from '@/views/AudioDetailView.vue'
import AudiosView from '@/views/AudiosView.vue'
import VideoDetailView from '@/views/VideoDetailView.vue'
import VideosView from '@/views/VideosView.vue'
import ArticleView from '@/views/ArticleView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
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
      path: '/article/:id',
      name: 'article',
      component: ArticleView,
    },
  ]
})

export default router
