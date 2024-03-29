import { ref } from 'vue'
import { defineStore } from 'pinia'
import throttle from 'lodash/throttle'

export const useAudioStore = defineStore('audio', () => {
  const audioRef = ref<HTMLAudioElement>()
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
    const el = e.target as HTMLAudioElement
    audioRef.value = el
    ready.value = true
    duration.value = el.duration
    paused.value = el.paused
    ended.value = el.ended
    loop.value = el.loop
    error.value = false
  }

  function updateTime (e: Event) {
    const el = e.target as HTMLAudioElement
    currentTime.value = el.currentTime
  }

  const throttleUpdateTime = throttle(updateTime, 1000, {
    leading: true,
    trailing: false,
  })

  function changeAudio (e: Event) {
    init(e)
    updateTime(e)
  }

  function continuePlay () {
    if (audioRef.value) {
      audioRef.value.play()
    }
  }

  function pausePlay () {
    if (audioRef.value) {
      audioRef.value.pause()
    }
  }

  function togglePlay () {
    if (audioRef.value) {
      if (audioRef.value.paused) {
        audioRef.value.play()
        paused.value = false
      } else {
        audioRef.value.pause()
        paused.value = true
      } 
    }
  }

  function toggleLoop () {
    if (audioRef.value) {
      audioRef.value.loop = !loop.value
      loop.value = !loop.value
    }
  }

  function changeCurrentTime (currentTime: number) {
    if (audioRef.value) {
      audioRef.value.currentTime = currentTime
    }
  }

  function handleError () {
    error.value = true
  }

  return {
    audioRef,
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
    changeAudio,
    continuePlay,
    pausePlay,
    togglePlay,
    toggleLoop,
    changeCurrentTime,
    handleError,
  }
})
