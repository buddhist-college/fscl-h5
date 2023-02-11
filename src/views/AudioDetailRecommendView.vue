<script setup lang="ts">
  import { ref } from 'vue'
  import HeaderBar from '@/components/HeaderBar.vue'
  import OperationBar from '@/components/OperationBar.vue'
  import RecommendCard from '@/components/RecommendCard.vue'
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
    text: '「和平」這兩個字，不論是在中國、在外國，千萬年來，人們所嚮往的，所希求的，也是大家都在共同努力的，為什麼不能落實？不但現代的社會沒有和平，使我們感到愈來愈動亂，危機重重，災難頻繁。有一些敏感的同學們告訴我，似乎世界末日愈來愈接近。這種觀感，這一些言論，決不是空穴來風，一定有它的原因。我們處世一定先把這個因素找出來，然後再去研究，用什麼方法把這個因素消除，我們理想的目標就能夠落實。',
  }
  const currentTab = ref<'audio' | 'text'>('audio')
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
    <HeaderBar fixed>
      <template #titleContent>
        <div class="tabBar">
          <a :class="{ current: currentTab === 'audio' }" @click="currentTab = 'audio'">音頻</a>
          <a :class="{ current: currentTab === 'text' }" @click="currentTab = 'text'">文字</a>
        </div>
      </template>
    </HeaderBar>
    <section class="audioDetail" v-show="currentTab === 'audio'">
      <img class="cover" :src="audio.cover" width="180" height="180" />
      <MediaTextBar
        simple
        :title="audio.title"
        :time="audio.time"
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
    <section class="textDetail" v-show="currentTab === 'text'">
      <div class="textContent">{{ audio.text }}</div>
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
  </div>
  <RecommendCard class="recommend" v-show="currentTab === 'audio'" />
  <ShareBar fixed />
</template>
  
<style scoped lang="less">
.audioDetailWrapper {
  min-height: calc(100vh - 68px);
  background-color: #F1EAE6;
}
.tabBar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 41px;
  > a {
    font-size: 16px;
    line-height: 22px;
    opacity: 0.5;
    width: 48px;
    text-align: center;
    &.current {
      font-weight: 600;
      opacity: 1;
      position: relative;
      &::before {
        content: '';
        display: block;
        width: 100%;
        height: 4px;
        background: #987B67;
        border-radius: 200px 200px 0px 0px;
        position: absolute;
        bottom: -12px;
      }
    }
  }
}
.audioDetail {
  padding: 0 35px;
  .cover {
    margin: 40px auto 20px;;
    display: block;
    width: 180px;
    height: 180px;
    border-radius: 6px;
    overflow: hidden;
  }
  .operation {
    margin-top: 30px;
  }
  .audioControlBar {
    margin-top: 41px;
    padding-bottom: 41px;
  }
}

.textDetail {
  padding: 0 35px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: calc(100vh - 68px - 44px);
  .textContent {
    margin-top: 20px;
    font-size: 16px;
    line-height: 28px;
  }
  .audioControlBar {
    margin-top: 41px;
    padding-bottom: 18px;
  }
}
.recommend {
  margin-top: 5px;
}
</style>