<script setup lang="ts">
import { ref } from 'vue';
import { VModal } from '@/components/ui';

const visible = ref(false);
</script>

<template>
  <div class="home">
    <h1 @click="visible = true">
      Home
    </h1>

    <VModal v-model="visible" title="jint" draggable>
      123

      <!-- <template #header>
        今天
      </template> -->
    </VModal>
  </div>
</template>

<style lang="postcss" scoped>

</style>
