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
  const error = ref(false)

  function reset () {
    ready.value = false
    currentTime.value = NaN
    duration.value = NaN
    paused.value = true
    ended.value = false
    loop.value = false
    error.value = false
  }

  function init (e: Event) {
    const el = e.target as HTMLVideoElement
    videoRef.value = el
    ready.value = true
    duration.value = el.duration
    paused.value = el.paused
    ended.value = el.ended
    loop.value = el.loop
    error.value = false
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

  function continuePlay () {
    if (videoRef.value) {
      videoRef.value.play()
    }
  }

  function pausePlay () {
    if (videoRef.value) {
      videoRef.value.pause()
    }
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
      const videoEl = videoRef.value as any
      if (videoEl.requestFullscreen) {
        videoEl.requestFullscreen()
      } else if (videoEl.mozRequestFullScreen) {
        videoEl.mozRequestFullScreen()
      } else if (videoEl.msRequestFullscreen) {
        videoEl.msRequestFullscreen()
      } else if (videoEl.webkitRequestFullscreen) {
        videoEl.webkitRequestFullScreen()
      } else if (videoEl.webkitEnterFullScreen) {
        videoEl.webkitEnterFullScreen()
      }
    }
  }

  function handleError() {
    error.value = true
  }

  return {
    videoRef,
    ready,
    currentTime,
    duration,
    paused,
    ended,
    loop,
    error,
    reset,
    init,
    updateTime,
    throttleUpdateTime,
    changeVideo,
    continuePlay,
    pausePlay,
    togglePlay,
    toggleLoop,
    changeCurrentTime,
    requestFullscreen,
    handleError,
  }
})
