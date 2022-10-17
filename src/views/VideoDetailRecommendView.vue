<script setup lang="ts">
  import { ref } from 'vue'
  import OperationBar from '@/components/OperationBar.vue'
  import ShareBar from '@/components/ShareBar.vue'
  import MediaTextBar from '@/components/MediaTextBar.vue'
  import RecommendCard from '@/components/RecommendCard.vue'
  import VideoControlMask from '@/components/VideoControlMask.vue'
  import { useVideoStore } from '@/stores/video'

  import demo from '@/assets/demo/1.mp4'

  const video = {
    title: '海會聖賢｜海賢老和尚生平介紹',
    time: '2022.06.17',
    see: 65379,
    up: 31199,
    src: '',
    text: '學佛，自古以來，頭一個目標就是你所問的，怎麼樣把心安下來、心定下來？依照佛教導，用佛陀的方法，我們確實可以安心。而且是修行的第一樁大事，也可以說學佛學什麼？就是學安心。心安了，你就得大自在，什麼大自在？十法界，想到哪裡去就能到哪裡去，十法界裡面你自在往來。凡夫做不到，為什麼做不到？妄念太多了，妄想太多，所以你做不到。',
  }

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
  <div class="videoDetailRecommendWrapper">
    <section className="videoElmContainer">
      <video
        playsinline
        preload="metadata"
        :src="demo"
        @loadedmetadata="videoStore.init"
        @pause="(e) => { showMask(); videoStore.init(e) }"
        @timeupdate="videoStore.throttleUpdateTime"
        @durationchange="videoStore.changeVideo"
        @click="showMask"
      ></video>
      <Transition name="fade">
        <VideoControlMask
          :title="video.title"
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
    <section class="videoDetail">
      <MediaTextBar
        simple
        class="mediaText"
        :title="video.title"
        :time="video.time"
      />
      <OperationBar
        class="operation"
        :seeCount="video.see"
        :upCount="video.up"
      />
      <div class="textDetail">{{ video.text }}</div>
    </section>
  </div>
  <RecommendCard class="recommend" />
  <ShareBar fixed />
</template>

<style scoped lang="less">
.videoDetailRecommendWrapper {
  min-height: calc(100vh - 68px);
  background-image: linear-gradient(180deg, #DFD0C6 0%, rgba(255,255,255,0.80) 100%);
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
  margin-top: 27px;
}
.textDetail {
  margin-top: 27px;
  padding-bottom: 25px;
  font-size: 16px;
  line-height: 28px;
}
.recommend {
  margin-top: 5px;
}
</style>