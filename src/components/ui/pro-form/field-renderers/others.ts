import type { FieldRenderConfig, FieldRenderContext } from './types';

import {
  ElAutocomplete,
  ElButton,
  ElColorPicker,
  ElDatePicker,
  ElRate,
  ElSlider,
  ElSwitch,
  ElTimePicker,
  ElTimeSelect,
  ElUpload,
} from 'element-plus';
import { h } from 'vue';

import 'element-plus/es/components/date-picker/style/css';
import 'element-plus/es/components/time-picker/style/css';
import 'element-plus/es/components/time-select/style/css';
import 'element-plus/es/components/switch/style/css';
import 'element-plus/es/components/rate/style/css';
import 'element-plus/es/components/color-picker/style/css';
import 'element-plus/es/components/slider/style/css';
import 'element-plus/es/components/upload/style/css';
import 'element-plus/es/components/autocomplete/style/css';
import 'element-plus/es/components/button/style/css';

export function renderDate(ctx: FieldRenderContext): FieldRenderConfig {
  return {
    component: ElDatePicker,
    props: {
      'modelValue': ctx.value,
      'onUpdate:modelValue': ctx.onChange,
      'placeholder': ctx.placeholder,
      'disabled': ctx.disabled,
      ...ctx,
    },
  };
}

export function renderDateRange(ctx: FieldRenderContext): FieldRenderConfig {
  return {
    component: ElDatePicker,
    props: {
      'modelValue': ctx.value,
      'onUpdate:modelValue': ctx.onChange,
      'placeholder': ctx.placeholder,
      'disabled': ctx.disabled,
      'type': 'daterange',
      ...ctx,
    },
  };
}

export function renderTime(ctx: FieldRenderContext): FieldRenderConfig {
  return {
    component: ElTimePicker,
    props: {
      'modelValue': ctx.value,
      'onUpdate:modelValue': ctx.onChange,
      'placeholder': ctx.placeholder,
      'disabled': ctx.disabled,
      ...ctx,
    },
  };
}

export function renderTimeSelect(ctx: FieldRenderContext): FieldRenderConfig {
  return {
    component: ElTimeSelect,
    props: {
      'modelValue': ctx.value,
      'onUpdate:modelValue': ctx.onChange,
      'placeholder': ctx.placeholder,
      'disabled': ctx.disabled,
      ...ctx,
    },
  };
}

export function renderSwitch(ctx: FieldRenderContext): FieldRenderConfig {
  return {
    component: ElSwitch,
    props: {
      'modelValue': ctx.value,
      'onUpdate:modelValue': ctx.onChange,
      'disabled': ctx.disabled,
      ...ctx,
    },
  };
}

export function renderRate(ctx: FieldRenderContext): FieldRenderConfig {
  return {
    component: ElRate,
    props: {
      'modelValue': ctx.value,
      'onUpdate:modelValue': ctx.onChange,
      'disabled': ctx.disabled,
      ...ctx,
    },
  };
}

export function renderColor(ctx: FieldRenderContext): FieldRenderConfig {
  return {
    component: ElColorPicker,
    props: {
      'modelValue': ctx.value,
      'onUpdate:modelValue': ctx.onChange,
      'disabled': ctx.disabled,
      ...ctx,
    },
  };
}

export function renderSlider(ctx: FieldRenderContext): FieldRenderConfig {
  return {
    component: ElSlider,
    props: {
      'modelValue': ctx.value,
      'onUpdate:modelValue': ctx.onChange,
      'disabled': ctx.disabled,
      ...ctx,
    },
  };
}

export function renderUpload(ctx: FieldRenderContext): FieldRenderConfig {
  return {
    component: ElUpload,
    props: {
      'fileList': ctx.value,
      'onUpdate:fileList': ctx.onChange,
      'disabled': ctx.disabled,
      ...ctx,
    },
    children: h(ElButton, { type: 'primary' }, { default: () => ctx.placeholder || '点击上传' }),
  };
}

export function renderAutocomplete(ctx: FieldRenderContext): FieldRenderConfig {
  return {
    component: ElAutocomplete,
    props: {
      'modelValue': ctx.value,
      'onUpdate:modelValue': ctx.onChange,
      'placeholder': ctx.placeholder,
      'disabled': ctx.disabled,
      ...ctx,
    },
  };
}
