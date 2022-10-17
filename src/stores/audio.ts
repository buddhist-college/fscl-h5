import { ref } from 'vue'
import { defineStore } from 'pinia'
import throttle from 'lodash/throttle'

export const useAudioStore = defineStore('audio', () => {
  const audioRef = ref<HTMLAudioElement>()
  const currentTime = ref(NaN)
  const duration = ref(NaN)
  const paused = ref(true)
  const ended = ref(false)
  const loop = ref(false)

  function init (e: Event) {
    const el = e.target as HTMLAudioElement
    audioRef.value = el
    duration.value = el.duration
    paused.value = el.paused
    ended.value = el.ended
    loop.value = el.loop
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

  return {
    audioRef,
    currentTime,
    duration,
    paused,
    ended,
    loop,
    init,
    updateTime,
    throttleUpdateTime,
    changeAudio,
    togglePlay,
    toggleLoop,
    changeCurrentTime,
  }
})
