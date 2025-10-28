<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { mediaTimeFormat } from '@/common/utils'
  import { PlaybackRateOptions } from '@/common/config'
  import HeaderBar from '@/components/HeaderBar.vue'
  import DrawerModal from '@/common/drawerModal/DrawerModal.vue'

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
    fullscreen: boolean
    toggleLoop: () => void
    togglePlay: () => void
    handlePlaybackRate: (rate: number) => void
    handleCurrentTimeChange: (currentTime: number) => void
    handleFullscreen: () => void
    showMask: () => void
  }>()

  const { t } = useI18n()
  const playbackRateModalOpen = ref(false)
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
    if (touchPosX.value) {
      props.handleCurrentTimeChange(dragProgressPercent.value! / 100 * props.duration)
      touchPosX.value = 0
      progressWidth.value = 0
    }
    props.showMask()
  }

  watch(() => props.currentTime, () => {
    if (!touchPosX.value) {
      dragProgressPercent.value = undefined
    }
  })

  const progressPercentStr = computed(() => (dragProgressPercent.value ?? progressPercent.value) + '%')
</script>

<template>
  <Transition name="fade">
    <div class="videoControlMask" v-show="maskShow">
      <HeaderBar
        v-if="!isInApp && !fullscreen"
        :title="title"
        videoMask
      />
      <div :class="['playArea', { inApp: isInApp || fullscreen }]" @click="() => { togglePlay(); showMask() }">
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
        <span class="rate" @click="playbackRateModalOpen = true">{{ playbackRate === 1 ? t('rate') : `${playbackRate}x` }}</span>
        <a class="fullscreen" @click="() => { handleFullscreen(); showMask() }"></a>
      </div>
    </div>
  </Transition>
  <DrawerModal
    :open="playbackRateModalOpen"
    :title="t('playbackRate')"
    :selectMenuList="PlaybackRateOptions.map(rate => ({ label: `${rate}${t('rateUnit')}`, value: rate }))"
    :selectMenu="playbackRate"
    showCancelBtn
    :handleMenuSelect="rate => { handlePlaybackRate(rate); playbackRateModalOpen = false }"
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
      width: 30px;
      height: 30px;
      padding: 6px;
      position: absolute;
      transform: translate(-14px, -14px);
      div {
        width: 18px;
        height: 18px;
        background: rgba(237,191,144,0.3);
        border-radius: 50%;
        position: absolute;
        padding: 4px;
        &::after {
          content: '';
          width: 10px;
          height: 10px;
          background: #EDBF90;
          border-radius: 50%;
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