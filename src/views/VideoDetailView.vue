<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import dayjs from 'dayjs'
  import OperationBar from '@/components/OperationBar.vue'
  import ShareBar from '@/components/ShareBar.vue'
  import MediaTextBar from '@/components/MediaTextBar.vue'
  import VideoListCard from '@/components/VideoListCard.vue'
  import VideoControlMask from '@/components/VideoControlMask.vue'
  import { useVideoStore } from '@/stores/video'
  import { getArticleDetail } from '@/services/articleService'

  const route = useRoute()
  const { data, loading, error } = getArticleDetail(Number(route.params.id))
  const video = computed(() => data.value?.tarticleDetails.filter(v => v.resourceType === 1)[0])
  // const article = computed(() => data.value?.tarticleDetails.find(v => v.resourceType === 2))

  watch(() => route.params.id, () => {
    location.reload()
  })

  const videoStore = useVideoStore()
  const maskShow = ref(true)

  const i = ref<number>()
  function handleTogglePlay () {
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
        :title="video?.title"
        :time="dayjs(video?.inviteTime).format('YYYY.MM.DD')"
        :place="video?.area"
        :total="0"
        :subscribe="true"
      />
      <OperationBar
        class="operation"
        :seeCount="data?.subscribeNum || 0"
        :upCount="data?.admireNum || 0"
      />
    </section>
    <VideoListCard
      class="videoList"
      :currentItemNo="3"
      :groupSize="50"
    />
    <ShareBar />
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