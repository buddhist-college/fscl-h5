<script setup lang="ts">
  import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
  import { useRoute } from 'vue-router'
  import dayjs from 'dayjs'
  import bridge from '@/common/bridge'
  import { showToast } from '@/common/globalToast'
  import { ErrorMsg } from '@/common/config'
  import useJump from '@/common/useJump'
  import { useAppData } from '@/stores/appData'
  import HeaderBar from '@/components/HeaderBar.vue'
  import OperationBar from '@/components/OperationBar.vue'
  import RecommendCard from '@/components/RecommendCard.vue'
  import ShareBar from '@/components/ShareBar.vue'
  import MediaTextBar from '@/components/MediaTextBar.vue'
  import AudioControlBar from '@/components/AudioControlBar.vue'
  import ArticleContainer from '@/components/ArticleContainer.vue'
  import { useAudioStore } from '@/stores/audio'
  import subscribeEvent from '@/common/subscribeEvent'
  import { addPlayEvent } from '@/common/playEventHandler'
  import { getArticleDetail } from '@/services/articleService'

  const { isInApp } = useAppData()
  const route = useRoute()
  const jump = useJump()
  const { data, loading, error } = getArticleDetail(Number(route.params.id))
  const audio = computed(() => data.value?.tarticleDetails.find(v => v.resourceType === 0))
  const article = computed(() => data.value?.tarticleDetails.find(v => v.resourceType === 2))
  const audioRef = ref<HTMLAudioElement>()
  const unsubscribeEvent = ref<() => void>()

  watch(() => route.params.id, () => {
    location.reload()
  })

  watch(audio, (v) => {
    if (v) {
      if (isInApp) {
        bridge.changeMediaUrl({
          audioUrl: v.resourceUrl || '',
          videoUrl: '',
        })
      }
      audioStore.init({ target: audioRef.value } as any) // fix wechat
    }
  })

  const currentTab = ref<'audio' | 'text'>('audio')
  const audioStore = useAudioStore()

  function handleTogglePlay () {
    if (!audioStore.ready) return
    if (audioStore.error) {
      showToast(ErrorMsg.resourceLoadError)
      return
    }
    audioStore.togglePlay()
  }

  onMounted(() => {
    unsubscribeEvent.value = subscribeEvent(data, {
      handleGetMediaCurrentTime: () => {
        return audioStore.currentTime || 0
      },
    })
  })

  onUnmounted(() => {
    unsubscribeEvent.value?.()
  })
</script>

<template>
  <div class="audioDetailWrapper">
    <audio
      ref="audioRef"
      autoplay
      preload="metadata"
      :src="audio?.resourceUrl"
      @loadstart="() => { audioStore.reset(); addPlayEvent(audioRef!, { mediaProvider: 'audio' }) }"
      @loadedmetadata="audioStore.init"
      @play="audioStore.init"
      @pause="audioStore.init"
      @timeupdate="audioStore.throttleUpdateTime"
      @durationchange="audioStore.changeAudio"
      @error="audioStore.handleError"
    ></audio>
    <HeaderBar :hideBackBtn="isInApp" fixed>
      <template #titleContent>
        <div class="tabBar">
          <a :class="{ current: currentTab === 'audio' }" @click="currentTab = 'audio'">音頻</a>
          <a :class="{ current: currentTab === 'text' }" @click="currentTab = 'text'">文字</a>
        </div>
      </template>
    </HeaderBar>
    <section class="audioDetail" v-show="currentTab === 'audio'" v-if="!loading && !error">
      <img class="cover" :src="data?.coverResourceUrl" />
      <MediaTextBar
        simple
        :title="audio?.title"
        :publishTime="dayjs(data?.publishTime).format('YYYY.MM.DD')"
      />
      <OperationBar
        class="operation"
        :seeCount="data?.subscribeNum || 0"
        :upCount="data?.admireNum || 0"
      />
      <AudioControlBar
        class="audioControlBar"
        :currentTime="audioStore.currentTime"
        :duration="audioStore.duration"
        :paused="audioStore.paused"
        :ended="audioStore.ended"
        :loop="audioStore.loop"
        :showListControl="false"
        :togglePlay="audioStore.togglePlay"
        :toggleLoop="audioStore.toggleLoop"
        :handleCurrentTimeChange="audioStore.changeCurrentTime"
      />
    </section>
    <section class="articleDetail" v-show="currentTab === 'text'">
      <ArticleContainer class="textDetail" :contentHtml="article?.content" />
      <AudioControlBar
        class="audioControlBar"
        :currentTime="audioStore.currentTime"
        :duration="audioStore.duration"
        :paused="audioStore.paused"
        :ended="audioStore.ended"
        :loop="audioStore.loop"
        :showListControl="false"
        :togglePlay="handleTogglePlay"
        :toggleLoop="audioStore.toggleLoop"
        :handleCurrentTimeChange="audioStore.changeCurrentTime"
      />
    </section>
  </div>
  <RecommendCard
    v-if="!loading && !error"
    class="recommend"
    v-show="currentTab === 'audio'"
    :catalogueId="data?.catalogueId"
    :handleClick="jump"
  />
  <!-- <ShareBar fixed /> -->
</template>
  
<style scoped lang="less">
.audioDetailWrapper {
  background-color: #F1EAE6;
}
.tabBar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 41px;
  > a {
    font-size: 18px;
    line-height: 24px;
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
    max-width: 100%;
    max-height: 200px;
    border-radius: 6px;
    overflow: hidden;
    object-fit: contain;
  }
  .operation {
    margin-top: 35px;
  }
  .audioControlBar {
    margin-top: 45px;
    padding-bottom: 41px;
  }
}

.articleDetail {
  padding: 0 35px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: calc(var(--100vh, 100vh) - 44px);
  .textDetail {
    flex: 1;
    margin-top: 18px;
    font-size: 18px;
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