<script setup lang="ts">
  defineProps<{
    open: boolean
    height?: string
    title?: string
    selectMenuList?: { label: string; value: any }[]
    selectMenu?: any
    showCloseBtn?: boolean
    showCancelBtn?: boolean
    handleMenuSelect?: (value: any) => void
    handleClose: () => void
  }>()
</script>

<template>
  <div :class="['drawerModal', { visible: open }]">
    <div class="modalBg" @click="handleClose"></div>
    <div class="drawer" :style="{ height }">
      <a class="closeBtn" v-if="showCloseBtn" @click="handleClose"></a>
      <div class="title" v-if="title">{{ title }}</div>
      <ul class="selectMenu" v-if="selectMenuList">
        <li
          v-for="item in selectMenuList"
          :key="item.label"
          :class="['item', { selected: selectMenu === item.value }]"
          @click="handleMenuSelect && handleMenuSelect(item.value)"
        >{{ item.label }}</li>
      </ul>
      <slot></slot>
      <div class="cancelBtn" v-if="showCancelBtn" @click="handleClose">取消</div>
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
  z-index: 1;

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
  background: #f6f5f5;
  border-radius: 10px 10px 0px 0px;
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
  .title {
    font-size: 18px;
    font-weight: 600;
    line-height: 25px;
    padding: 0 20px 20px 20px;
  }
  .selectMenu {
    .item {
      height: 50px;
      padding: 0 20px;
      font-size: 14px;
      line-height: 50px;
      &.selected {
        color: #C50B0B;
        font-weight: 600;
        background: #fff;
        box-shadow: inset 0px -1px 0px 0px rgba(152,123,103,0.1), inset 0px 1px 0px 0px rgba(152,123,103,0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        &::after {
          content: '';
          display: block;
          width: 14px;
          height: 14px;
          background-image: url(@/assets/images/select.png);
          background-size: 100% 100%;
        }
      }
    }
  }
  .cancelBtn {
    font-size: 16px;
    line-height: 22px;
    text-align: center;
    padding: 14px 0;
    box-shadow: inset 0px 1px 0px 0px rgba(152,123,103,0.1);
    background: #fff;
  }
}
</style>