<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { showToast } from '@/common/globalToast'
  import OperationBar from '@/components/OperationBar.vue'
  import ShareBar from '@/components/ShareBar.vue'
  import MediaTextBar from '@/components/MediaTextBar.vue'
  import VideoListCard from '@/components/VideoListCard.vue'
  import VideoControlMask from '@/components/VideoControlMask.vue'
  import { useVideoStore } from '@/stores/video'
  import { articleOperate, getArticleDetail } from '@/services/articleService'

  const currentItemIndex = ref(0)

  const route = useRoute()
  const { data, loading, error } = getArticleDetail(Number(route.params.id))
  const video = computed(() => data.value?.tarticleDetails.filter(v => v.resourceType === 1)[currentItemIndex.value])

  const handleOperate = (opType: number, opValue: number) => articleOperate({
    articleId: Number(route.params.id),
    operateType: opType,
    value: opValue,
  })

  watch(() => route.params.id, () => {
    location.reload()
  })

  const videoStore = useVideoStore()
  const maskShow = ref(true)

  const i = ref<number>()
  function handleTogglePlay () {
    if (!videoStore.ready) {
      showToast('视频加载异常，请稍后重试')
      return
    }
    if (videoStore.paused) {
      i.value = setTimeout(() => {
        maskShow.value = false
      }, 3000)
    } else {
      clearTimeout(i.value)
    }
    videoStore.togglePlay()
  }

  function showMask () {
    clearTimeout(i.value)
    maskShow.value = true;
    if (!videoStore.paused) {
      i.value = setTimeout(() => {
        maskShow.value = false
      }, 3000)
    }
  }
</script>

<template>
  <div class="videoDetailWrapper">
    <section className="videoElmContainer" v-if="!loading && !error">
      <video
        playsinline
        preload="metadata"
        :src="video?.resourceUrl"
        @loadstart="videoStore.reset"
        @loadedmetadata="videoStore.init"
        @pause="(e) => { showMask(); videoStore.init(e) }"
        @timeupdate="videoStore.throttleUpdateTime"
        @durationchange="videoStore.changeVideo"
        @click="showMask"
      ></video>
      <Transition name="fade">
        <VideoControlMask
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
        :subscribe="true"
        :onOperate="handleOperate"
      />
      <OperationBar
        class="operation"
        :seeCount="data?.subscribeNum || 0"
        :upCount="data?.admireNum || 0"
      />
    </section>
    <VideoListCard
      class="videoList"
      :currentItemIndex="currentItemIndex"
      :groupSize="50"
      :videoList="data?.tarticleDetails || []"
      :handleSelect="(index: number) => currentItemIndex = index"
    />
    <!-- <ShareBar /> -->
  </div>
</template>

<style scoped lang="less">
.videoDetailWrapper {
  min-height: calc(100vh - 68px);
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