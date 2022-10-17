<script setup lang="ts">
  defineProps<{
    fixed?: boolean
  }>()
</script>

<template>
  <section :class="['shareBar', { fixed }]">
    <div class="shareBtn">
      <a class="favorite"></a>
      <a class="download"></a>
      <a class="up"></a>
      <a class="share"></a>
      <a class="time"></a>
      <a class="voice"></a>
    </div>
  </section>
  <div class="placeholder" v-if="fixed"></div>
</template>
  
<style scoped lang="less">
.shareBar {
  width: 100%;
  padding: 14px 20px;
  display: flex;
  flex-direction: row-reverse;
  background: #fefefe;
  box-shadow: inset 0px 2px 0px 0px rgba(152,123,103,0.05);
  &.fixed {
    position: fixed;
    bottom: 0;
    z-index: 1;
  }
}
.shareBtn {
  display: flex;
  gap: 15px;
  & > a {
    display: block;
    width: 40px;
    height: 40px;
    background-size: cover;
  }
  .favorite {
    background-image: url(@/assets/images/bot_share_collect.png);
  }
  .download {
    background-image: url(@/assets/images/bot_share_download.png);
  }
  .up {
    background-image: url(@/assets/images/bot_share_hezhang.png);
  }
  .share {
    background-image: url(@/assets/images/bot_share_shr.png);
  }
  .time {
    background-image: url(@/assets/images/bot_share_time.png);
  }
  .voice {
    background-image: url(@/assets/images/bot_share_voice.png);
  }

}
.placeholder {
  height: 68px;
}
</style>