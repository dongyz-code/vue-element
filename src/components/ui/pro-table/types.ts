import type { PageData } from '../pagination/types';

export type ProTableColumn<T = any> = {
  /** 列的唯一标识 */
  prop: string;
  /** 列标题 */
  label: string;
  /** 列宽度 */
  width?: string | number;
  /** 列最小宽度 */
  minWidth?: string | number;
  /** 是否固定列 */
  fixed?: boolean | 'left' | 'right';
  /** 是否可排序 */
  sortable?: boolean;
  /** 是否可筛选 */
  filterable?: boolean;
  /** 筛选选项 */
  filterOptions?: Array<{ label: string; value: any }>;
  /** 列对齐方式 */
  align?: 'left' | 'center' | 'right';
  /** 是否显示 */
  show?: boolean;
  /** 自定义渲染函数 */
  render?: (row: T, column: ProTableColumn<T>, index: number) => any;
  /** 插槽名称 */
  slot?: string;
  /** 子列配置 */
  children?: ProTableColumn<T>[];
  /** 是否隐藏 */
  hidden?: boolean;
};

export type ProTableProps<T = any> = {
  /** 表格数据 */
  data: T[];
  /** 列配置 */
  columns: ProTableColumn<T>[];
  /** 是否显示选择列 */
  selection?: {
    type: 'single' | 'multiple';
    fixed?: boolean;
  };
  /** 选择模式：single-单选，multiple-多选，crossPage-跨页多选 */
  selectionMode?: 'single' | 'multiple' | 'crossPage';
  /** 已选择的行数据 */
  selectedRows?: T[];
  /** 行唯一标识字段 */
  rowKey?: string;
  /** 是否显示分页 */
  pagination?: PageData;
  /** 是否显示排序 */
  sortable?: boolean;
  /** 是否显示筛选 */
  filterable?: boolean;
  /** 加载状态 */
  loading?: boolean;
  /** 表格高度 */
  height?: string | number;
  /** 最大高度 */
  maxHeight?: string | number;
  /** 是否显示边框 */
  border?: boolean;
  /** 是否显示斑马纹 */
  stripe?: boolean;
  /** 是否显示表头 */
  showHeader?: boolean;
  /** 空数据文本 */
  emptyText?: string;
};

export type ProTableEmits<T = any> = {
  /** 选择变化事件 */
  selectionChange: [selectedRows: T[]];
  /** 分页变化事件 */
  pageChange: [page: number, pageSize: number];
  /** 排序变化事件 */
  sortChange: [sort: { prop: string; order: 'asc' | 'desc' | null }];
  /** 筛选变化事件 */
  filterChange: [filters: Record<string, any[]>];
  /** 行点击事件 */
  rowClick: [row: T, column: ProTableColumn<T>, event: Event];
  /** 行双击事件 */
  rowDblclick: [row: T, column: ProTableColumn<T>, event: Event];
};

export type ProTableExpose<T = any> = {
  /** 获取已选择的行 */
  getSelectedRows: () => T[];
  /** 获取已选择的行 keys */
  getSelectedRowKeys: () => (string | number)[];
  /** 清空选择 */
  clearSelection: () => void;
  /** 切换行选择状态 */
  toggleRowSelection: (row: T, selected?: boolean) => void;
  /** 全选/取消全选 */
  toggleAllSelection: () => void;
  /** 根据 key 设置行选择状态 */
  setRowSelectionByKey: (key: string | number, selected: boolean) => void;
  /** 根据 keys 批量设置选择状态 */
  setRowSelectionsByKeys: (keys: (string | number)[]) => void;
  /** 刷新表格 */
  refresh: () => void;
};
