<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { isIos, isAndroid } from '@/common/utils'
  import { AppDownloadUrl, ErrorMsg } from '@/common/config'
  import { showToast } from '@/common/globalToast'
  import fscl from '@/assets/images/fscl.png'
  import fsclLogo from '@/assets/images/fscl_logo.png'
  import xueyuan from '@/assets/images/xueyuan.png'
  import xueyuanLogo from '@/assets/images/xueyuan_logo.png'

  const route = useRoute()
  const type = computed(() => route.params.type === 'xueyuanApp' ? 'xueyuan' : 'fscl')

  const downloadUrl = computed(() => {
    let url
    if (isIos) {
      url = type.value === 'xueyuan' ? AppDownloadUrl.xueyuanIos : AppDownloadUrl.fsclIos
    } else if (isAndroid) {
      url = type.value === 'xueyuan' ? AppDownloadUrl.xueyuanAndroid : AppDownloadUrl.fsclAndroid
    } else {
      url = 'javascript:;'
    }
    if (!url) {
      url = 'javascript:;'
    }
    return url;
  })
  const handleClick = () => {
    if (downloadUrl.value === 'javascript:;') {
      showToast(ErrorMsg.unExistDownloadUrl)
    }
  }
</script>

<template>
  <div class="download">
    <div class="pictureContainer">
      <img :src="type === 'fscl' ? fscl : xueyuan" />
    </div>
  </div>
  <div class="linkContainer">
    <img v-if="type === 'fscl'" width="79" height="23" :src="fsclLogo" style="margin-top: 3px" />
    <img v-else width="195" height="33" :src="xueyuanLogo" />
    <a class="btn" :href="downloadUrl" @click="handleClick">APP下載</a>
  </div>
</template>

<style scoped lang="less">
.download {
  height: 100vh;
}
.pictureContainer {
  padding: 28px 20px 0;
  img {
    width: 100%;
  }
}
.linkContainer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 78px;
  padding: 11px 20px 0 25px;
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  .btn {
    width: 120px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-weight: 600;
    background-color: #987B67;
    border-radius: 4px;
  }
}
</style>