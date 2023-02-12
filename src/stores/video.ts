import { ref } from 'vue'
import { defineStore } from 'pinia'
import throttle from 'lodash/throttle'

export const useVideoStore = defineStore('video', () => {
  const videoRef = ref<HTMLVideoElement>()
  const ready = ref(false)
  const currentTime = ref(NaN)
  const duration = ref(NaN)
  const paused = ref(true)
  const ended = ref(false)
  const loop = ref(false)

  function reset () {
    ready.value = false
    currentTime.value = NaN
    duration.value = NaN
    paused.value = true
    ended.value = false
    loop.value = false
  }

  function init (e: Event) {
    const el = e.target as HTMLVideoElement
    videoRef.value = el
    ready.value = true
    duration.value = el.duration
    paused.value = el.paused
    ended.value = el.ended
    loop.value = el.loop
  }

  function updateTime (e: Event) {
    const el = e.target as HTMLVideoElement
    currentTime.value = el.currentTime
  }

  const throttleUpdateTime = throttle(updateTime, 1000, {
    leading: true,
    trailing: false,
  })

  function changeVideo (e: Event) {
    init(e)
    updateTime(e)
  }

  function togglePlay () {
    if (videoRef.value) {
      if (videoRef.value.paused) {
        videoRef.value.play()
        paused.value = false
      } else {
        videoRef.value.pause()
        paused.value = true
      } 
    }
  }

  function toggleLoop () {
    if (videoRef.value) {
      videoRef.value.loop = !loop.value
      loop.value = !loop.value
    }
  }

  function changeCurrentTime (currentTime: number) {
    if (videoRef.value) {
      videoRef.value.currentTime = currentTime
    }
  }

  function requestFullscreen () {
    if (videoRef.value) {
      try {
        (videoRef.value as any).webkitEnterFullScreen()
        videoRef.value.requestFullscreen()
      } catch (err) {
        console.error(err)
      }
    }
  }

  return {
    videoRef,
    ready,
    currentTime,
    duration,
    paused,
    ended,
    loop,
    reset,
    init,
    updateTime,
    throttleUpdateTime,
    changeVideo,
    togglePlay,
    toggleLoop,
    changeCurrentTime,
    requestFullscreen,
  }
})
