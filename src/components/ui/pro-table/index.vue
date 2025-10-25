<script setup lang="ts" generic="T extends DefaultRow = DefaultRow">
import type { ElTable } from 'element-plus';
import type { DefaultRow, ProTableEmits, ProTableExpose, ProTableProps } from './types';
import type { Key } from '@/types';

import { useProTable } from './hooks/useProTable';

const props = withDefaults(defineProps<ProTableProps<T>>(), {
  pageConfig: () => ({
    currentPage: 1,
    pageSize: 10,
    total: 0,
    pageSizes: [10, 20, 50, 100],
    layout: 'total, sizes, prev, pager, next, jumper',
  }),
  rowKey: 'id',
  sortable: false,
  filterable: false,
  loading: false,
  border: false,
  stripe: false,
  showHeader: true,
  emptyText: '暂无数据',
  fit: true,
});

// Emits 定义
const emit = defineEmits<ProTableEmits<T>>();

defineSlots<{
  [key: string]: (props: any) => any;
}>();

const selectionKeys = defineModel<Key[]>('selection', { default: () => [] });

const {
  tableRef,
  visibleColumns,
  tableData,
  getRowKey,
  setPageData,
  handleFilterChange,
  handleRowClick,
  handleRowDblclick,
  handlePageChange,
  refresh,

  /** 选择相关 */
  headerChecked,
  toggleRowSelection,
  clearSelection,
  isChecked,
  isHalfChecked,
  toggleAllSelection,

  PageComponent,
} = useProTable({ props, emit, selectionKeys });

// 暴露方法
defineExpose<ProTableExpose<T>>({
  refresh,
  setPageData,
  clearSelection,
});
</script>

<template>
  <div class="pro-table">
    <!-- 表格主体 -->
    <el-table
      ref="tableRef"
      :size="size"
      :fit="fit"
      :default-expand-all="defaultExpandAll"
      :expand-row-keys="expandRowKeys"
      :row-key="getRowKey"
      :data="tableData"
      :height="height"
      :max-height="maxHeight"
      :border="border"
      :stripe="stripe"
      :show-header="showHeader"
      :empty-text="emptyText"
      :loading="loading"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDblclick"
      @filter-change="handleFilterChange"
    >
      <slot></slot>

      <!-- 选择列 -->
      <el-table-column
        v-if="$attrs.selection || selectionConfig"
        :width="55"
        :fixed="selectionConfig?.fixed"
      >
        <template v-if="selectionConfig?.type === 'checkbox'" #header>
          <el-checkbox
            :disabled="loading"
            :model-value="headerChecked.checked"
            :indeterminate="headerChecked.halfChecked"
            @change="toggleAllSelection($event as boolean)"
          >
          </el-checkbox>
        </template>
        <template #default="{ row }">
          <el-checkbox
            :model-value="isChecked(getRowKey(row))"
            :indeterminate="isHalfChecked(getRowKey(row))"
            @change="toggleRowSelection(getRowKey(row), $event as boolean)"
          >
          </el-checkbox>
        </template>
      </el-table-column>

      <!-- 数据列 -->
      <el-table-column
        v-for="column in visibleColumns"
        :key="column.prop"
        :type="column.type"
        :header-align="column.headerAlign"
        :label-class-name="column.labelClassName"
        :class-name="column.className"
        :resizable="column.resizable"
        :formatter="column.formatter"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :min-width="column.minWidth"
        :fixed="column.fixed"
        :align="column.align"
        :show-overflow-tooltip="column.showOverflowTooltip"
        :sortable="column.sortable"
        :sort-method="column.sortMethod"
        :filters="column.filters"
        :filter-multiple="column.filterMultiple"
        :filter-method="column.filterMethod"
      >
        <template v-if="column.slot && $slots[column.slot]" #default="{ row }">
          <!-- 插槽自定义渲染 -->
          <slot
            :name="column.slot"
            :row="row"
          />
        </template>

        <template v-if="column.headerSlot && $slots[column.headerSlot]" #header>
          <slot :name="column.headerSlot" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div v-if="pagination" class="mt-4 flex justify-end">
      <PageComponent @update="handlePageChange" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.pro-table {
  .pro-table-pagination {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
