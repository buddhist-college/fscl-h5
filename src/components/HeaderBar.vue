<script setup lang="ts">
  import { useRouter } from 'vue-router'

  const router = useRouter()

  defineProps<{
    hideBackBtn?: boolean
    titleContent?: any
    title?: string
    transparent?: boolean
    fixed?: boolean
    videoMask?: boolean
  }>()

  function handleBack () {
    router.back()
  }
</script>

<template>
  <header :class="[$attrs.class, 'headerBar', { transparent }, { fixed }, { videoMask }]">
    <a class="returnBtn" @click="handleBack" v-visible="!hideBackBtn"></a>
    <div class="title" v-if="title">
      {{ title }}
    </div>
    <div class="titleContent" v-else>
      <slot name="titleContent"></slot>
    </div>
    <div class="rightBtn"></div>
  </header>
  <div class="headerBarPlaceholder" v-if="fixed"></div>
</template>

<style scoped lang="less">
.headerBar {
  padding: 0 14px;
  width: 100%;
  height: 44px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // background-color: #F9F2EA;
  background-color: #F1EAE6;
  background-image: url(@/assets/images/top_title_bg.png);
  background-position: left bottom;
  background-size: cover;
  &.transparent, &.videoMask {
    background: transparent;
  }
  &.fixed {
    position: fixed;
    z-index: 1;
  }
}
.headerBarPlaceholder {
  height: 44px;
}
.returnBtn {
  display: block;
  width: 24px;
  height: 24px;
  background-image: url(@/assets/images/title_returnback_btn.png);
  background-size: cover;
  .videoMask & {
    background-image: url(@/assets/images/title_returnback_btn_white.png);
  }
}
.titleContent {
  flex: 1;
}
.title {
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  .videoMask & {
    color: #fff;
  }
}
.rightBtn {
  width: 24px;
}
</style>
  