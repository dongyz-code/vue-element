import type { ButtonType } from 'element-plus';

/**
 * Dialog 组件的 Props 接口
 */
export type DialogProps = {
  /** 对话框标题 */
  title?: string;
  /** 对话框宽度 */
  width?: string | number;
  /** 对话框距离顶部的位置 */
  top?: string;
  /** 是否显示遮罩层 */
  modal?: boolean;
  /** 是否锁定滚动 */
  lockScroll?: boolean;
  /** 是否可以通过点击 modal 关闭 Dialog */
  closeOnClickModal?: boolean;
  /** 是否可以通过按下 ESC 关闭 Dialog */
  closeOnPressEscape?: boolean;
  /** 是否显示关闭按钮 */
  showClose?: boolean;
  /** 关闭前的回调，会暂停 Dialog 的关闭 */
  beforeClose?: (done: () => void) => void;
  /** 是否对头部和底部采用居中布局 */
  center?: boolean;
  /** 是否水平垂直居中对话框 */
  alignCenter?: boolean;
  /** 当关闭 Dialog 时，销毁其中的元素 */
  destroyOnClose?: boolean;
  /** 是否可拖拽 */
  draggable?: boolean;
  /** Dialog 自身是否插入至 body 元素上 */
  appendToBody?: boolean;
  /** 设置 z-index */
  zIndex?: number;
  /** 确认按钮文本 */
  confirmText?: string;
  /** 取消按钮文本 */
  cancelText?: string;
  /** 是否显示确认按钮 */
  showConfirmButton?: boolean;
  /** 是否显示取消按钮 */
  showCancelButton?: boolean;
  /** 确认按钮类型 */
  confirmButtonType?: ButtonType;
  /** 取消按钮类型 */
  cancelButtonType?: ButtonType;
  /** 是否显示加载状态 */
  loading?: boolean;
  /** 确认按钮加载状态 */
  confirmLoading?: boolean;
};

/**
 * Dialog 组件的事件类型
 */
export type DialogEmits = {
  /** 更新 v-model 值 */
  'update:modelValue': (value: boolean) => void;
  /** 打开时触发 */
  'open': () => void;
  /** 打开动画结束时触发 */
  'opened': () => void;
  /** 关闭时触发 */
  'close': () => void;
  /** 关闭动画结束时触发 */
  'closed': () => void;
  /** 点击确认按钮时触发 */
  'confirm': () => void;
  /** 点击取消按钮时触发 */
  'cancel': () => void;
  /** 关闭前的回调 */
  'before-close': (done: () => void) => void;
};

/**
 * Dialog 组件的实例方法
 */
export type DialogInstance = {
  /** 打开对话框 */
  open: () => void;
  /** 关闭对话框 */
  close: () => void;
  /** 是否可见 */
  visible: boolean;
};

/**
 * Dialog 组件的插槽类型
 */
export type DialogSlots = {
  /** 默认插槽 - 内容区域 */
  default?: () => any;
  /** 头部插槽 */
  header?: () => any;
  /** 底部插槽 */
  footer?: () => any;
};
