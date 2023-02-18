export interface ArticleDetail {
  title: string
  area: string
  content: string
  name: string
  inviteTime: string
  resourceType: 0 | 1 | 2 | 3  // 0:音频 1:视频 2:文字 3:图片
  resourceUrl: string
  resourceUrlType: number
}

export interface ArticleDetailRes {
  templteType: 1 | 2 | 3 | 4 | 5 | 6 | 7  // 模版類型 1:諮詢類圖文 2:視頻集 3:音頻集 4:主題組合 5:視頻資訊 6:音頻資訊 7:簡介開示圖文
  title: string
  admireNum: number
  catalogueId: number
  subscribeNum: number
  coverResourceUrl: string
  coverResourceUrlType: number
  publishTime: string
  tarticleDetails: ArticleDetail[]
}

export interface ArticleOperateReq {
  articleId: number
  operateType: number // 0:點贊,1:觀自在,2:收藏,3:订阅,4:分享	
  value: number // 1:增加,0:取消
}

export interface RecommendReq {
  catalogueId: number,
}

export interface RecommendItem {
  articleType: number
  catalogueId: number
  content: string
  coverResourceId: number
  coverResourceUrl: string
  createTime: string
  fileType: number
  id: number
  publishTime: string
  sort: number
  subscribeNum: number
  title: string
}

export type RecommendRes = RecommendItem[]