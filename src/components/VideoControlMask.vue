<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import dayjs from 'dayjs'
  import duration from 'dayjs/plugin/duration'
  import HeaderBar from '@/components/HeaderBar.vue'

  dayjs.extend(duration)

  const props = defineProps<{
    title?: string
    currentTime: number
    duration: number
    paused: boolean
    ended: boolean
    loop: boolean
    toggleLoop: () => void
    togglePlay: () => void
    handleCurrentTimeChange: (currentTime: number) => void
    handleFullscreen: () => void
    showMask: () => void
  }>()

  const currentTimeStr = computed(() => props.currentTime
    ? dayjs.duration(props.currentTime, 's').format(props.currentTime >= 3600 ? 'HH:mm:ss' : 'mm:ss')
    : '00:00')
  const durationStr = computed(() => props.duration
    ? dayjs.duration(props.duration, 's').format(props.duration >= 3600 ? 'HH:mm:ss' : 'mm:ss')
    : '00:00')
  const progressPercent = computed(() => Math.floor(props.currentTime / props.duration * 1000) / 10)

  const touchPosX = ref(0)
  const progressWidth  = ref(0)
  const dragProgressPercent = ref(0)
  const loadProgressPercent = ref(0)
  function handleTouchStart (e: TouchEvent) {
    touchPosX.value = e.touches[0].clientX
    progressWidth.value = (e.currentTarget as any).parentNode.clientWidth
    props.showMask()
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
    props.showMask()
  }
  function handleTouchEnd () {
    if (dragProgressPercent.value) {
      loadProgressPercent.value = dragProgressPercent.value
      props.handleCurrentTimeChange(dragProgressPercent.value / 100 * props.duration)
      touchPosX.value = 0
      progressWidth.value = 0
      dragProgressPercent.value = 0
    }
    props.showMask()
  }

  watch(() => props.currentTime, () => {
    loadProgressPercent.value = 0
  })

  const progressPercentStr = computed(() => (dragProgressPercent.value || loadProgressPercent.value || progressPercent.value) + '%')
</script>

<template>
  <div class="videoControlMask">
    <HeaderBar 
      :title="title"
      videoMask
    />
    <div class="playArea" @click="() => { togglePlay(); showMask() }">
      <a :class="['play', { paused }]"></a>
    </div>
    <div class="controlBar">
      <a :class="loop ? 'loop' : 'unLoop'" @click="() => { toggleLoop(); showMask() }"></a>
      <span class="time">{{ currentTimeStr }}</span>
      <div class="progressBar">
        <div class="bg"></div>
        <div class="inner" :style="{ width: progressPercentStr }"></div>
        <a
          class="handleBtn"
          :style="{ left: progressPercentStr }"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <span></span>
        </a>
      </div>
      <span class="time" style="text-align: right">{{ durationStr }}</span>
      <a class="fullscreen" @click="handleFullscreen"></a>
    </div>
  </div>
</template>

<style scoped lang="less">
.videoControlMask {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(180deg, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.00) 77%, rgba(0,0,0,0.80) 100%);
}
.playArea {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  .play {
    display: block;
    width: 44px;
    height: 44px;
    background-image: url(@/assets/images/video_play_btn.png);
    background-size: cover;

    &.paused {
      background-image: url(@/assets/images/video_stop_btn.png);
    }
  }
}
.controlBar {
  height: 39px;
  padding: 0 16px 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  > a {
    display: block;
    width: 24px;
    height: 24px;
    background-size: cover;
  }
  .loop {
    background-image: url(@/assets/images/video_play_only.png);
  }
  .unLoop {
    background-image: url(@/assets/images/video_play_cir.png);
  }
  .fullscreen {
    background-image: url(@/assets/images/play_fullsc.png);
  }
  .time {
    width: 50px;
    color: #fff;
  }
  .progressBar {
    flex: 1;
    height: 22px;
    padding: 10px 0;
    position: relative;
    .bg {
      width: 100%;
      height: 2px;
      opacity: 0.1;
      background: #EDBF90;
      border-radius: 1px;
      position: absolute;
      left: 0;
    }
    .inner {
      height: 2px;
      background: #EDBF90;
      border-radius: 1px;
      position: absolute;
      left: 0;
    }
    .handleBtn {
      display: block;
      width: 14px;
      height: 14px;
      background: rgba(237,191,144,0.3);
      border-radius: 7px;
      position: absolute;
      transform: translate(-6px, -6px);
      span {
        display: block;
        width: 8px;
        height: 8px;
        background: #EDBF90;
        border-radius: 4px;
        position: absolute;
        top: 3px;
        left: 3px;
      }
    }
  }
}
</style>