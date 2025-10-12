<script lang="ts" setup>
import type { PageData, PageEmits } from './types';
import { computed } from 'vue';
import { defaultPageData } from './types';

const props = defineProps<{
  pageData: PageData;
}>();
const emit = defineEmits<PageEmits>();

const pageProps = computed(() => {
  return {
    ...defaultPageData,
    ...props.pageData,
  };
});

function updateCurrentPage(current: number) {
  emit('update', current, pageProps.value.size);
  emit('update:current', current);
}

function updatePageSize(size: number) {
  emit('update', pageProps.value.current, size);
  emit('update:size', size);
}
</script>

<template>
  <div class="v-page">
    <el-pagination
      background
      :total="pageProps.total"
      :current-page="pageProps.current"
      :page-size="pageProps.size"
      :page-sizes="pageProps.pageSizes"
      :layout="pageProps.layout?.join()"
      @update:current-page="updateCurrentPage"
      @update:page-size="updatePageSize"
    >
      <slot name="default">
      </slot>
    </el-pagination>
  </div>
</template>

<style lang="postcss" scoped></style>
