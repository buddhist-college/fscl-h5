import { inject } from 'vue'
import { GlobalProvideKey, defaultBridge } from '@/common/config'
import { articleOperate } from '@/services/articleService'

export function useMarkRead(articleId: number) {
  const bridge = inject(GlobalProvideKey.bridge, defaultBridge)
  if (bridge.isLogin) {
    return articleOperate({
      articleId,
      operateType: 1,
      value: 1,
    })
  }
}