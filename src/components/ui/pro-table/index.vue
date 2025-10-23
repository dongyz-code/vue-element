<script setup lang="ts" generic="T extends DefaultRow = DefaultRow">
import type { ElTable } from 'element-plus';
import type { DefaultRow, ProTableEmits, ProTableExpose, ProTableProps } from './types';
import { useProTable } from './hooks/useProTable';

const props = withDefaults(defineProps<ProTableProps>(), {
  pageConfig: () => ({
    currentPage: 1,
    pageSize: 10,
    total: 0,
    pageSizes: [10, 20, 50, 100],
    layout: 'total, sizes, prev, pager, next, jumper',
  }),
  sortable: false,
  filterable: false,
  loading: false,
  border: false,
  stripe: false,
  showHeader: true,
  emptyText: '暂无数据',
});

// Emits 定义
const emit = defineEmits<ProTableEmits>();

const selectionKeys = defineModel<string[]>('selection', { default: () => [] });

const {
  tableRef,
  visibleColumns,
  tableData,
  getValue,
  setPageData,
  handleFilterChange,
  handleRowClick,
  handleRowDblclick,
  handlePageChange,
  refresh,

  PageComponent,
} = useProTable({ props, emit });

// 暴露方法
defineExpose<ProTableExpose<T>>({
  refresh,
  setPageData,
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
      :row-key="rowKey"
      :data="tableData"
      :height="height"
      :max-height="maxHeight"
      :border="border"
      :stripe="stripe"
      :show-header="showHeader"
      :empty-text="emptyText"
      :loading="loading"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDblclick"
      @sort-change="handleSortChange"
      @filter-change="handleFilterChange"
    >
      <slot></slot>

      <!-- 数据列 -->
      <el-table-column
        v-for="column in visibleColumns"
        :key="column.prop"
        :type="column.type"
        :selectable="column.selectable"
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
        <template v-if="column.slot && $slots[column.slot]" #default="{ row, $index }">
          <!-- 插槽自定义渲染 -->
          <slot
            :name="column.slot"
            :row="row"
            :column="column"
            :index="$index"
            :value="getValue(row, column.prop!)"
          />
        </template>

        <template v-if="column.headerSlot && $slots[column.headerSlot]" #header>
          <slot :name="column.headerSlot" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <PageComponent @update="handlePageChange" />
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
