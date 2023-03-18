<script setup lang="ts">
  defineProps<{
    open: boolean
    height?: string
    handleClose: () => void
  }>()
</script>

<template>
  <div :class="['drawerModal', { visible: open }]">
    <div class="modalBg"></div>
    <div class="drawer" :style="{ height }">
      <a class="closeBtn" @click="handleClose"></a>
      <slot></slot>
    </div>
  </div>
</template>
  
<style scoped lang="less">
.drawerModal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  visibility: hidden;

  &.visible {
    visibility: visible;
    .modalBg {
      opacity: 1;
    }
    .drawer {
      height: auto;
      max-height: 100%;
    }
  }
}
.modalBg {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.3s;
}
.drawer {
  position: absolute;
  bottom: 0;
  width: 100%;
  transition: height 0.3s, max-height 0.3s;
  height: 0;
  max-height: 0;
  background: rgba(255,255,255,0.9);
  border-radius: 10px 10px 0px 0px;
  backdrop-filter: blur(5px);
  padding-top: 20px;

  .closeBtn {
    position: absolute;
    top: 9px;
    right: 9px;
    width: 22px;
    height: 22px;
    background-image: url(@/assets/images/close_btn.png);
    background-size: contain;
  }
}
</style>