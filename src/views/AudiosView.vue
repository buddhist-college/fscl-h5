<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import HeaderBar from '@/components/HeaderBar.vue'
  import OperationBar from '@/components/OperationBar.vue'
  import ShareBar from '@/components/ShareBar.vue'
  import MediaTextBar from '@/components/MediaTextBar.vue'
  import AudioControlBar from '@/components/AudioControlBar.vue'
  import { useAudioStore } from '@/stores/audio'
  import { getArticleDetail } from '@/services/articleService'

  const currentItemIndex = ref(0)
  
  const route = useRoute()
  const { data, loading, error } = getArticleDetail(Number(route.params.id))
  const audio = computed(() => data.value?.tarticleDetails.filter(v => v.resourceType === 0)[currentItemIndex.value])

  watch(() => route.params.id, () => {
    location.reload()
  })

  const audioStore = useAudioStore()

</script>

<template>
  <div class="audioDetailWrapper">
    <audio
      preload="metadata"
      :src="audio?.resourceUrl"
      @loadstart="audioStore.reset"
      @loadedmetadata="audioStore.init"
      @pause="audioStore.init"
      @timeupdate="audioStore.throttleUpdateTime"
      @durationchange="audioStore.changeAudio"
    ></audio>
    <HeaderBar :title="audio?.name" transparent />
    <section class="audioDetail" v-if="!loading && !error">
      <img class="cover" :src="data?.coverResourceUrl" width="180" height="180" />
      <MediaTextBar
        :title="audio?.name"
        :time="audio?.inviteTime"
        :place="audio?.area"
        :total="data?.tarticleDetails.length"
        :subscribe="true"
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
        :togglePlay="audioStore.togglePlay"
        :toggleLoop="audioStore.toggleLoop"
        :handleCurrentTimeChange="audioStore.changeCurrentTime"
        :handlePrevClick="() => currentItemIndex -= 1"
        :handleNextClick="() => currentItemIndex += 1"
        :handleListClick="() => {}"
      />
    </section>
    <!-- <ShareBar /> -->
  </div>
</template>

<style scoped lang="less">
.audioDetailWrapper {
  min-height: calc(100vh - 68px);
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