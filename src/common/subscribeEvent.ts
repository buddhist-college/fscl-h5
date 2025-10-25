import eventEmitter from '@/common/eventEmitter'
import type { getArticleDetail } from '@/services/articleService'
import type { TimingSettingOptions } from '@/common/config'

interface Handlers {
  handleTimingSettingChange?: (value: typeof TimingSettingOptions[number]) => void
  handleGetMediaCurrentTime?: () => number
}

type EventHandlers = Record<string, (...args: any[]) => void>

/**
 * 批量订阅事件
 * @param data - 文章数据
 * @param handlers - 事件处理器
 * @returns 返回取消订阅函数
 */
export const subscribeEvents = (
  data: ReturnType<typeof getArticleDetail>['data'],
  { handleTimingSettingChange, handleGetMediaCurrentTime }: Handlers
) => {
  const updateSubscribedStatusHandler = (value: 1 | 0) => {
    if (data.value) {
      data.value.isSubscribed = !!value
    }
  }

  const increaseAdmireNumHandler = () => {
    if (data.value) {
      data.value.admireNum += 1
    }
  }

  const decreaseAdmireNumHandler = () => {
    if (data.value) {
      data.value.admireNum -= 1
    }
  }

  const updateTimingSettingHandler = (value: typeof TimingSettingOptions[number]) => {
    if (handleTimingSettingChange) {
      handleTimingSettingChange(value)
    }
  }

  const getMediaCurrentTimeHandler = (callback: (currentTime: number) => void) => {
    if (handleGetMediaCurrentTime) {
      callback(handleGetMediaCurrentTime())
    } else {
      callback(-1)
    }
  }

  // 批量订阅所有事件
  eventEmitter.on('updateSubscribedStatus', updateSubscribedStatusHandler)
  eventEmitter.on('increaseAdmireNum', increaseAdmireNumHandler)
  eventEmitter.on('decreaseAdmireNum', decreaseAdmireNumHandler)
  eventEmitter.on('updateTimingSetting', updateTimingSettingHandler)
  eventEmitter.on('getMediaCurrentTime', getMediaCurrentTimeHandler)

  // 返回取消订阅函数
  return () => {
    unsubscribeEvents({
      updateSubscribedStatus: updateSubscribedStatusHandler,
      increaseAdmireNum: increaseAdmireNumHandler,
      decreaseAdmireNum: decreaseAdmireNumHandler,
      updateTimingSetting: updateTimingSettingHandler,
      getMediaCurrentTime: getMediaCurrentTimeHandler
    })
  }
}

/**
 * 批量取消订阅事件
 * @param eventHandlers - 事件处理器映射
 */
export const unsubscribeEvents = (eventHandlers: EventHandlers) => {
  Object.keys(eventHandlers).forEach(eventName => eventEmitter.off(eventName, eventHandlers[eventName]))
}

// 保持向后兼容，导出默认函数
export default subscribeEvents