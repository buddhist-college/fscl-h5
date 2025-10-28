<script setup lang="ts">
  import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute } from 'vue-router'
  import dayjs from 'dayjs'
  import useJump from '@/common/useJump'
  import { useAppData } from '@/stores/appData'
  import HeaderBar from '@/components/HeaderBar.vue'
  import OperationBar from '@/components/OperationBar.vue'
  import ArticleContainer from '@/components/ArticleContainer.vue'
  import RecommendCard from '@/components/RecommendCard.vue'
  import subscribeEvent from '@/common/subscribeEvent'
  import { getArticleDetail } from '@/services/articleService'
  
  const { t } = useI18n()
  const { isInApp } = useAppData()
  const route = useRoute()
  const jump = useJump()
  const isIntro = computed(() => route.name === 'intro')
  const { data, loading, error } = getArticleDetail(Number(route.params.id))
  const article = computed(() => data.value?.tarticleDetails.find(v => v.resourceType === 2))
  const unsubscribeEvent = ref<() => void>()

  watch(() => route.params.id, () => {
    location.reload()
  })

  onMounted(() => {
    unsubscribeEvent.value = subscribeEvent(data, {})
  })

  onUnmounted(() => {
    unsubscribeEvent.value?.()
  })
</script>

<template>
  <HeaderBar v-if="!isInApp" :title="isIntro ? data?.title : t('articleDetail')" fixed />
  <section class="article" v-if="!loading && !error">
    <h1 class="title">{{ data?.title }}</h1>
    <p class="desc" v-if="!isIntro">{{ t('publishTime') }}：{{ dayjs(data?.publishTime).format('YYYY.MM.DD') }}</p>
    <ArticleContainer class="detail" :contentHtml="article?.content" />
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
  font-size: 18px;
  line-height: 28px;
}
</style>