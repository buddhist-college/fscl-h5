<script setup lang="ts">
  import HeaderBar from '@/components/HeaderBar.vue'

  defineProps<{
    isInApp?: boolean
    paused: boolean
    togglePlay: () => void
    handleFullscreen: () => void
  }>()
</script>

<template>
  <div :class="['liveControlMask', { paused }]">
    <HeaderBar
      v-if="!isInApp"
      videoMask
    />
    <div :class="['playArea', { inApp: isInApp }]" @click="togglePlay">
      <a :class="['play', { paused }]" v-visible="paused"></a>
    </div>
    <div class="controlBar" v-visible="!paused">
      <a class="badge" @click="togglePlay">直播中</a>
      <a class="fullscreen" @click="handleFullscreen"></a>
    </div>
  </div>
</template>

<style scoped lang="less">
.liveControlMask {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  &.paused {
    background: rgba(0,0,0,0.50);
  }
}
.playArea {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  &.inApp {
    padding-top: 40px;
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
  padding: 0 10px 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  .badge {
    padding: 5px;
    display: flex;
    align-items: center;
    gap: 5px;
    background-color: rgba(152, 123, 103, 0.5);
    border-radius: 3px;
    backdrop-filter: blur(5px);
    color: #fff;
    font-size: 12px;
    &:before {
      content: '';
      width: 10px;
      height: 10px;
      background-image: url(@/assets/images/live_play.png);
      background-size: cover;
    }
  }
  .fullscreen {
    width: 30px;
    height: 30px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    background-image: url(@/assets/images/play_fullsc.png);
    background-size: 26px 26px;
    background-position: center center;
  }
}
</style>