<script setup lang="ts">
  import { watch, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import dayjs from 'dayjs'
  import useJump from '@/common/useJump'
  import { useAppData } from '@/stores/appData'
  import HeaderBar from '@/components/HeaderBar.vue'
  import OperationBar from '@/components/OperationBar.vue'
  import RecommendCard from '@/components/RecommendCard.vue'
  import ShareBar from '@/components/ShareBar.vue'
  import subscribeEvent from '@/common/subscribeEvent'
  import { getArticleDetail } from '@/services/articleService'
  
  const { isInApp } = useAppData()
  const route = useRoute()
  const jump = useJump()
  const isIntro = computed(() => route.name === 'intro')
  const { data, loading, error } = getArticleDetail(Number(route.params.id))
  const article = computed(() => data.value?.tarticleDetails.find(v => v.resourceType === 2))

  watch(() => route.params.id, () => {
    location.reload()
  })

  subscribeEvent(data, {})
</script>

<template>
  <HeaderBar v-if="!isInApp" :title="isIntro ? data?.title : '資訊詳情'" fixed />
  <section class="article" v-if="!loading && !error">
    <h1 class="title">{{ data?.title }}</h1>
    <p class="desc" v-if="!isIntro">發布時間：{{ dayjs(data?.publishTime).format('YYYY.MM.DD') }}</p>
    <div class="detail articleContainer" v-html="article?.content"></div>
    <OperationBar
      class="operation"
      :seeCount="data?.subscribeNum || 0"
      :upCount="data?.admireNum || 0"
    />
  </section>
  <RecommendCard
    v-if="!loading && !error"
    class="recommend"
    :catalogueId="data?.catalogueId"
    :handleClick="jump"
  />
  <!-- <ShareBar fixed /> -->
</template>
  
<style scoped lang="less">
.article {
  margin-top: 5px;
  padding: 20px;
  background: rgba(255,255,255,0.90);
}
.title {
  margin: 0;
  font-size: 22px;
  line-height: 30px;
  font-weight: 600;
}
.desc {
  margin: 5px 0 0;
  line-height: 14px;
  opacity: 0.3;
}
.operation {
  margin-top: 28px;
}
.recommend {
  margin-top: 5px;
}
</style>

<style lang="less">
.detail {
  margin-top: 14px;
  font-size: 16px;
  line-height: 26px;
}
</style>