import eventEmitter from '@/common/eventEmitter'
import type { getArticleDetail } from '@/services/articleService'

export default (data: ReturnType<typeof getArticleDetail>['data']) => {
  eventEmitter.on('updateSubscribedStatus', (status: 1 | 0) => {
    if (data.value) {
      data.value.isSubscribed = !!status
    }
  })
  eventEmitter.on('increaseAdmireNum', () => {
    if (data.value) {
      data.value.admireNum += 1
    }
  })
  eventEmitter.on('decreaseAdmireNum', () => {
    if (data.value) {
      data.value.admireNum -= 1
    }
  })
}