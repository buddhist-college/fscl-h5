<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import type { ArticleDetail } from '@/services/article';

  const props = defineProps<{
    currentItemIndex: number
    groupSize: number
    episodeList: ArticleDetail[]
    handleSelect: (index: number) => void
  }>()

  const totalCount = computed(() => props.episodeList.length)
  const groupCount = computed(() => Math.ceil(totalCount.value / 50))
  const currentGroupIndex = ref(Math.ceil((props.currentItemIndex + 1) / props.groupSize - 1))

  watch(() => props.currentItemIndex, (v) => {
    currentGroupIndex.value = Math.ceil((v + 1) / props.groupSize - 1)
  })

  function getItem(i: number) {
    return props.episodeList[currentGroupIndex.value * props.groupSize + i - 1]
  }
</script>

<template>
  <section class="episodeListCard">
    <div :class="['listHeader', { overflow: groupCount > 4 }]">
      <div class="tabContent">
        <a
          :class="['tabItem', { current: i === currentGroupIndex + 1 }]"
          v-for="i in groupCount"
          :key="i"
          @click="currentGroupIndex = i - 1"
        >
          <!-- {{ groupSize * (i - 1) + 1 }} ~ {{ i === groupCount ? totalCount : groupSize * i }} -->
          第{{i}}頁
        </a>
      </div>
    </div>
    <div class="listBody">
      <template v-for="i in groupSize" :key="i">
        <a
          :class="['listItem', { current: currentItemIndex === currentGroupIndex * props.groupSize + i - 1 }]"
          v-if="getItem(i)"
          @click="handleSelect(currentGroupIndex * props.groupSize + i - 1)"
        >
          <span class="title">{{ getItem(i).title }}</span>
        </a>
      </template>
    </div>
  </section>
</template>

<style scoped lang="less">
.episodeListCard {
  display: flex;
  flex-direction: column;
}
.listHeader {
  margin: 0 20px;
  padding: 9px 0;
  .tabContent {
    display: flex;
    flex-wrap: nowrap;
    gap: 40px;
  }
  .tabItem {
    display: block;
    white-space: nowrap;
    font-size: 12px;
    line-height: 17px;
    font-weight: 600;
    opacity: 0.5;
    position: relative;
    &.current {
      font-weight: 600;
      opacity: 1;
      position: relative;
      &::before {
        content: '';
        display: block;
        width: 100%;
        height: 4px;
        background: #C50B0B;;
        border-radius: 0px 0px 200px 200px;
        position: absolute;
        bottom: -12px;
      }
    }
  }
  &.overflow {
    overflow-x: auto;
    overflow-y: hidden;
    &::-webkit-scrollbar {
      display: none;
    }
    .tabItem.current::before {
      bottom: -9px;
    }
  }
}
.listBody {
  flex: 1;
  padding: 19px 20px 10px;
  background: rgba(255,255,255,0.90);
  overflow-x: hidden;
  overflow-y: auto;
  .listItem {
    font-size: 13px;
    line-height: 38px;
    display: flex;
    align-items: center;
    gap: 10px;
    &::before {
      content: '';
      display: block;
      width: 14px;
      height: 14px;
      background-image: url(@/assets/images/playlist_de.png);
      background-size: cover;
      flex: none;
    }
    &.current {
      color: #C50B0B;
      &::before {
        background-image: url(@/assets/images/playlist_red.png);
      }
    }
    .title {
      color: #987B67;
      flex: 1;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
</style>