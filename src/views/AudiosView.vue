<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
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

  watch(() => route.params.id, () => {
    location.reload()
  })

  subscribeEvent(data)

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

  function handleNext () {
    if (
      data.value?.tarticleDetails
      && currentItemIndex.value < data.value.tarticleDetails.length - 1
      && !audioStore.loop
    ) {
      currentItemIndex.value += 1
    }
  }
</script>

<template>
  <div class="audioDetailWrapper">
    <audio
      autoplay
      preload="metadata"
      :src="audio?.resourceUrl"
      @loadstart="audioStore.reset"
      @loadedmetadata="audioStore.init"
      @play="audioStore.init"
      @pause="audioStore.init"
      @timeupdate="audioStore.throttleUpdateTime"
      @durationchange="audioStore.changeAudio"
      @ended="handleNext"
      @error="audioStore.handleError"
    ></audio>
    <HeaderBar v-if="!isInApp" :title="audio?.title" transparent />
    <section class="audioDetail" v-if="!loading && !error">
      <img class="cover" :src="data?.coverResourceUrl" width="180" height="180" />
      <MediaTextBar
        :title="audio?.name"
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
        :handlePrevClick="() => currentItemIndex -= 1"
        :handleNextClick="() => currentItemIndex += 1"
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
          isInApp && bridge.changeAudioEpisode(index)
          currentItemIndex = index
          modalOpen = false
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
}
.cover {
  margin: 40px auto 20px;;
  display: block;
  width: 180px;
  height: 180px;
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