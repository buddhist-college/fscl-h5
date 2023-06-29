<script setup lang="ts">
  defineProps<{
    open: boolean
    title: string
    content?: string
    firstBtnText: string
    firstBtnType?: 'default' | 'primary'
    secondBtnText?: string
    secondBtnType?: 'default' | 'primary'
    handleFirstBtnClick: () => void
    handleSecondBtnClick?: () => void
  }>()
</script>

<template>
  <div :class="['confirmModal', { visible: open }]">
    <div class="modalBg"></div>
    <div class="confirm">
      <div class="title">{{ title }}</div>
      <div class="content">{{ content }}</div>
      <div class="buttons">
        <button
          :class="firstBtnType || 'default'"
          @click="handleFirstBtnClick">
          {{ firstBtnText }}
        </button>
        <button
          v-if="secondBtnText"
          :class="secondBtnType || 'default'"
          @click="handleSecondBtnClick">
          {{ secondBtnText }}
        </button>
      </div>
    </div>
  </div>
</template>
  
<style scoped lang="less">
.confirmModal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 45px;

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
.confirm {
  position: relative;
  width: 100%;
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
}
.title {
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  text-align: center;
}
.content {
  margin-top: 5px;
  font-size: 14px;
  line-height: 24px;
  text-align: center;
}
.buttons {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  gap: 5px;
  
  button {
    flex: 1;
    font-size: 14px;
    height: 32px;
    border: 1px solid #987B67;
    border-radius: 4px;
    background-color: #fff;
    color: #987B67;
    &.primary {
      background: #987B67;
      color: #fff;
    }
  }
}
</style>