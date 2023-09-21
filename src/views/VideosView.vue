<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import bridge from '@/common/bridge'
  import { showToast } from '@/common/globalToast'
  import { ErrorMsg } from '@/common/config'
  import { useAppData } from '@/stores/appData'
  import OperationBar from '@/components/OperationBar.vue'
  import ShareBar from '@/components/ShareBar.vue'
  import MediaTextBar from '@/components/MediaTextBar.vue'
  import EpisodeListCard from '@/components/EpisodeListCard.vue'
  import VideoControlMask from '@/components/VideoControlMask.vue'
  import { useVideoStore } from '@/stores/video'
  import subscribeEvent from '@/common/subscribeEvent'
  import { articleOperate, getArticleDetail } from '@/services/articleService'

  const currentItemIndex = ref(0)

  const { isInApp, isLogin } = useAppData()
  const route = useRoute()
  const { data, loading, error } = getArticleDetail(Number(route.params.id))
  const video = computed(() => data.value?.tarticleDetails.filter(v => v.resourceType === 1)[currentItemIndex.value])
  const videoRef = ref<HTMLVideoElement>()

  watch(() => route.params.id, () => {
    location.reload()
  })

  watch(video, (v) => {
    if (v) {
      if (isInApp) {
        bridge.changeVideoEpisode(currentItemIndex.value, v.id)
      }
      videoStore.init({ target: videoRef.value } as any) // fix wechat
    }
  })
  
  const handleOperate = async (opType: number, opValue: number) => {
    // const operateData = await articleOperate({
    //   articleId: Number(route.params.id),
    //   operateType: opType,
    //   value: opValue,
    // })
    // if (!data.value || operateData === null) {
    //   return
    // }
    // if (opType === 3) {
    //   data.value.isSubscribed = !!operateData
    // }
    if (!isLogin) {
      return bridge.goLogin()
    }
    if (opType === 3) {
      bridge.changeSubscribedStatus(opValue as (0 | 1))
    }
  }

  const videoStore = useVideoStore()
  const maskShow = ref(true)

  const i = ref<number>()
  function handleTogglePlay () {
    if (!videoStore.ready) return
    if (videoStore.error) {
      showToast(ErrorMsg.resourceLoadError)
      return
    }
    videoStore.togglePlay()
  }

  function showMask () {
    clearTimeout(i.value)
    maskShow.value = true
    if (!videoStore.paused) {
      i.value = setTimeout(() => {
        maskShow.value = false
      }, 5000)
    }
  }

  function handleNext () {
    if (
      data.value?.tarticleDetails
      && currentItemIndex.value < data.value.tarticleDetails.length - 1
    ) {
      currentItemIndex.value += 1
    }
  }

  subscribeEvent(data, {})
</script>

<template>
  <div class="videoDetailWrapper">
    <section class="videoElmContainer">
      <video
        ref="videoRef"
        autoplay
        playsinline
        preload="metadata"
        :src="video?.resourceUrl"
        :poster="data?.coverResourceUrl"
        @loadstart="videoStore.reset"
        @loadedmetadata="videoStore.init"
        @play="(e: Event) => { videoStore.init(e); showMask() }"
        @pause="(e: Event) => { videoStore.init(e); showMask() }"
        @timeupdate="videoStore.throttleUpdateTime"
        @durationchange="videoStore.changeVideo"
        @ended="!videoStore.loop && handleNext()"
        @error="videoStore.handleError"
        @click="showMask"
      ></video>
      <VideoControlMask
        v-if="videoRef"
        :maskShow="maskShow"
        :isInApp="isInApp"
        :title="data?.title"
        :currentTime="videoStore.currentTime"
        :duration="videoStore.duration"
        :paused="videoStore.paused"
        :ended="videoStore.ended"
        :loop="videoStore.loop"
        :playbackRate="videoStore.playbackRate"
        :togglePlay="handleTogglePlay"
        :toggleLoop="videoStore.toggleLoop"
        :handlePlaybackRate="videoStore.handlePlaybackRate"
        :handleCurrentTimeChange="videoStore.changeCurrentTime"
        :handleFullscreen="videoStore.requestFullscreen"
        :showMask="showMask"
      />
    </section>
    <section class="videoDetail" v-if="!loading && !error">
      <MediaTextBar
        class="mediaText"
        :title="video?.title"
        :time="video?.inviteTime?.substring(0, 10)"
        :place="video?.area"
        :total="data?.tarticleDetails.length"
        :subscribe="data?.isSubscribed"
        :onOperate="handleOperate"
      />
      <OperationBar
        class="operation"
        :seeCount="data?.subscribeNum || 0"
        :upCount="data?.admireNum || 0"
      />
    </section>
    <EpisodeListCard
      class="videoList"
      :currentItemIndex="currentItemIndex"
      :groupSize="50"
      :episodeList="data?.tarticleDetails || []"
      :handleSelect="(index: number) => currentItemIndex = index"
    />
    <!-- <ShareBar /> -->
  </div>
</template>

<style scoped lang="less">
.videoDetailWrapper {
  height: var(--100vh, 100vh);
  overflow: hidden;
  background-color: #F1EAE6;
  display: flex;
  flex-direction: column;
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
    &:-webkit-full-screen {
      width: 100%;
      height: 100%;
    }
  }
}
.videoDetail {
  padding: 0 20px;
}
.mediaText {
  margin-top: 10px;
}
.operation {
  margin-top: 30px;
}
.videoList {
  margin-top: 25px;
  flex: 1;
  overflow: hidden;
}
</style>