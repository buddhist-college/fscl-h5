<script setup lang="ts">
  import { watch, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import dayjs from 'dayjs'
  import { getJumpUrl } from '@/common/utils'
  import HeaderBar from '@/components/HeaderBar.vue'
  import OperationBar from '@/components/OperationBar.vue'
  import RecommendCard from '@/components/RecommendCard.vue'
  import ShareBar from '@/components/ShareBar.vue'
  import { getArticleDetail } from '@/services/articleService'
  
  const route = useRoute()
  const router = useRouter()
  const isMasterIntro = computed(() => route.path === '/masterIntro')
  const { data, loading, error } = getArticleDetail(isMasterIntro.value ? 1 : Number(route.params.id))
  const article = computed(() => data.value?.tarticleDetails.find(v => v.resourceType === 2))

  watch(() => route.params.id, () => {
    location.reload()
  })
</script>

<template>
  <HeaderBar title="資訊詳情" fixed />
  <section class="article" v-if="!loading && !error">
    <h1 class="title">{{ data?.title }}</h1>
    <p class="desc" v-if="!isMasterIntro">發布時間：{{ dayjs(data?.publishTime).format('YYYY.MM.DD') }}</p>
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
    :handleClick="(id, templateType) => router.push(getJumpUrl(id, templateType))"
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
  line-height: 28px;
}
</style>