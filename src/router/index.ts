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
      path: '/audioDetail/:id',
      name: 'audioDetail',
      component: AudioDetailView,
    },
    {
      path: '/audioDetailRecommend/:id',
      name: 'audioDetailRecommend',
      component: AudioDetailRecommendView,
    },
    {
      path: '/videoDetail/:id',
      name: 'videoDetail',
      component: VideoDetailView,
    },
    {
      path: '/VideoDetailRecommend/:id',
      name: 'VideoDetailRecommend',
      component: VideoDetailRecommendView,
    },
    {
      path: '/article/:id',
      name: 'article',
      component: ArticleView,
    },
  ]
})

export default router
