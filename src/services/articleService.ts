import { usePost } from '@/common/useFetch.js'
import fetch from '@/common/fetch'
import type { ArticleDetailRes, ArticleOperateReq, RecommendReq, RecommendRes, SpeechContextRes } from '@/services/article'

export const getArticleDetail = (articleId: number) => usePost<ArticleDetailRes>('/app/article/detail', {
  articleId,
})

// export const articleOperate = ({ articleId, operateType, value }: ArticleOperateReq) => usePost<number>('/app/article/operate', {
//   articleId,
//   operateType,
//   value,
// })

export const getRecommend = ({ catalogueId }: RecommendReq) => usePost<RecommendRes>('/app/article/recommend', {
  catalogueId,
})

export const articleOperate = async ({ articleId, operateType, value }: ArticleOperateReq) => {
  try {
    return await fetch<number>('/app/article/operate', {
      method: 'POST',
      body: JSON.stringify({
        articleId,
        operateType,
        value,
      }),
    })
  } catch(err) {
    return null
  }
}

export const getSpeechContext = async (itemId: string) => {
  return await fetch<SpeechContextRes>(`/app/speech/content/${itemId}`, {
    method: 'POST'
  })
}