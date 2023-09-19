<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import dayjs from 'dayjs'
  import useJump from '@/common/useJump'
  import { showToast } from '@/common/globalToast'
  import { ErrorMsg } from '@/common/config'
  import { useAppData } from '@/stores/appData'
  import OperationBar from '@/components/OperationBar.vue'
  import ShareBar from '@/components/ShareBar.vue'
  import MediaTextBar from '@/components/MediaTextBar.vue'
  import RecommendCard from '@/components/RecommendCard.vue'
  import VideoControlMask from '@/components/VideoControlMask.vue'
  import { useVideoStore } from '@/stores/video'
  import subscribeEvent from '@/common/subscribeEvent'
  import { getArticleDetail } from '@/services/articleService'

  const { isInApp } = useAppData()
  const route = useRoute()
  const jump = useJump()
  const { data, loading, error } = getArticleDetail(Number(route.params.id))
  const video = computed(() => data.value?.tarticleDetails.find(v => v.resourceType === 1))
  const article = computed(() => data.value?.tarticleDetails.find(v => v.resourceType === 2))
  const videoRef = ref<HTMLVideoElement>()

  watch(() => route.params.id, () => {
    location.reload()
  })

  watch(video, (v) => {
    if (v) {
      videoStore.init({ target: videoRef.value } as any) // fix wechat
    }
  })

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
    maskShow.value = true;
    if (!videoStore.paused) {
      i.value = setTimeout(() => {
        maskShow.value = false
      }, 5000)
    }
  }

  subscribeEvent(data, {})
</script>

<template>
  <div class="videoDetailRecommendWrapper">
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
        @error="videoStore.handleError"
        @click="showMask"
      ></video>
      <Transition name="fade">
        <VideoControlMask
          v-if="videoRef"
          :isInApp="isInApp"
          :title="data?.title"
          :currentTime="videoStore.currentTime"
          :duration="videoStore.duration"
          :paused="videoStore.paused"
          :ended="videoStore.ended"
          :loop="videoStore.loop"
          :togglePlay="handleTogglePlay"
          :toggleLoop="videoStore.toggleLoop"
          :handleCurrentTimeChange="videoStore.changeCurrentTime"
          :handleFullscreen="videoStore.requestFullscreen"
          :showMask="showMask"
          v-show="maskShow"
        />
      </Transition>
    </section>
    <section class="videoDetail" v-if="!loading && !error">
      <MediaTextBar
        simple
        class="mediaText"
        :title="video?.title"
        :publishTime="dayjs(data?.publishTime).format('YYYY.MM.DD')"
      />
      <OperationBar
        class="operation"
        :seeCount="data?.subscribeNum || 0"
        :upCount="data?.admireNum || 0"
      />
      <div class="textDetail articleContainer" v-html="article?.content"></div>
    </section>
  </div>
  <RecommendCard
    v-if="!loading && !error"
    class="recommend"
    :catalogueId="data?.catalogueId"
    :handleClick="jump"
  />
  <!-- <ShareBar fixed /> -->
</template>

<style scoped lang="less">
.videoDetailRecommendWrapper {
  // min-height: calc(100vh - 68px);
  // min-height: 100vh;
  background-color: #F1EAE6;
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
  .textDetail {
    margin-top: 27px;
    padding-bottom: 25px;
    font-size: 18px;
    line-height: 28px;
  }
}
.mediaText {
  margin-top: 10px;
}
.operation {
  margin-top: 27px;
}
.recommend {
  margin-top: 5px;
}
</style>