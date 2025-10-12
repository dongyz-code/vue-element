<script setup lang="ts" generic="T extends Record<string, any> = any">
import type { ProTableEmits, ProTableExpose, ProTableProps } from './types';
import { useProTable } from './hooks/useProTable';

const props = withDefaults(defineProps<ProTableProps>(), {
  selection: false,
  selectionMode: 'multiple',
  selectedRows: () => [],
  pagination: true,
  pageConfig: () => ({
    currentPage: 1,
    pageSize: 10,
    total: 0,
    pageSizes: [10, 20, 50, 100],
    layout: 'total, sizes, prev, pager, next, jumper',
  }),
  sortable: true,
  filterable: true,
  loading: false,
  border: true,
  stripe: false,
  showHeader: true,
  emptyText: '暂无数据',
});

// Emits 定义
const emit = defineEmits<ProTableEmits<T>>();

// 使用 composables
const {
  tableRef,
  selectedRowKeys,
  selectedRows,
  currentPage,
  currentPageSize,
  sortInfo,
  filterInfo,
  visibleColumns,
  tableData,
  total,
  pageSizes,
  paginationLayout,
  getRowKey,
  getValue,
  getIndex,
  getSelectable,
  getFilterMethod,
  handleSelectionChange,
  clearSelection,
  toggleRowSelection,
  toggleAllSelection,
  setRowSelectionByKey,
  setRowSelectionsByKeys,
  handleSizeChange,
  handleCurrentChange,
  handleSortChange,
  handleFilterChange,
  handleRowClick,
  handleRowDblclick,
  refresh,
  getSelectedRows,
  getSelectedRowKeys,
} = useProTable({ props, emit });

// 暴露方法
defineExpose<ProTableExpose<T>>({
  getSelectedRows,
  clearSelection,
  toggleRowSelection,
  toggleAllSelection,
  refresh,
  // 新增方法
  getSelectedRowKeys,
  setRowSelectionByKey,
  setRowSelectionsByKeys,
});
</script>

<template>
  <div class="pro-table">
    <!-- 表格主体 -->
    <el-table
      ref="tableRef"
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
      <!-- 选择列 -->
      <el-table-column
        v-if="selection"
        width="55"
        :selectable="getSelectable"
        :reserve-selection="selectionMode === 'crossPage'"
      />

      <!-- 数据列 -->
      <el-table-column
        v-for="column in visibleColumns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :min-width="column.minWidth"
        :fixed="column.fixed"
        :align="column.align"
        :sortable="column.sortable && sortable ? 'custom' : false"
        :filters="column.filterable && filterable ? column.filterOptions?.map(item => ({ text: item.label, value: item.value })) : undefined"
        :filter-method="column.filterable && filterable ? getFilterMethod(column) : undefined"
      >
        <template #default="{ row, $index }">
          <!-- 插槽自定义渲染 -->
          <slot
            v-if="column.slot"
            :name="column.slot"
            :row="row"
            :column="column"
            :index="$index"
            :value="getValue(row, column.prop)"
          />
          <!-- 自定义渲染函数 -->
          <template v-else-if="column.render">
            <component :is="column.render(row, column, $index)" />
          </template>
          <!-- 默认渲染 -->
          <template v-else>
            {{ getValue(row, column.prop) }}
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-if="pagination"
      v-model:current-page="currentPage"
      v-model:page-size="currentPageSize"
      :page-sizes="pageSizes"
      :total="total"
      :layout="paginationLayout"
      class="pro-table-pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
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
