<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import Viewer from 'viewerjs'
  import 'viewerjs/dist/viewer.css'

  const articleContainerRef = ref<HTMLDivElement>()

  defineProps<{
    contentHtml?: string
  }>()

  onMounted(() => {
    const dom = articleContainerRef.value as HTMLDivElement
    new Viewer(dom, {
      navbar: false,
      title: false,
      toolbar: false,
      initialCoverage: 1,
      tooltip: false,
      toggleOnDblclick: false,
      slideOnTouch: false,
    })
  })
</script>

<template>
  <div class="articleContainer" v-html="contentHtml" ref="articleContainerRef"></div>
</template>

<style scoped lang="less">

</style>
  