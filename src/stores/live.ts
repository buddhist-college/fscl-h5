import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLiveStore = defineStore('video', () => {
  const videoRef = ref<HTMLVideoElement>()
  const ready = ref(false)
  const paused = ref(true)
  const fullscreen = ref(false)
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

  async function requestFullscreen (elm?: HTMLElement) {
    if (videoRef.value) {
      const fullscreenMethods = [
        'requestFullscreen',
        'mozRequestFullScreen',
        'msRequestFullscreen',
        'webkitRequestFullscreen',
        'webkitEnterFullScreen'
      ] as const
      let fullscreenEl: any
      let method: typeof fullscreenMethods[number] | undefined
      if (elm) {
        fullscreenEl = elm
        method = fullscreenMethods.find(i => i in fullscreenEl)
      }
      if (!method) {
        fullscreenEl = videoRef.value
        method = fullscreenMethods.find(i => i in fullscreenEl)
      }
      if (method) {
        try {
          await fullscreenEl[method]()
          if (fullscreenEl !== videoRef.value) {
            fullscreen.value = true
          }
          return
        } catch(err) {
          console.log(err)
        }
      }
    }
  }

  async function exitFullscreen () {
    const doc = window.document as any
    const fullscreenMethods = [
      'exitFullscreen',
      'mozCancelFullScreen',
      'msExitFullscreen',
      'webkitExitFullscreen',
    ] as const
    for (const i of fullscreenMethods) {
      if (doc[i]) {
        try {
          await doc[i]()
          fullscreen.value = false
          return
        } catch(err) {
          console.log(err)
        } 
      }
    }
  }

  async function toggleFullscreen (elm?: HTMLElement) {
    if (fullscreen.value) {
      await exitFullscreen()
    } else {
      await requestFullscreen(elm)
    }
  }

  function handleError() {
    error.value = true
  }

  return {
    videoRef,
    ready,
    paused,
    fullscreen,
    error,
    reset,
    init,
    changeVideo,
    continuePlay,
    pausePlay,
    togglePlay,
    toggleFullscreen,
    handleError,
  }
})
