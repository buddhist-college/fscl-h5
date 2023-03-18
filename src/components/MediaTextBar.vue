<script setup lang="ts">
  import { inject } from 'vue'
  import dayjs from 'dayjs'
  import { GlobalProvideKey, defaultBridge } from '@/common/config'

  defineProps<{
    simple?: boolean
    title?: string
    time?: string
    subscribe?: boolean
    place?: string
    total?: number
    onOperate?: (opType: number, opValue: number) => void
  }>()

  const bridge = inject(GlobalProvideKey.bridge, defaultBridge)
</script>

<template>
  <div class="mediaTextBar">
    <div>
      <h1 class="title">{{ title }}</h1>
      <a
        :class="['subscribeBtn', subscribe ? 'unSub': 'sub']"
        v-if="!simple && bridge.isLogin"
        @click="onOperate && onOperate(1, subscribe ? 0 : 1)"
      >
        <span class="subscribeIcon"></span>
        {{ subscribe ? '取消' : '訂閱' }}
      </a>
    </div>
    <div>
      <div class="total" v-if="!simple">
        總共<span>{{ total }}</span>集
      </div>
      <div class="desc">啟講時間：{{ time ? dayjs(time).format('YYYY.MM.DD') : '' }}</div>
    </div>
    <div class="place" v-if="!simple">啟講地點：{{ place }}</div>
  </div>
</template>
  
<style scoped lang="less">
.mediaTextBar {
  display: flex;
  flex-direction: column;
  gap: 10px;
  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
  }
  .title {
    margin: 0;
    font-size: 18px;
    line-height: 28px;
    font-weight: 600;
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .subscribeBtn {
    display: block;
    width: 60px;
    height: 28px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    font-weight: 600;
    color: #fff;
    &.sub {
      background: rgba(152,123,103, 1);
      .subscribeIcon {
        background-image: url(@/assets/images/sub_icon_plus.png);
      }
    }
    &.unSub {
      background: rgba(152,123,103, 0.55);
      .subscribeIcon {
        background-image: url(@/assets/images/sub_icon_minus.png);
      }
    }
    .subscribeIcon {
      width: 10px;
      height: 10px;
      background-size: cover;
    }
  }
  .total {
    line-height: 14px;
    opacity: 0.8;
    span {
      margin: 0 2px;
      padding: 1px 4px;
      display: inline-block;
      color: #987B67;
      background: rgba(255,255,255,0.30);
      border: 2px solid rgba(237,191,144,1);
      border-radius: 8px;
    }
  }
  .desc {
    line-height: 14px;
    opacity: 0.3;
  }
  .place {
    line-height: 14px;
    color: #987B67;
  }
}
</style>