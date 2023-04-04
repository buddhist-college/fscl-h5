import eventEmitter from '@/common/eventEmitter'
import type { getArticleDetail } from '@/services/articleService'
import type { TimingSettingOptions } from '@/common/config'

interface Handlers {
  handleTimingSettingChange?: (value: typeof TimingSettingOptions[number]) => void
}

export default (data: ReturnType<typeof getArticleDetail>['data'], { handleTimingSettingChange }: Handlers) => {
  eventEmitter.on('updateSubscribedStatus', (value: 1 | 0) => {
    if (data.value) {
      data.value.isSubscribed = !!value
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
  eventEmitter.on('updateTimingSetting', (value: typeof TimingSettingOptions[number]) => {
    if (handleTimingSettingChange) {
      handleTimingSettingChange(value)
    }
  })
}