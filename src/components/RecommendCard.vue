<script setup lang="ts">
  import dayjs from 'dayjs'
  import { thousandNumberFormat } from '@/common/utils'
  import { getRecommend } from '@/services/articleService'

  const props = defineProps<{
    catalogueId?: number
    handleClick: (id: number, templateType: number) => void
  }>()

  const { data, loading, error } = getRecommend({ catalogueId: Number(props.catalogueId) })

</script>

<template>
  <section class="recommendCard" v-if="!loading && !error">
    <h4 class="title">相關推薦</h4>
    <div class="content">
      <div class="item" v-for="item of data" :key="item.title" @click="handleClick(item.id, item.templteType)">
        <div class="text">
          <p class="articleTitle">{{ item.title }}</p>
          <div class="articleDesc">
            <span class="time" v-if="item.templteType !== 7">{{ dayjs(item.publishTime).format('YYYY.MM.DD') }}</span>
            <span class="see">觀自在：{{ thousandNumberFormat(item.subscribeNum || 0) }}</span>
          </div>
        </div>
        <img class="image" :src="item.coverResourceUrl" width="130" height="73" />
      </div>
    </div>
  </section>
</template>
  
<style scoped lang="less">
.recommendCard {
  padding: 10px 0;
  background: rgba(255,255,255,0.90);
}
.title {
  margin: 0;
  font-size: 16px;
  line-height: 22px;
  color: #987B67;
  font-weight: 600;
  text-indent: 20px;
  position: relative;

  &::before {
    content: '';
    display: block;
    width: 4px;
    height: 20px;
    background: #987B67;
    border-radius: 0px 200px 200px 0px;
    position: absolute;
    top: 1px;
  }
}
.content {
  margin-top: 15px;
  padding: 0 10px;

  .item {
    padding: 10px;
    display: flex;
    gap: 5px;
    box-shadow: inset 0px -2px 0px 0px rgba(152,123,103,0.05);
    .text {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .articleTitle {
      margin: 0;
      font-size: 16px;
      line-height: 22px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .articleDesc {
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .time {
        font-size: 12px;
        line-height: 17px;
        opacity: 0.3;
      }
      .see {
        color: #987B67;
        line-height: 14px;
      }
    }
    .image {
      border-radius: 5px;
      overflow: hidden;
    }
  }
}
</style>