import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLiveStore = defineStore('video', () => {
  const videoRef = ref<HTMLVideoElement>()
  const ready = ref(false)
  const paused = ref(true)
  const error = ref(false)

  function reset () {
    ready.value = false
    paused.value = true
    error.value = false
  }

  function init (e: Event) {
    const el = e.target as HTMLVideoElement
    videoRef.value = el
    ready.value = true
    paused.value = el.paused
    error.value = false
  }

  function changeVideo (e: Event) {
    init(e)
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

  async function requestFullscreen () {
    if (videoRef.value) {
      try {
        (videoRef.value as any).webkitEnterFullScreen()
        await videoRef.value.requestFullscreen()
      } catch (err) {
        console.log(err)
      }
    }
  }

  function handleError() {
    error.value = true
  }

  return {
    videoRef,
    ready,
    paused,
    error,
    reset,
    init,
    changeVideo,
    continuePlay,
    pausePlay,
    togglePlay,
    requestFullscreen,
    handleError,
  }
})
