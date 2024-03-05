<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { mediaTimeFormat } from '@/common/utils'

  const props = defineProps<{
    currentTime: number
    duration: number
    paused: boolean
    ended: boolean
    loop: boolean
    showListControl: boolean
    toggleLoop: () => void
    togglePlay: () => void
    handleCurrentTimeChange: (currentTime: number) => void
    handlePrevClick?: () => void
    handleNextClick?: () => void
    handleListClick?: () => void
  }>()

  const touchPosX = ref(0)
  const progressWidth  = ref(0)
  const dragProgressPercent = ref<number | undefined>(undefined)

  const currentTimeStr = computed(() => mediaTimeFormat(
    dragProgressPercent.value === undefined ? props.currentTime : dragProgressPercent.value * props.duration / 100
  ))
  const durationStr = computed(() => mediaTimeFormat(props.duration))
  const progressPercent = computed(() => Math.floor(props.currentTime / props.duration * 1000) / 10)

  function handleTouchStart (e: TouchEvent) {
    touchPosX.value = e.touches[0].clientX
    progressWidth.value = (e.currentTarget as any).parentNode.clientWidth
  }
  function handleTouchMove (e: TouchEvent) {
    e.preventDefault()
    const offsetXPercent = (e.touches[0].clientX - touchPosX.value) / progressWidth.value
    dragProgressPercent.value = (progressPercent.value / 100 + offsetXPercent) * 100
    if (dragProgressPercent.value > 100) {
      dragProgressPercent.value = 100
    } else if (dragProgressPercent.value < 0) {
      dragProgressPercent.value = 0
    }
  }
  function handleTouchEnd () {
    if (touchPosX.value) {
      props.handleCurrentTimeChange(dragProgressPercent.value! / 100 * props.duration)
      touchPosX.value = 0
      progressWidth.value = 0
    }
  }

  watch(() => props.currentTime, () => {
    if (!touchPosX.value) {
      dragProgressPercent.value = undefined
    }
  })

  const progressPercentStr = computed(() => (dragProgressPercent.value ?? progressPercent.value) + '%')
</script>

<template>
  <div class="audioControlBar">
    <div class="progressBar">
      <div class="bg"></div>
      <div class="inner" :style="{ width: progressPercentStr }"></div>
      <div
        class="handleBtn"
        :style="{ left: progressPercentStr }"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      ></div>
    </div>
    <div class="time">
      <span>{{ currentTimeStr }}</span>
      <span>{{ durationStr }}</span>
    </div>
    <div class="buttons">
      <a :class="loop ? 'loop' : 'unLoop'" @click="toggleLoop"></a>
      <a class="prev" @click="handlePrevClick" v-if="showListControl"></a>
      <a :class="['play', { paused }]" @click="togglePlay"></a>
      <a class="next" @click="handleNextClick" v-if="showListControl"></a>
      <a class="list" @click="handleListClick" :style="{ visibility: showListControl ? 'visible' : 'hidden' }"></a>
    </div>
  </div>
</template>

<style scoped lang="less">
.progressBar {
  height: 14px;
  padding: 6px 0;
  position: relative;
  .bg {
    width: 100%;
    height: 2px;
    opacity: 0.1;
    background: #987B67;
    border-radius: 1px;
    position: absolute;
    left: 0;
  }
  .inner {
    height: 2px;
    background: #987B67;
    border-radius: 1px;
    position: absolute;
    left: 0;
  }
  .handleBtn {
    width: 24px;
    height: 24px;
    padding: 5px;
    position: absolute;
    transform: translate(-11px, -11px);
    &::after {
      content: '';
      position: absolute;
      width: 14px;
      height: 14px;
      background: #987B67;
      border-radius: 7px;
    }
  }
}
.time {
  margin-top: 4px;
  color: #987B67;
  line-height: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.buttons {
  margin-top: 28px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  a {
    display: block;
    width: 24px;
    height: 24px;
    background-size: cover;
  }
  .loop {
    background-image: url(@/assets/images/voice_play_sin.png);
  }
  .unLoop {
    background-image: url(@/assets/images/voice_play_cir.png);
  }
  .prev {
    background-image: url(@/assets/images/voice_prev.png);
  }
  .play {
    width: 64px;
    height: 64px;
    background-image: url(@/assets/images/voice_play_big.png);
  }
  .paused {
    background-image: url(@/assets/images/voice_stop_big.png);
  }
  .next {
    background-image: url(@/assets/images/voice_next.png);
  }
  .list {
    background-image: url(@/assets/images/voice_list.png);
  }
}
</style>