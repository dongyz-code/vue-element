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
        <VIcon icon="local:403" class="text-[350px]" />
      </div>

      <div class="text-2xl -mt-10 mb-4 text-gray-800">
        403
      </div>
      <div class="mb-4 text-gray-500">
        Sorry, you are not authorized to access this page.
      </div>

      <div class="not-found-text">
        <el-button type="primary" @click="handleBack">
          Back Home
        </el-button>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>

</style>
