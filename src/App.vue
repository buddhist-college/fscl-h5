<script setup lang="ts">
import { provide } from 'vue'
import { RouterView } from 'vue-router'
import { GlobalProvideKey, defaultAppData, defaultAppChannel } from '@/common/config'

provide(
  GlobalProvideKey.appData, 
  typeof window.appData === 'undefined' ? defaultAppData : window.appData,
)
provide(
  GlobalProvideKey.appChannel,
  typeof window.appChannel === 'undefined' ? defaultAppChannel : window.appChannel,
)
</script>

<template>
  <RouterView />
</template>
