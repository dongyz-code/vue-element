import type { ElTable } from 'element-plus';
import type { ProTableColumn, ProTableEmits, ProTableProps } from '../types';
import { computed, nextTick, ref, watch } from 'vue';
import { usePage } from '../../pagination';
import { useTableSelection } from './useTableSelection';

export type UseProTableOptions<T = any> = {
  props: ProTableProps<T>;
  emit: ProTableEmits<T>;
};

/**
 * 表格逻辑
 */
export function useProTable<T extends Record<string, any> = any>({
  props,
  emit,
}: UseProTableOptions<T>) {
  // 响应式数据
  const tableRef = ref<InstanceType<typeof ElTable>>();
  const { pageData, PageComponent } = usePage();
  const sortInfo = ref<{ prop: string; order: 'asc' | 'desc' | null }>({
    prop: '',
    order: null,
  });
  const filterInfo = ref<Record<string, any[]>>({});

  // 计算属性
  const visibleColumns = computed(() => {
    return props.columns.filter(column => column.show !== false);
  });

  const tableData = computed(() => {
    return props.data;
  });

  const total = computed(() => {
    return props.pageConfig?.total || 0;
  });

  const pageSizes = computed(() => {
    return props.pageConfig?.pageSizes || [10, 20, 50, 100];
  });

  const paginationLayout = computed(() => {
    return props.pageConfig?.layout || 'total, sizes, prev, pager, next, jumper';
  });

  // 获取行的唯一标识
  function getRowKey(row: T): string | number {
    return row[props.rowKey as keyof T] || row;
  }

  // 获取值
  function getValue(row: T, prop: string) {
    return prop.split('.').reduce((obj, key) => obj?.[key], row);
  }

  // 获取索引
  function getIndex(index: number) {
    return (currentPage.value - 1) * currentPageSize.value + index + 1;
  }

  // 判断行是否可选择
  function getSelectable(_row: T) {
    return true;
  }

  // 获取筛选方法
  function getFilterMethod(column: ProTableColumn<T>) {
    return (value: any, row: T) => {
      const cellValue = getValue(row, column.prop);
      return cellValue === value;
    };
  }

  // 选择相关方法
  function handleSelectionChange(selection: T[]) {
    if (props.selectionMode === 'single') {
      // 单选模式：只保留最后一个选择
      selectedRows.value = selection.slice(-1);
      selectedRowKeys.value = selectedRows.value.map(row => getRowKey(row));
    }
    else if (props.selectionMode === 'crossPage') {
      // 跨页多选：合并当前页选择和之前页面的选择
      const currentPageKeys = selection.map(row => getRowKey(row));
      const otherPagesSelection = selectedRows.value.filter(row =>
        !currentPageKeys.includes(getRowKey(row)),
      );
      selectedRows.value = [...otherPagesSelection, ...selection];
      selectedRowKeys.value = selectedRows.value.map(row => getRowKey(row));
    }
    else {
      // 普通多选
      selectedRows.value = [...selection];
      selectedRowKeys.value = selectedRows.value.map(row => getRowKey(row));
    }

    emit('selectionChange', selectedRows.value);
  }

  // 清空选择
  function clearSelection() {
    tableRef.value?.clearSelection();
    selectedRows.value = [];
    selectedRowKeys.value = [];
    emit('selectionChange', []);
  }

  // 切换行选择状态
  function toggleRowSelection(row: T, selected?: boolean) {
    tableRef.value?.toggleRowSelection(row, selected);
  }

  // 全选/取消全选
  function toggleAllSelection() {
    tableRef.value?.toggleAllSelection();
  }

  // 根据 key 设置行选择状态
  function setRowSelectionByKey(key: string | number, selected: boolean) {
    const row = props.data.find(item => getRowKey(item) === key);
    if (row) {
      toggleRowSelection(row, selected);
    }
  }

  // 根据 keys 批量设置选择状态
  function setRowSelectionsByKeys(keys: (string | number)[]) {
    // 先清空所有选择
    clearSelection();
    // 然后设置新的选择
    keys.forEach((key) => {
      setRowSelectionByKey(key, true);
    });
  }

  // 分页相关方法
  function handleSizeChange(size: number) {
    currentPageSize.value = size;
    currentPage.value = 1;
    emit('pageChange', currentPage.value, currentPageSize.value);
  }

  function handleCurrentChange(page: number) {
    currentPage.value = page;
    emit('pageChange', currentPage.value, currentPageSize.value);
  }

  // 排序相关方法
  function handleSortChange({ prop, order }: { prop: string; order: string | null }) {
    sortInfo.value = {
      prop,
      order: order as 'asc' | 'desc' | null,
    };
    emit('sortChange', sortInfo.value);
  }

  // 筛选相关方法
  function handleFilterChange(filters: Record<string, any[]>) {
    filterInfo.value = filters;
    emit('filterChange', filters);
  }

  // 行事件
  function handleRowClick(row: T, column: ProTableColumn<T>, event: Event) {
    emit('rowClick', row, column, event);
  }

  function handleRowDblclick(row: T, column: ProTableColumn<T>, event: Event) {
    emit('rowDblclick', row, column, event);
  }

  // 刷新方法
  function refresh() {
    nextTick(() => {
      tableRef.value?.doLayout();
    });
  }

  // 获取已选择的行
  function getSelectedRows() {
    return selectedRows.value;
  }

  // 获取已选择的行 keys
  function getSelectedRowKeys() {
    return selectedRowKeys.value;
  }

  // 监听 props 变化，实现选择回显
  watch(() => props.selectedRows, (newVal) => {
    if (newVal && newVal.length > 0) {
      selectedRows.value = [...newVal];
      selectedRowKeys.value = newVal.map(row => getRowKey(row));

      // 延迟设置选择状态，确保表格已渲染
      nextTick(() => {
        newVal.forEach((row) => {
          toggleRowSelection(row, true);
        });
      });
    }
    else {
      selectedRows.value = [];
      selectedRowKeys.value = [];
    }
  }, { deep: true });

  // 监听分页配置变化
  watch(() => props.pageConfig, (newVal) => {
    if (newVal) {
      currentPage.value = newVal.currentPage;
      currentPageSize.value = newVal.pageSize;
    }
  }, { deep: true });

  return {
    // 响应式数据
    tableRef,
    selectedRowKeys,
    selectedRows,
    sortInfo,
    filterInfo,
    pageData,

    // 计算属性
    visibleColumns,
    tableData,
    total,
    pageSizes,
    paginationLayout,

    // 方法
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

    // 组件
    PageComponent,
  };
}
