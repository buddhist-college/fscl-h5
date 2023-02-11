import { usePost } from '@/common/useFetch.js'
import type { ArticleDetailRes, ArticleOperateReq, RecommendReq, RecommendRes } from '@/services/article'

export const getArticleDetail = (articleId: number) => usePost<ArticleDetailRes>('/app/article/detail', {
  articleId,
})

export const articleOperate = ({ articleId, operateType, value }: ArticleOperateReq) => usePost<number>('/app/article/operate', {
  articleId,
  operateType,
  value,
})

export const getRecommend = ({ catalogueId, userId }: RecommendReq) => usePost<RecommendRes>('/app/article/recommend', {
  catalogueId,
  userId,
})