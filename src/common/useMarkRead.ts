import { useAppData } from '@/stores/appData'
import { articleOperate } from '@/services/articleService'

export function useMarkRead(articleId: number) {
  const { isLogin } = useAppData()
  if (isLogin) {
    return articleOperate({
      articleId,
      operateType: 1,
      value: 1,
    })
  }
}