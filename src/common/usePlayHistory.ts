import storage from '@/common/storage'
import { LocalStorageKeys, playHistoryLimit } from '@/common/config'
import { reactive, watch } from 'vue'

interface PlayHistoryItem {
  timestamp: number
  articleId: number
  resourceId: number
  resourceName: string
  resourceType: number
}

export function getPlayHistory (): PlayHistoryItem[] {
  return storage.getItem(LocalStorageKeys.playHistory) || []
}

export function getCurrentHistory (articleId: number) {
  const history = getPlayHistory()
  return history.find(v => v.articleId === articleId) || null
}

export function setCurrentHistory (item: PlayHistoryItem) {
  const history = getPlayHistory()
  const currentHistoryIndex = history.findIndex(v => v.articleId === item.articleId)
  let currentHistory
  if (currentHistoryIndex == -1) {
    currentHistory = {
      timestamp: Date.now(),
      articleId: item.articleId,
      resourceId: item.resourceId,
      resourceName: item.resourceName,
      resourceType: item.resourceType,
    }
  } else {
    history[currentHistoryIndex].timestamp = Date.now()
    history[currentHistoryIndex].resourceId = item.resourceId
    history[currentHistoryIndex].resourceName = item.resourceName
    history[currentHistoryIndex].resourceType = item.resourceType
    currentHistory = history.splice(currentHistoryIndex, 1)[0]
  }
  history.unshift(currentHistory)
  if (history.length > playHistoryLimit) {
    history.pop()
  }
  storage.setItem(LocalStorageKeys.playHistory, history)
  return currentHistory
}

export function removeCurrentHistory (articleId: number) {
  const history = getPlayHistory()
  const index = history.findIndex(v => v.articleId === articleId)
  if (index !== -1) {
    history.splice(index, 1)
    storage.setItem(LocalStorageKeys.playHistory, history)
  }
  return history[index] || null
}

export default function useCurrentPlayHistory (articleId: number, resourceType: number) {
  const currentHistory = getCurrentHistory(articleId)
  let currentPlayHistory: PlayHistoryItem
  if (currentHistory) {
    currentPlayHistory = reactive(currentHistory)
  } else {
    currentPlayHistory = reactive(setCurrentHistory({
      timestamp: Date.now(),
      articleId,
      resourceId: -1,
      resourceName: '',
      resourceType,
    }))
  }
  watch(currentPlayHistory, (v) => {
    setCurrentHistory({
      timestamp: Date.now(),
      articleId,
      resourceId: v.resourceId,
      resourceName: v.resourceName,
      resourceType,
    })
  }, { immediate: true })
  return currentPlayHistory
}