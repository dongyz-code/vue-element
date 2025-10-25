<script setup lang="ts">
import { useTheme } from './theme';

useTheme();
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<style scoped lang="scss">
</style>
