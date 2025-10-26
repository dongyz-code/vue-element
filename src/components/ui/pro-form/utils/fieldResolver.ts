import type { Component, VNode } from 'vue';

import type { ProFormField } from '../types';
import {
  ElAutocomplete,
  ElButton,
  ElCascader,
  ElCheckbox,
  ElCheckboxGroup,
  ElColorPicker,
  ElDatePicker,
  ElInput,
  ElInputNumber,
  ElOption,
  ElRadio,
  ElRadioGroup,
  ElRate,
  ElSelect,
  ElSlider,
  ElSwitch,
  ElTimePicker,
  ElTimeSelect,
  ElTransfer,
  ElUpload,
} from 'element-plus';
import { h } from 'vue';
import { normalizeOptions } from './optionsNormalizer';

interface FieldComponentConfig {
  component: Component;
  props: Record<string, any>;
  children?: VNode | VNode[];
}

interface FieldResolverCallbacks {
  onUpdateModelValue: (value: any) => void;
  onChange: (value: any) => void;
}

export function resolveFieldComponent(
  field: ProFormField,
  modelValue: any,
  callbacks: FieldResolverCallbacks,
): FieldComponentConfig {
  const { onUpdateModelValue, onChange } = callbacks;

  const baseProps = {
    modelValue,
    'onUpdate:modelValue': onUpdateModelValue,
    onChange,
    'placeholder': field.placeholder,
    ...field.props,
  };

  const normalizedOptions = normalizeOptions('options' in field ? field.options : undefined);

  switch (field.type) {
    case 'input':
      return {
        component: ElInput,
        props: baseProps,
      };

    case 'textarea':
      return {
        component: ElInput,
        props: {
          ...baseProps,
          type: 'textarea',
        },
      };

    case 'input-number':
      return {
        component: ElInputNumber,
        props: baseProps,
      };

    case 'select':
      return {
        component: ElSelect,
        props: baseProps,
        children: normalizedOptions.map(option =>
          h(ElOption, {
            key: option.value,
            label: option.label,
            value: option.value,
            disabled: option.disabled,
          }),
        ),
      };

    case 'cascader':
      return {
        component: ElCascader,
        props: {
          ...baseProps,
          options: normalizedOptions,
        },
      };

    case 'date':
      return {
        component: ElDatePicker,
        props: baseProps,
      };

    case 'daterange':
      return {
        component: ElDatePicker,
        props: {
          ...baseProps,
          type: 'daterange',
        },
      };

    case 'time':
      return {
        component: ElTimePicker,
        props: baseProps,
      };

    case 'timeselect':
      return {
        component: ElTimeSelect,
        props: baseProps,
      };

    case 'switch':
      return {
        component: ElSwitch,
        props: baseProps,
      };

    case 'checkbox':
      return {
        component: ElCheckboxGroup,
        props: baseProps,
        children: normalizedOptions.map(option =>
          h(ElCheckbox, {
            key: option.value,
            value: option.value,
            disabled: option.disabled,
          }, { default: () => option.label }),
        ),
      };

    case 'radio':
      return {
        component: ElRadioGroup,
        props: baseProps,
        children: normalizedOptions.map(option =>
          h(ElRadio, {
            key: option.value,
            value: option.value,
            disabled: option.disabled,
          }, { default: () => option.label }),
        ),
      };

    case 'rate':
      return {
        component: ElRate,
        props: baseProps,
      };

    case 'color':
      return {
        component: ElColorPicker,
        props: baseProps,
      };

    case 'slider':
      return {
        component: ElSlider,
        props: baseProps,
      };

    case 'transfer':
      return {
        component: ElTransfer,
        props: {
          ...baseProps,
          data: normalizedOptions,
          props: { key: 'value', label: 'label', disabled: 'disabled' },
        },
      };

    case 'upload':
      return {
        component: ElUpload,
        props: {
          'fileList': modelValue,
          'onUpdate:fileList': onUpdateModelValue,
          onChange,
          ...field.props,
        },
        children: h(ElButton, { type: 'primary' }, { default: () => field.placeholder || '点击上传' }),
      };

    case 'autocomplete':
      return {
        component: ElAutocomplete,
        props: baseProps,
      };

    default:
      return {
        component: ElInput,
        props: baseProps,
      };
  }
}
