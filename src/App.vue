<script setup lang="ts">
import { provide } from 'vue'
import { RouterView } from 'vue-router'
import { GlobalProvideKey, defaultBridge } from '@/common/config'

provide(
  GlobalProvideKey.bridge, 
  typeof appBridge === 'undefined' ? defaultBridge : Object.assign({ isInApp: true }, appBridge)
)
</script>

<template>
  <RouterView />
</template>
