<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { showToast } from '@/common/globalToast'
  import { ErrorMsg } from '@/common/config'
  import { useMarkRead } from '@/common/useMarkRead'
  import { useAppData } from '@/stores/appData'
  import OperationBar from '@/components/OperationBar.vue'
  import ShareBar from '@/components/ShareBar.vue'
  import MediaTextBar from '@/components/MediaTextBar.vue'
  import EpisodeListCard from '@/components/EpisodeListCard.vue'
  import VideoControlMask from '@/components/VideoControlMask.vue'
  import { useVideoStore } from '@/stores/video'
  import { articleOperate, getArticleDetail } from '@/services/articleService'

  const currentItemIndex = ref(0)

  const { isInApp } = useAppData()
  const route = useRoute()
  const { data, loading, error } = getArticleDetail(Number(route.params.id))
  const video = computed(() => data.value?.tarticleDetails.filter(v => v.resourceType === 1)[currentItemIndex.value])

  watch(() => route.params.id, () => {
    location.reload()
  })

  const handleOperate = async (opType: number, opValue: number) => {
    const operateData = await articleOperate({
      articleId: Number(route.params.id),
      operateType: opType,
      value: opValue,
    })
    if (!data.value || operateData === null) {
      return
    }
    if (opType === 3) {
      data.value.isSubscribed = !!operateData
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
    maskShow.value = true;
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
      && !videoStore.loop
    ) {
      currentItemIndex.value += 1
    }
  }

  useMarkRead(Number(route.params.id))
</script>

<template>
  <div class="videoDetailWrapper">
    <section className="videoElmContainer" v-if="!loading && !error">
      <video
        autoplay
        playsinline
        preload="metadata"
        :src="video?.resourceUrl"
        @loadstart="videoStore.reset"
        @loadedmetadata="videoStore.init"
        @play="(e) => { videoStore.init(e); showMask() }"
        @pause="(e) => { videoStore.init(e); showMask() }"
        @timeupdate="videoStore.throttleUpdateTime"
        @durationchange="videoStore.changeVideo"
        @ended="handleNext"
        @error="videoStore.handleError"
        @click="showMask"
      ></video>
      <Transition name="fade">
        <VideoControlMask
          :isInApp="isInApp"
          :title="video?.title"
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
        class="mediaText"
        :title="video?.name"
        :time="video?.inviteTime"
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
  // min-height: calc(100vh - 68px);
  min-height: 100vh;
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
  }
  .header {
    position: absolute;
    top: 0;
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
}
</style>