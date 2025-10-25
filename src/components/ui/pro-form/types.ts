import type { FormItemRule, FormRules } from 'element-plus';

export type ProFormFieldType
  = | 'input'
    | 'textarea'
    | 'input-number'
    | 'select'
    | 'cascader'
    | 'date'
    | 'daterange'
    | 'time'
    | 'timeselect'
    | 'switch'
    | 'checkbox'
    | 'radio'
    | 'rate'
    | 'color'
    | 'slider'
    | 'transfer'
    | 'upload'
    | 'autocomplete';

export interface ProFormOption {
  label: string;
  value: any;
  disabled?: boolean;
  children?: ProFormOption[];
  [key: string]: any;
}

export interface ProFormField {
  /** 字段唯一标识 */
  key: string;
  /** 字段标签 */
  label: string;
  /** 字段类型 */
  type: ProFormFieldType;
  /** 占位符 */
  placeholder?: string;
  /** 列跨度 (1-4) */
  colSpan?: number;
  /** 控件配置 */
  options?: Record<string, any>;
  /** 选项数据 (用于 select、checkbox、radio 等) */
  choices?: ProFormOption[];
  /** 字段级校验规则 */
  rules?: FormItemRule[];
  /** 是否显示 (支持函数动态控制) */
  visible?: boolean | ((ctx: { model: Record<string, any> }) => boolean);
  /** 插槽名称 (true 表示使用 #field-[key]) */
  slot?: string | boolean;
  /** 默认值 */
  defaultValue?: any;
}

export interface ProFormProps {
  /** 表单数据 (v-model) */
  modelValue: Record<string, any>;
  /** 字段配置数组 */
  options: ProFormField[];
  /** 表单校验规则 */
  rules?: FormRules;
  /** 标签宽度 */
  labelWidth?: string | number;
  /** 折叠展示的行数 */
  collapseToRows?: number;
  /** 默认是否折叠 */
  defaultCollapsed?: boolean;
  /** 是否显示折叠按钮 */
  showCollapse?: boolean;
  /** 提交按钮文本 */
  submitText?: string;
  /** 重置按钮文本 */
  resetText?: string;
  /** 透传给 el-form 的额外属性 */
  formProps?: Record<string, any>;
}

export interface ProFormEmits {
  'update:modelValue': [value: Record<string, any>];
  'submit': [values: Record<string, any>];
  'reset': [];
  'change': [key: string, value: any, model: Record<string, any>];
  'toggle': [collapsed: boolean];
}

export interface ProFormExpose {
  /** 表单校验 */
  validate: () => Promise<void>;
  /** 清除校验 */
  clearValidate: () => void;
  /** 重置表单 */
  resetFields: () => void;
}
