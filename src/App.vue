<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { RouterView } from 'vue-router'

const resizeHandler = function() {
  document.documentElement.style.setProperty('--vh', window.innerHeight / 100 + 'px')
  document.documentElement.style.setProperty('--100vh', window.innerHeight + 'px')
}
onMounted(() => {
  resizeHandler()
  window.addEventListener('resize', resizeHandler)
})
onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler)
})
</script>

<template>
  <RouterView />
</template>
