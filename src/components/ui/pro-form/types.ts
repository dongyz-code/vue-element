import type {
  AutocompleteProps,
  CascaderProps,
  CheckboxGroupProps,
  ColorPickerProps,
  DatePickerProps,
  FormItemRule,
  FormRules,
  InputNumberProps,
  InputProps,
  RadioGroupProps,
  RateProps,
  SelectProps,
  SliderProps,
  SwitchProps,
  TimePickerDefaultProps,
  TimeSelectProps,
  TransferProps,
  UploadProps,
} from 'element-plus';

export interface ProFormOption {
  label: string;
  value: any;
  disabled?: boolean;
  children?: ProFormOption[];
  [key: string]: any;
}

interface ProFormFieldBase {
  key: string;
  label: string;
  placeholder?: string;
  colSpan?: number;
  choices?: ProFormOption[];
  rules?: FormItemRule[];
  visible?: boolean | ((ctx: { model: Record<string, any> }) => boolean);
  slot?: string | boolean;
  defaultValue?: any;
}

export type InputField = ProFormFieldBase & {
  type: 'input';
  props?: Partial<InputProps>;
};

export type TextareaField = ProFormFieldBase & {
  type: 'textarea';
  props?: Partial<InputProps>;
};

export type InputNumberField = ProFormFieldBase & {
  type: 'input-number';
  props?: Partial<InputNumberProps>;
};

export type SelectField = ProFormFieldBase & {
  type: 'select';
  props?: Partial<SelectProps>;
};

export type CascaderField = ProFormFieldBase & {
  type: 'cascader';
  props?: Partial<CascaderProps>;
};

export type DateField = ProFormFieldBase & {
  type: 'date';
  props?: Partial<DatePickerProps>;
};

export type DateRangeField = ProFormFieldBase & {
  type: 'daterange';
  props?: Partial<DatePickerProps>;
};

export type TimeField = ProFormFieldBase & {
  type: 'time';
  props?: Partial<TimePickerDefaultProps>;
};

export type TimeSelectField = ProFormFieldBase & {
  type: 'timeselect';
  props?: Partial<TimeSelectProps>;
};

export type SwitchField = ProFormFieldBase & {
  type: 'switch';
  props?: Partial<SwitchProps>;
};

export type CheckboxField = ProFormFieldBase & {
  type: 'checkbox';
  props?: Partial<CheckboxGroupProps>;
};

export type RadioField = ProFormFieldBase & {
  type: 'radio';
  props?: Partial<RadioGroupProps>;
};

export type RateField = ProFormFieldBase & {
  type: 'rate';
  props?: Partial<RateProps>;
};

export type ColorField = ProFormFieldBase & {
  type: 'color';
  props?: Partial<ColorPickerProps>;
};

export type SliderField = ProFormFieldBase & {
  type: 'slider';
  props?: Partial<SliderProps>;
};

export type TransferField = ProFormFieldBase & {
  type: 'transfer';
  props?: Partial<TransferProps>;
};

export type UploadField = ProFormFieldBase & {
  type: 'upload';
  props?: Partial<UploadProps>;
};

export type AutocompleteField = ProFormFieldBase & {
  type: 'autocomplete';
  props?: Partial<AutocompleteProps>;
};

export type ProFormField = InputField | TextareaField | InputNumberField | SelectField | CascaderField | DateField | DateRangeField | TimeField | TimeSelectField | SwitchField | CheckboxField | RadioField | RateField | ColorField | SliderField | TransferField | UploadField | AutocompleteField;

export interface ProFormProps {
  modelValue: Record<string, any>;
  options: ProFormField[];
  rules?: FormRules;
  labelWidth?: string | number;
  collapseToRows?: number;
  defaultCollapsed?: boolean;
  showCollapse?: boolean;
  submitText?: string;
  resetText?: string;
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
  validate: () => Promise<void>;
  clearValidate: () => void;
  resetFields: () => void;
}
