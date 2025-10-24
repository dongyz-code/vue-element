import type { ElTable } from 'element-plus';
import type { EmitFn, Ref } from 'vue';
import type { DefaultRow, ProTableColumn, ProTableEmits, ProTableProps } from '../types';

import { get } from 'lodash-es';
import { computed, nextTick, ref, toRef, useAttrs, watch } from 'vue';
import { usePage } from '../../pagination';
import { useTreeSelection } from './useTableSelection';

export type UseProTableOptions<T extends DefaultRow = DefaultRow> = {
  props: ProTableProps<T>;
  emit: EmitFn<ProTableEmits<T>>;
  selectionKeys: Ref<string[]>;
};

/**
 * 表格逻辑
 */
export function useProTable<T extends DefaultRow = DefaultRow>({
  props,
  emit,
  selectionKeys: externalSelectionKeys,
}: UseProTableOptions<T>) {
  const attrs = useAttrs();
  // 响应式数据
  const tableRef = ref<InstanceType<typeof ElTable>>();

  const hasExternalSelection = computed(() => !!attrs.selection);

  const {
    headerChecked,
    selectionKeys,
    halfCheckedSet,
    toggleRowSelection,
    clearSelection,
    setSelection,
    isChecked,
    isHalfChecked,
    toggleAllSelection,
  } = useTreeSelection({
    data: toRef(props, 'data'),
    option: {
      type: props.selection?.type ?? 'checkbox',
      checkStrictly: props.selection?.checkStrictly ?? false,
      rowKey: getRowKey,
      selectionKeys: hasExternalSelection ? externalSelectionKeys : undefined,
      defaultSelectionKeys: props.selection?.defaultSelectionKeys ?? [],
    },
  });

  const { pageData, PageComponent } = usePage();
  const sortInfo = ref<{ prop: string; order: 'asc' | 'desc' | null }>({
    prop: '',
    order: null,
  });
  const filterInfo = ref<Record<string, any[]>>({});

  /** 需要显示的列 */
  const visibleColumns = computed(() => {
    return props.columns.filter(column => column.hidden !== true);
  });

  /** 表格数据 */
  const tableData = computed(() => {
    return props.data;
  });

  /** 获取行的唯一标识 */
  function getRowKey(row: T): string {
    if (!props.rowKey) {
      console.error('rowKey is required');
    }

    if (typeof props.rowKey === 'function') {
      return props.rowKey(row);
    }
    return row[props.rowKey as keyof T];
  }

  /** 获取值 */
  function getValue(row: T, prop: string) {
    return get(row, prop);
  }

  /** 获取索引 */
  function getIndex(index: number) {
    return (pageData.value.current - 1) * pageData.value.size + index + 1;
  }

  /** 判断行是否可选择 */
  function getSelectable(row: T) {
    if ('disabled' in row) {
      return !row.disabled;
    }
    return true;
  }

  /**
   * 筛选变化事件
   */
  function handleFilterChange(filters: Record<string, any[]>) {
    filterInfo.value = filters;
    emit('filterChange', filters);
  }

  /**
   * 行点击事件
   */
  function handleRowClick(row: T, column: ProTableColumn<T>, event: Event) {
    emit('rowClick', row, column, event);
  }

  /**
   * 行双击事件
   */
  function handleRowDblclick(row: T, column: ProTableColumn<T>, event: Event) {
    emit('rowDblclick', row, column, event);
  }

  /**
   * 分页
   */
  function handlePageChange(current: number, size: number) {
    emit('pageChange', current, size);
  }

  function setPageData(params: Partial<NonNullable<ProTableProps['pagination']>>) {
    pageData.value = {
      ...pageData.value,
      ...params,
    };
  }

  /**
   * 刷新方法
   */
  function refresh() {
    nextTick(() => {
      tableRef.value?.doLayout();
    });
  }

  /**
   * 监听分页配置变化
   */
  watch(() => props.pagination, (newVal) => {
    if (newVal) {
      pageData.value = newVal;
    }
  }, { deep: true });

  return {

    tableRef,
    sortInfo,
    filterInfo,
    pageData,

    visibleColumns,
    tableData,

    getRowKey,
    getValue,
    getIndex,
    getSelectable,
    setPageData,
    handleFilterChange,
    handleRowClick,
    handleRowDblclick,
    handlePageChange,
    refresh,

    /** 选择相关 */
    headerChecked,
    selectionKeys,
    halfCheckedSet,
    toggleRowSelection,
    clearSelection,
    setSelection,
    isChecked,
    isHalfChecked,
    toggleAllSelection,

    // 组件
    PageComponent,
  };
}
