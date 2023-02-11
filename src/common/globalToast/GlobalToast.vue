<script setup lang="ts">
  defineProps<{
    message: string | number
  }>()
</script>

<template>
  <div class="toast-box" >
    <p class="toast-message">{{ message }}</p> 
  </div>
</template>
  
<style scoped lang="less">
@keyframes show { 
  0% {opacity: 0;}
  100% {opacity:1;}
}
@keyframes hide { 
  0% {opacity: 1;}
  100% {opacity:0;}
}
.toast-box  {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.toast-message {
  max-width: 200px;
  font-size: 14px;
  color: #fff;
  background: rgb(8, 8, 8);
  padding: 8px 10px;
  border-radius: 4px;
  text-align: center;
  display: inline-block;
  animation: show 0.5s;
  &.remove {
    animation: hide 0.5s;
  }
}
</style>