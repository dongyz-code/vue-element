import type { ProFormOption } from '../types';
import type { FieldRenderConfig, FieldRenderContext } from './types';

import {
  ElCascader,
  ElCheckbox,
  ElCheckboxGroup,
  ElOption,
  ElRadio,
  ElRadioGroup,
  ElSelect,
  ElTransfer,
} from 'element-plus';
import { h } from 'vue';

import 'element-plus/es/components/select/style/css';
import 'element-plus/es/components/cascader/style/css';
import 'element-plus/es/components/checkbox/style/css';
import 'element-plus/es/components/checkbox-group/style/css';
import 'element-plus/es/components/radio/style/css';
import 'element-plus/es/components/radio-group/style/css';
import 'element-plus/es/components/transfer/style/css';

export type OptionsRenderContext = FieldRenderContext & {
  options: ProFormOption[];
  loading?: boolean;
};

export function renderSelect(ctx: OptionsRenderContext): FieldRenderConfig {
  return {
    component: ElSelect,
    props: {
      'modelValue': ctx.value,
      'onUpdate:modelValue': ctx.onChange,
      'placeholder': ctx.placeholder,
      'disabled': ctx.disabled,
      'loading': ctx.loading,
      ...ctx,
    },
    children: ctx.options.map(option =>
      h(ElOption, {
        key: option.value,
        label: option.label,
        value: option.value,
        disabled: option.disabled,
      }),
    ),
  };
}

export function renderCascader(ctx: OptionsRenderContext): FieldRenderConfig {
  const { value, onChange, placeholder, disabled, options, loading, ...rest } = ctx;
  return {
    component: ElCascader,
    props: {
      'modelValue': value,
      'onUpdate:modelValue': onChange,
      placeholder,
      disabled,
      options,
      ...rest,
    },
  };
}

export function renderCheckbox(ctx: OptionsRenderContext): FieldRenderConfig {
  return {
    component: ElCheckboxGroup,
    props: {
      'modelValue': ctx.value,
      'onUpdate:modelValue': ctx.onChange,
      'disabled': ctx.disabled,
      ...ctx,
    },
    children: ctx.options.map(option =>
      h(ElCheckbox, {
        key: option.value,
        value: option.value,
        disabled: option.disabled,
      }, { default: () => option.label }),
    ),
  };
}

export function renderRadio(ctx: OptionsRenderContext): FieldRenderConfig {
  return {
    component: ElRadioGroup,
    props: {
      'modelValue': ctx.value,
      'onUpdate:modelValue': ctx.onChange,
      'disabled': ctx.disabled,
      ...ctx,
    },
    children: ctx.options.map(option =>
      h(ElRadio, {
        key: option.value,
        value: option.value,
        disabled: option.disabled,
      }, { default: () => option.label }),
    ),
  };
}

export function renderTransfer(ctx: OptionsRenderContext): FieldRenderConfig {
  return {
    component: ElTransfer,
    props: {
      'modelValue': ctx.value,
      'onUpdate:modelValue': ctx.onChange,
      'disabled': ctx.disabled,
      'data': ctx.options,
      'props': { key: 'value', label: 'label', disabled: 'disabled' },
      ...ctx,
    },
  };
}
