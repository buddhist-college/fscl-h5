<script setup lang="ts">
  import { ref } from 'vue'

  const props = defineProps<{
    currentItemNo: number
    groupSize: number
  }>()

  const list = [
    '咬緊牙根 承擔使命', '真信切願求生淨土 五逆十惡懺悔往生', '什麼都計較的人最可憐', '這件大事，比什麼都重要', '人生的成功，得益于老師的教導', '這件大事，比什麼都重要', '咬緊牙根 承擔使命', '真信切願求生淨土 五逆十惡懺悔往生', '什麼都計較的人最可憐', '這件大事，比什麼都重要',
    '咬緊牙根 承擔使命', '真信切願求生淨土 五逆十惡懺悔往生', '什麼都計較的人最可憐', '這件大事，比什麼都重要', '人生的成功，得益于老師的教導', '這件大事，比什麼都重要', '咬緊牙根 承擔使命', '真信切願求生淨土 五逆十惡懺悔往生', '什麼都計較的人最可憐', '這件大事，比什麼都重要',
    '咬緊牙根 承擔使命', '真信切願求生淨土 五逆十惡懺悔往生', '什麼都計較的人最可憐', '這件大事，比什麼都重要', '人生的成功，得益于老師的教導', '這件大事，比什麼都重要', '咬緊牙根 承擔使命', '真信切願求生淨土 五逆十惡懺悔往生', '什麼都計較的人最可憐', '這件大事，比什麼都重要',
    '咬緊牙根 承擔使命', '真信切願求生淨土 五逆十惡懺悔往生', '什麼都計較的人最可憐', '這件大事，比什麼都重要', '人生的成功，得益于老師的教導', '這件大事，比什麼都重要', '咬緊牙根 承擔使命', '真信切願求生淨土 五逆十惡懺悔往生', '什麼都計較的人最可憐', '這件大事，比什麼都重要',
    '咬緊牙根 承擔使命', '真信切願求生淨土 五逆十惡懺悔往生', '什麼都計較的人最可憐', '這件大事，比什麼都重要', '人生的成功，得益于老師的教導', '這件大事，比什麼都重要', '咬緊牙根 承擔使命', '真信切願求生淨土 五逆十惡懺悔往生', '什麼都計較的人最可憐', '這件大事，比什麼都重要',
    '咬緊牙根 承擔使命',
  ]
  const videoList = list.map((v, i) => ({
    no: i + 1,
    title: v,
  }))
  const totalCount = videoList[videoList.length - 1].no
  const groupCount = Math.ceil(totalCount / 50)
  const currentGroup = ref(Math.ceil(props.currentItemNo / props.groupSize))

  function getItem(i: number) {
    return videoList.find((v) => v.no === (currentGroup.value - 1) * props.groupSize + i)
  }
</script>

<template>
  <section class="videoListCard">
    <div :class="['listHeader', { overflow: groupCount > 4 }]">
      <div class="tabContent">
        <a :class="['tabItem', { current: i === currentGroup }]" v-for="i in groupCount" :key="i" @click="currentGroup = i">
          {{ groupSize * (i - 1) + 1 }} ~ {{ i === groupCount ? totalCount : groupSize * i }}
        </a>
      </div>
    </div>
    <div class="listBody">
      <template v-for="i in groupSize" :key="i">
        <a :class="['listItem', { current: currentItemNo === getItem(i)!.no }]" v-if="getItem(i)">
          <span class="no">第{{ getItem(i)!.no }}集</span>
          <span class="title">{{ getItem(i)!.title }}</span>
        </a>
      </template>
    </div>
  </section>
</template>

<style scoped lang="less">
.videoListCard {

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
    .tabItem.current::before {
      bottom: -9px;
    }
  }
}
.listBody {
  padding: 19px 20px 10px;
  background: rgba(255,255,255,0.90);
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
    }
    &.current {
      color: #C50B0B;
      &::before {
        background-image: url(@/assets/images/playlist_red.png);
      }
    }
    .no {
      color: #987B67;
    }
    .title {
      flex: 1;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
</style>