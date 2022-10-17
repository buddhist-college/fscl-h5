<script setup lang="ts">
  import HeaderBar from '@/components/HeaderBar.vue'
  import OperationBar from '@/components/OperationBar.vue'
  import ShareBar from '@/components/ShareBar.vue'
  import MediaTextBar from '@/components/MediaTextBar.vue'
  import AudioControlBar from '@/components/AudioControlBar.vue'
  import { useAudioStore } from '@/stores/audio'
  
  import demo from '@/assets/demo/1.mp3'

  const audio = {
    title: '海會聖賢｜海賢老和尚生平介紹',
    time: '2022.06.17',
    place: '香港佛陀教育協會',
    total: 508,
    see: 65379,
    up: 31199,
    cover: '',
    src: '',
    subscribe: false,
  }

  const audioStore = useAudioStore()

</script>

<template>
  <div class="audioDetailWrapper">
    <audio
      preload="metadata"
      :src="demo"
      @loadedmetadata="audioStore.init"
      @pause="audioStore.init"
      @timeupdate="audioStore.throttleUpdateTime"
      @durationchange="audioStore.changeAudio"
    ></audio>
    <HeaderBar :title="audio.title" transparent />
    <section class="audioDetail">
      <img class="cover" :src="audio.cover" width="180" height="180" />
      <MediaTextBar
        :title="audio.title"
        :time="audio.time"
        :place="audio.place"
        :total="audio.total"
        :subscribe="audio.subscribe"
      />
      <OperationBar
        class="operation"
        :seeCount="audio.see"
        :upCount="audio.up"
      />
      <AudioControlBar
        class="audioControlBar"
        :currentTime="audioStore.currentTime"
        :duration="audioStore.duration"
        :paused="audioStore.paused"
        :ended="audioStore.ended"
        :loop="audioStore.loop"
        :togglePlay="audioStore.togglePlay"
        :toggleLoop="audioStore.toggleLoop"
        :handleCurrentTimeChange="audioStore.changeCurrentTime"
        :handlePrevClick="() => {}"
        :handleNextClick="() => {}"
        :handleListClick="() => {}"
      />
    </section>
    <ShareBar />
  </div>
</template>

<style scoped lang="less">
.audioDetailWrapper {
  min-height: calc(100vh - 68px);
  background-image: linear-gradient(180deg, #DFD0C6 0%, rgba(255,255,255,0.80) 100%);
}
.audioDetail {
  padding: 0 35px;
}
.cover {
  margin: 40px auto 20px;;
  display: block;
  width: 180px;
  height: 180px;
  border-radius: 6px;
  overflow: hidden;
}
.operation {
  margin-top: 56px;
}
.audioControlBar {
  margin-top: 71px;
  padding-bottom: 36px;
}
.recommend {
  margin-top: 5px;
}
</style>