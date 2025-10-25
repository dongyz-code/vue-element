import type { TableColumnCtx } from 'element-plus';
import type { VNode } from 'vue';
import type { PageData } from '../pagination/types';
import type { Key } from '@/types';

export type DefaultRow = {
  [key: number]: any;
  [key: symbol]: any;
  [key: string]: any;
};

export type ProTableColumn<T extends DefaultRow = DefaultRow> = {
  type?: 'default' | 'index' | 'expand';
  /** 列的唯一标识 */
  prop?: string;
  /** 列标题 */
  label?: string;
  /** 列宽度 */
  width?: string | number;
  /** 列最小宽度 */
  minWidth?: string | number;
  /** 是否固定列 */
  fixed?: boolean | 'left' | 'right';
  /** 是否可排序 */
  sortable?: boolean;
  /** 自定义排序方法 */
  sortMethod?: (a: T, b: T) => number;
  /** 筛选选项 */
  filters?: Array<{ text: string; value: any }>;
  /** 是否多选 */
  filterMultiple?: boolean;
  /** 自定义筛选方法 */
  filterMethod?: (value: any, row: T, column: TableColumnCtx<T>) => void;
  /** 列对齐方式 */
  align?: 'left' | 'center' | 'right';
  /** 表头对齐方式 */
  headerAlign?: 'left' | 'center' | 'right';
  /** 当前列标题的自定义类名 */
  labelClassName?: string;
  /** 列的 className */
  className?: string;
  /** 是否可调整列宽 */
  resizable?: boolean;
  /** 自定义格式化函数 */
  formatter?: (row: T, column: TableColumnCtx<T>, cellValue: any, index: number) => VNode | string;
  /** 插槽名称 */
  slot?: string;
  /** 表头插槽名称 */
  headerSlot?: string;
  /** 提示 */
  tooltip?: string;
  /** 子列配置 */
  children?: ProTableColumn<T>[];
  /** 是否隐藏 */
  hidden?: boolean;
  /** 是否显示溢出提示 */
  showOverflowTooltip?: boolean;

};

export type ProTableProps<T extends DefaultRow = DefaultRow> = {
  /** 表格数据 */
  data: T[];
  /** 列配置 */
  columns: ProTableColumn<T>[];
  /** 是否显示选择列 */
  selectionConfig?: {
    /** 默认选择项 */
    defaultSelectionKeys?: string[];
    /** 选择模式 */
    type?: 'checkbox' | 'radio';
    /** 是否严格模式 */
    checkStrictly?: boolean;
    /** 是否固定选择列 */
    fixed?: boolean;
    /** 是否可被选择 */
    selectable?: (row: T, index: number) => boolean;
  };
  /** 表格尺寸 */
  size?: 'large' | 'default' | 'small';
  /** 列的宽度是否自撑开 */
  fit?: boolean;
  /** 行唯一标识字段 */
  rowKey?: string | ((row: T) => Key);
  /** 是否显示分页 */
  pagination?: Partial<PageData>;
  /** 加载状态 */
  loading?: boolean;
  /** 表格高度 设置高度可实现固定表头 */
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
  /** 是否默认展开所有行 */
  defaultExpandAll?: boolean;
  /** 展开的行 keys */
  expandRowKeys?: (string)[];
};

export type ProTableEmits<T extends DefaultRow = DefaultRow> = {
  /** 选择变化事件 */
  onSelect: [selectedRows: T[]];
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

export type ProTableExpose<T extends DefaultRow = DefaultRow> = {
  /** 清空选择 */
  clearSelection: () => void;
  /** 刷新表格 */
  refresh: () => void;
  /** 设置表格数据 */
  setPageData: (pageDate: PageData) => void;
};
