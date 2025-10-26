import type { FieldRenderConfig, FieldRenderContext } from './types';

import { ElInput, ElInputNumber } from 'element-plus';

import 'element-plus/es/components/input/style/css';
import 'element-plus/es/components/input-number/style/css';

export function renderInput(ctx: FieldRenderContext): FieldRenderConfig {
  return {
    component: ElInput,
    props: {
      'modelValue': ctx.value,
      'onUpdate:modelValue': ctx.onChange,
      'placeholder': ctx.placeholder,
      'disabled': ctx.disabled,
      ...ctx,
    },
  };
}

export function renderTextarea(ctx: FieldRenderContext): FieldRenderConfig {
  return {
    component: ElInput,
    props: {
      'modelValue': ctx.value,
      'onUpdate:modelValue': ctx.onChange,
      'placeholder': ctx.placeholder,
      'disabled': ctx.disabled,
      'type': 'textarea',
      ...ctx,
    },
  };
}

export function renderInputNumber(ctx: FieldRenderContext): FieldRenderConfig {
  return {
    component: ElInputNumber,
    props: {
      'modelValue': ctx.value,
      'onUpdate:modelValue': ctx.onChange,
      'placeholder': ctx.placeholder,
      'disabled': ctx.disabled,
      ...ctx,
    },
  };
}
