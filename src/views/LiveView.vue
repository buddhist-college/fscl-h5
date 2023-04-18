<script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import LiveControlMask from '@/components/LiveControlMask.vue'
  import { useAppData } from '@/stores/appData'
  import { getLiveChannel, type ChannelData } from '@/services/liveService'
  import HlsPlayer from '@/common/HlsPlayer'
  import { useLiveStore } from '@/stores/live'
  import { showToast } from '@/common/globalToast'
  import { ErrorMsg } from '@/common/config'

  type ChannelName = '' | 'livetv' | 'amtb' | 'sanshi' | 'wdmaster' | 'education' | 'English'
  const channelDescMap = {
    livetv: '淨空\r\n老和尚',
    wdmaster: '悟道\r\n法師',
    education: '多元\r\n文化',
    sanshi: '三時\r\n繫念',
    amtb: '網路\r\n念佛',
  }

  const route = useRoute()
  const router = useRouter()
  const currentChannelName = ref<ChannelName>(route.params.channel as ChannelName || 'sanshi')
  const currentPlaylistItem = ref<ChannelData["playlist"][number]>()
  const videoRef = ref<HTMLVideoElement>()
  const liveChannel = ref<ChannelData[]>()
  const { isInApp } = useAppData()
  const live = computed(() => {
    if (liveChannel.value?.length) {
      return liveChannel.value.find(v => v.name === currentChannelName.value) || liveChannel.value[0]
    }
    return null
  })
  const hlsPlayer = new HlsPlayer({
    trackers: [
      'wss://tracker.hwadzan.info',
      'wss://tracker.hwadzan.tv',
    ]
  })

  const fetchData = async () => {
    const res = await getLiveChannel()
    liveChannel.value = res
  }

  onMounted(fetchData)

  watch(() => route.params.channel, () => {
    location.reload()
  })

  let i: number
  watch(live, v => {
    if (v) {
      if (HlsPlayer.hlsSupport) {
        hlsPlayer.init({
          videoSrc: v.videoHlsUrl,
          swarmId: v.swarmId,
          videoEl: videoRef.value!
        })
        liveStore.init({ target: videoRef.value } as any) // fix wechat
      } else {
        showToast(ErrorMsg.hlsNotSupported)
      }
      currentPlaylistItem.value = getCurrentPlaylistItem()
      clearTimeout(i)
      i = setTimeout(async () => {
        await fetchData()
        currentPlaylistItem.value = getCurrentPlaylistItem()
      }, v.currentPlaylist.flushtime)
    }
  })

  const liveStore = useLiveStore()

  function getCurrentPlaylistItem() {
    const nowDate = new Date(live.value!.currentPlaylist.now)
    return live.value!.playlist.find(v => {
      return nowDate >= new Date(v.startTime) && nowDate < new Date(v.endTime)
    })
  }
</script>

<template>
  <div class="liveWrapper">
    <section class="videoElmContainer">
      <video
        ref="videoRef"
        autoplay
        playsinline
        preload="metadata"
        @loadstart="liveStore.reset"
        @loadedmetadata="liveStore.init"
        @play="liveStore.init"
        @pause="liveStore.init"
        @error="liveStore.handleError"
      ></video>
      <LiveControlMask
        v-if="videoRef"
        :isInApp="isInApp"
        :paused="liveStore.paused"
        :togglePlay="liveStore.togglePlay"
        :handleFullscreen="liveStore.requestFullscreen"
      />
    </section>
    <section class="liveDetail">
      <h1>{{ live?.currentPlaylist.subject }}</h1>
    </section>
    <section class="programList">
      <div
        :class="['item', { current: v === currentPlaylistItem }]"
        v-for="(v, i) in live?.playlist" :key="i"
      >
        <span>{{ v.startTimeShort }}</span>
        <span class="subject">{{ v.subject }}</span>
      </div>
    </section>
  </div>
  <section class="navBar">
    <a
      :class="['item', { current: v === live?.name }]"
      v-for="(v, i) in Object.keys(channelDescMap)"
      :key="i"
      @click="router.replace(`/live/${v}`)"
    >
      {{ channelDescMap[v as keyof typeof channelDescMap] }}
    </a>
  </section>
</template>

<style scoped lang="less">
.liveWrapper {
  // min-height: calc(100vh - 68px);
  min-height: 100vh;
  background-color: #F1EAE6;
  display: flex;
  flex-direction: column;
  padding-bottom: 64px;
}
.videoElmContainer {
  width: 100vw;
  height: calc(0.5625*100vw);
  position: relative;
  video {
    width: 100%;
    height: 100%;
    // object-fit: fill;
    object-position: center center;
    background-color: #000;
  }
}
.liveDetail {
  padding: 15px 20px;
  h1 {
    margin: 0;
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;
  }
}
.programList {
  flex: 1;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.9);
  .item {
    font-size: 13px;
    line-height: 50px;
    display: flex;
    align-items: center;
    gap: 10px;
    &::before {
      content: '';
      display: block;
      width: 14px;
      height: 14px;
      background-image: url(@/assets/images/playlist_de.png);
      background-size: cover;
      flex: none;
    }
    &.current {
      color: #C50B0B;
      &::before {
        background-image: url(@/assets/images/playlist_red.png);
      }
    }
    .subject {
      line-height: 16px;
      align-self: flex-start;
      margin-top: 17px;
    }
  }
}
.navBar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px 15px;
  background: linear-gradient(180deg, rgba(255,255,255,0.9) 0%, #FFFFFF 100%);
  box-shadow: 0px -4px 10px 0px rgba(0,0,0,0.03);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-between;
  gap: 5px;

  .item {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 6px 0;
    font-size: 12px;
    font-weight: 600;
    color: #987B67;
    line-height: 15px;
    background: rgba(255,255,255,0.1);
    border-radius: 4px;
    border: 1px solid rgba(152,123,103,0.1);
    white-space: pre;
    &.current {
      background: #987B67;
      color: #fff;
    }
  } 
}
</style>