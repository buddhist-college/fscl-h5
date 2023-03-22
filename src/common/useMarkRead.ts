import { inject } from 'vue'
import { GlobalProvideKey, defaultAppData } from '@/common/config'
import { articleOperate } from '@/services/articleService'

export function useMarkRead(articleId: number) {
  const appData = inject(GlobalProvideKey.appData, defaultAppData)
  if (appData.isLogin) {
    return articleOperate({
      articleId,
      operateType: 1,
      value: 1,
    })
  }
}