<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import dayjs from 'dayjs'
  import duration from 'dayjs/plugin/duration'
  import HeaderBar from '@/components/HeaderBar.vue'
  import DrawerModal from '@/common/drawerModal/DrawerModal.vue'

  dayjs.extend(duration)

  const props = defineProps<{
    maskShow: boolean
    isInApp?: boolean
    title?: string
    currentTime: number
    duration: number
    paused: boolean
    ended: boolean
    loop: boolean
    playbackRate: number
    toggleLoop: () => void
    togglePlay: () => void
    handlePlaybackRate: (rate: number) => void
    handleCurrentTimeChange: (currentTime: number) => void
    handleFullscreen: () => void
    showMask: () => void
  }>()

  const playbackRateModalOpen = ref(false)
  const playbackRateList = [
    { label: '2倍', value: 2 },
    { label: '1.5倍', value: 1.5 },
    { label: '1.25倍', value: 1.25 },
    { label: '1倍', value: 1 },
    { label: '0.75倍', value: 0.75 },
    { label: '0.5倍', value: 0.5 },
  ]

  function handlePlaybackRateSelect (rate: number) {
    props.handlePlaybackRate(rate)
    playbackRateModalOpen.value = false
  }
  
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
      dragProgressPercent.value = -1
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
  <Transition name="fade">
    <div class="videoControlMask" v-show="maskShow">
      <HeaderBar
        v-if="!isInApp"
        :title="title"
        videoMask
      />
      <div :class="['playArea', { inApp: isInApp }]" @click="() => { togglePlay(); showMask() }">
        <a :class="['play', { paused }]"></a>
      </div>
      <div class="controlBar">
        <a :class="loop ? 'loop' : 'unLoop'" @click="() => { toggleLoop(); showMask() }"></a>
        <span class="time">{{ currentTimeStr }}</span>
        <div class="progressBar">
          <div class="bg"></div>
          <div class="inner" :style="{ width: progressPercentStr }"></div>
          <div
            class="handleBtn"
            :style="{ left: progressPercentStr }"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
          >
            <div></div>
          </div>
        </div>
        <span class="time" style="text-align: right">{{ durationStr }}</span>
        <span class="rate" @click="playbackRateModalOpen = true">{{ playbackRate === 1 ? '倍速' : `${playbackRate}x` }}</span>
        <a class="fullscreen" @click="handleFullscreen"></a>
      </div>
    </div>
  </Transition>
  <DrawerModal
    :open="playbackRateModalOpen"
    title="播放倍速"
    :selectMenuList="playbackRateList"
    :selectMenu="playbackRate"
    showCancelBtn
    :handleMenuSelect="handlePlaybackRateSelect"
    :handleClose="() => playbackRateModalOpen = false"
  />
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
  &.inApp {
    padding-top: 39px;
  }
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
  gap: 8px;
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
    width: 42px;
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
      width: 24px;
      height: 24px;
      padding: 5px;
      position: absolute;
      transform: translate(-11px, -11px);
      div {
        width: 14px;
        height: 14px;
        background: rgba(237,191,144,0.3);
        border-radius: 7px;
        position: absolute;
        padding: 3px;
        &::after {
          content: '';
          width: 8px;
          height: 8px;
          background: #EDBF90;
          border-radius: 4px;
          position: absolute;
        }
      }
    }
  }
  .rate {
    width: 25px;
    color: #fff;
    text-align: center;
  }
}
</style>