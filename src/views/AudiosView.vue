<script setup lang="ts">
  import { ref, computed, watch, onUnmounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { showToast } from '@/common/globalToast'
  import { ErrorMsg } from '@/common/config'
  import { useAppData } from '@/stores/appData'
  import bridge from '@/common/bridge'
  import HeaderBar from '@/components/HeaderBar.vue'
  import OperationBar from '@/components/OperationBar.vue'
  import ShareBar from '@/components/ShareBar.vue'
  import MediaTextBar from '@/components/MediaTextBar.vue'
  import AudioControlBar from '@/components/AudioControlBar.vue'
  import DrawerModal from '@/common/drawerModal/DrawerModal.vue'
  import EpisodeListCard from '@/components/EpisodeListCard.vue'
  import { useAudioStore } from '@/stores/audio'
  import subscribeEvent from '@/common/subscribeEvent'
  import { articleOperate, getArticleDetail } from '@/services/articleService'

  const currentItemIndex = ref(0)
  
  const { isInApp, isLogin } = useAppData()
  const route = useRoute()
  const { data, loading, error } = getArticleDetail(Number(route.params.id))
  const audio = computed(() => data.value?.tarticleDetails.filter(v => v.resourceType === 0)[currentItemIndex.value])
  const modalOpen = ref(false)
  const timingTimeout = ref<number>()
  const autoPlayNext = ref(true)
  const audioRef = ref<HTMLAudioElement>()

  onUnmounted(() => {
    window.clearTimeout(timingTimeout.value)
  })

  watch(() => route.params.id, () => {
    location.reload()
  })

  watch(audio, (v) => {
    if (v) {
      if (isInApp) {
        bridge.changeAudioEpisode(currentItemIndex.value, v.id)
      }
      audioStore.init({ target: audioRef.value } as any) // fix wechat
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

  const audioStore = useAudioStore()

  function handleTogglePlay () {
    if (!audioStore.ready) return
    if (audioStore.error) {
      showToast(ErrorMsg.resourceLoadError)
      return
    }
    audioStore.togglePlay()
  }

  function handlePrev () {
    if (
      data.value?.tarticleDetails
      && currentItemIndex.value > 0
    ) {
      currentItemIndex.value -= 1
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

  function resetTimingSetting() {
    if (isInApp) {
      window.clearTimeout(timingTimeout.value)
      autoPlayNext.value = true
      bridge.resetTimingSetting()
    }
  }

  subscribeEvent(data, {
    handleTimingSettingChange: (value) => {
      window.clearTimeout(timingTimeout.value)
      autoPlayNext.value = true
      if (value === 'stopAfterCurrentEpisode') {
        autoPlayNext.value = false
        if (audioStore.loop) audioStore.toggleLoop()
      } else if (value === 'stopAfter30Minutes') {
        timingTimeout.value = window.setTimeout(() => {
          audioStore.pausePlay()
          resetTimingSetting()
        }, 30 * 60 * 1000)
      } else if (value === 'stopAfter60Minutes') {
        timingTimeout.value = window.setTimeout(() => {
          audioStore.pausePlay()
          resetTimingSetting()
        }, 60 * 60 * 1000)
      }
    },
  })
</script>

<template>
  <div class="audioDetailWrapper">
    <audio
      ref="audioRef"
      autoplay
      preload="metadata"
      :src="audio?.resourceUrl"
      @loadstart="audioStore.reset"
      @loadedmetadata="audioStore.init"
      @play="audioStore.init"
      @pause="audioStore.init"
      @timeupdate="audioStore.throttleUpdateTime"
      @durationchange="audioStore.changeAudio"
      @ended="!audioStore.loop && autoPlayNext && handleNext()"
      @error="audioStore.handleError"
    ></audio>
    <HeaderBar v-if="!isInApp" :title="data?.title" transparent />
    <section class="audioDetail" v-if="!loading && !error">
      <img class="cover" :src="data?.coverResourceUrl" />
      <MediaTextBar
        :title="audio?.title"
        :time="audio?.inviteTime"
        :place="audio?.area"
        :total="data?.tarticleDetails.length"
        :subscribe="data?.isSubscribed"
        :onOperate="handleOperate"
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
        :showListControl="true"
        :togglePlay="handleTogglePlay"
        :toggleLoop="audioStore.toggleLoop"
        :handleCurrentTimeChange="audioStore.changeCurrentTime"
        :handlePrevClick="() => {
          handlePrev()
          resetTimingSetting()
        }"
        :handleNextClick="() => {
          handleNext()
          resetTimingSetting()
        }"
        :handleListClick="() => modalOpen = true"
      />
    </section>
    <DrawerModal
      :open="modalOpen"
      height="60%"
      :handleClose="() => modalOpen = false"
    >
      <EpisodeListCard
        class="videoList"
        :currentItemIndex="currentItemIndex"
        :groupSize="50"
        :episodeList="data?.tarticleDetails || []"
        :handleSelect="(index: number) => {
          currentItemIndex = index
          modalOpen = false
          resetTimingSetting()
        }"
      />
    </DrawerModal>
    <!-- <ShareBar /> -->
  </div>
</template>

<style scoped lang="less">
.audioDetailWrapper {
  // min-height: calc(100vh - 68px);
  min-height: 100vh;
  background-color: #F1EAE6;
}
.audioDetail {
  padding: 0 35px;
  overflow: hidden;
}
.cover {
  margin: 40px auto 20px;
  display: block;
  max-width: 100%;
  max-height: 200px;
  border-radius: 6px;
  overflow: hidden;
  object-fit: contain;
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
.videoList {
  height: 100%;
}
</style>