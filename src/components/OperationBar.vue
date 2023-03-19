<script setup lang="ts">
  import { thousandNumberFormat } from '@/common/utils'

  defineProps<{
    seeCount: number
    upCount: number
  }>()
</script>

<template>
  <div class="operationBar">
    <a class="see">觀自在：{{ thousandNumberFormat(seeCount) }}</a>
    <a class="up">讚佛：{{ thousandNumberFormat(upCount) }}</a>
  </div>
</template>
  
<style scoped lang="less">
.operationBar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  .see, .up {
    display: block;
    width: 120px;
    padding: 8px 0;
    background: #EDBF90;
    background-color: rgba(237,191,144, 0.3);
    border-radius: 15px;
    font-size: 12px;
    line-height: 17px;
    font-weight: 600;
    text-align: center;
  }
  .see {
    color: #987B67;
  }
  .up {
    color: #C50B0B;
  }
}
</style>