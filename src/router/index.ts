import { createRouter, createWebHashHistory } from 'vue-router'
import AudioDetailView from '@/views/AudioDetailView.vue'
import AudioDetailRecommendView from '@/views/AudioDetailRecommendView.vue'
import VideoDetailView from '@/views/VideoDetailView.vue'
import VideoDetailRecommendView from '@/views/VideoDetailRecommendView.vue'
import ArticleView from '@/views/ArticleView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/audioDetail',
      name: 'audioDetail',
      component: AudioDetailView,
    },
    {
      path: '/audioDetailRecommend',
      name: 'audioDetailRecommend',
      component: AudioDetailRecommendView,
    },
    {
      path: '/videoDetail',
      name: 'videoDetail',
      component: VideoDetailView,
    },
    {
      path: '/VideoDetailRecommend',
      name: 'VideoDetailRecommend',
      component: VideoDetailRecommendView,
    },
    {
      path: '/article',
      name: 'article',
      component: ArticleView,
    },
  ]
})

export default router
