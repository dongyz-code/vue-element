<script setup lang="ts">
import { VIcon } from '@/components/ui';
import { routerPush } from '@/router';

function handleBack() {
  routerPush({ name: 'home' });
}
</script>

<template>
  <div class="w-screen h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="flex items-center justify-center">
        <VIcon icon="local:404" class="text-[350px]" />
      </div>
      <div class="not-found-text">
        <el-button type="primary" @click="handleBack">
          Back to Home
        </el-button>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>

</style>
