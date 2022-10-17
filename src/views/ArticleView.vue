<script setup lang="ts">
  import HeaderBar from '@/components/HeaderBar.vue'
  import OperationBar from '@/components/OperationBar.vue'
  import RecommendCard from '@/components/RecommendCard.vue'
  import ShareBar from '../components/ShareBar.vue'

  const article = {
    title: '稻盛和夫的經營理念',
    time: '2022.06.17',
    detail: '日本一個很著名的企業家，叫稻盛和夫。他經營企業五十多年，非常成功，多少次的金融風暴，他都沒有捲進去。他是怎麼經營的？我昨天看這個片子很感動，他從小是貧窮人家的子弟，生活非常清苦，所以學了一些老實做人這些道理。他一生經營本著四個字，「敬天愛人」。他經營的目標，是我們經營就是要賺錢，賺錢給誰？賺錢給員工。把員工的利益看成公司營運第一個利益，所以員工高興了，都拼命給他幹。',
    see: 65379,
    up: 31199,
  }
</script>

<template>
  <HeaderBar title="資訊詳情" fixed />
  <section class="article">
    <h1 class="title">{{ article.title }}</h1>
    <p class="desc">發布時間：{{ article.time }}</p>
    <div class="detail">{{ article.detail }}</div>
    <OperationBar class="operation" :seeCount="article.see" :upCount="article.up" />
  </section>
  <RecommendCard class="recommend" />
  <ShareBar fixed />
</template>
  
<style scoped lang="less">
.article {
  margin-top: 5px;
  padding: 20px;
  background: rgba(255,255,255,0.90);
}
.title {
  margin: 0;
  font-size: 22px;
  line-height: 30px;
  font-weight: 600;
}
.desc {
  margin: 5px 0 0;
  line-height: 14px;
  opacity: 0.3;
}
.detail {
  margin-top: 14px;
  font-size: 16px;
  line-height: 28px;
}
.operation {
  margin-top: 28px;
}
.recommend {
  margin-top: 5px;
}
</style>