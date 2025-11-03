import type { Component, FunctionalComponent } from 'vue';
import type { ProFormFieldProps, ProFormOption } from '../types';

import {
  ElAutocomplete,
  ElCascader,
  ElCheckboxGroup,
  ElColorPicker,
  ElDatePicker,
  ElInput,
  ElInputNumber,
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
import { computed, isRef, onMounted, ref, shallowRef, toRef } from 'vue';

import 'element-plus/es/components/autocomplete/style/css';
import 'element-plus/es/components/button/style/css';
import 'element-plus/es/components/cascader/style/css';
import 'element-plus/es/components/checkbox/style/css';
import 'element-plus/es/components/checkbox-group/style/css';
import 'element-plus/es/components/color-picker/style/css';
import 'element-plus/es/components/date-picker/style/css';
import 'element-plus/es/components/input/style/css';
import 'element-plus/es/components/input-number/style/css';
import 'element-plus/es/components/time-picker/style/css';
import 'element-plus/es/components/time-select/style/css';
import 'element-plus/es/components/transfer/style/css';
import 'element-plus/es/components/upload/style/css';
import 'element-plus/es/components/select/style/css';
import 'element-plus/es/components/slider/style/css';
import 'element-plus/es/components/switch/style/css';
import 'element-plus/es/components/rate/style/css';
import 'element-plus/es/components/radio/style/css';
import 'element-plus/es/components/radio-group/style/css';

interface FieldResolverCallbacks {
  onUpdateModelValue: (value: any) => void;
  onChange: (value: any) => void;
}

const componentMap = {
  'input': ElInput,
  'textarea': ElInput,
  'input-number': ElInputNumber,
  'select': ElSelect,
  'cascader': ElCascader,
  'date': ElDatePicker,
  'daterange': ElDatePicker,
  'time': ElTimePicker,
  'timeselect': ElTimeSelect,
  'switch': ElSwitch,
  'checkbox': ElCheckboxGroup,
  'radio': ElRadioGroup,
  'rate': ElRate,
  'color': ElColorPicker,
  'slider': ElSlider,
  'transfer': ElTransfer,
  'upload': ElUpload,
  'autocomplete': ElAutocomplete,
  'text': 'div',
};

export function useProFormField(
  props: ProFormFieldProps,
  callbacks: FieldResolverCallbacks,
) {
  const { onUpdateModelValue, onChange } = callbacks;

  const baseProps = computed(() => {
    return {
      'modelValue': props.modelValue,
      'onUpdate:modelValue': onUpdateModelValue,
      onChange,
      'placeholder': props.field.placeholder,

    };
  });

  const field = toRef(props, 'field');

  const lazyLoadPromise = shallowRef<Promise<ProFormOption[]> | null>(null);
  const asyncOptions = shallowRef<ProFormOption[]>([]);
  const isLoading = ref(false);

  async function getAsyncOptions() {
    if (lazyLoadPromise.value || !('options' in field.value)) {
      return;
    }

    if (Array.isArray(field.value.options)) {
      asyncOptions.value = field.value.options;
      return;
    }

    if (isRef(field.value.options)) {
      asyncOptions.value = field.value.options.value;
      return;
    }

    if (typeof field.value.options === 'function') {
      try {
        const promise = field.value.options();
        isLoading.value = true;

        if (promise instanceof Promise) {
          lazyLoadPromise.value = promise;
          const options = await promise;
          asyncOptions.value = options;
          lazyLoadPromise.value = null;
        }
        else {
          asyncOptions.value = promise;
        }
      }
      catch (error) {
        console.error(error);
      }
      finally {
        isLoading.value = false;
        lazyLoadPromise.value = null;
      };
    }
  }

  onMounted(getAsyncOptions);

  const FieldComponent = computed<Component | FunctionalComponent | string>(() => {
    if (field.value.type === 'component') {
      return field.value.component;
    }

    if (field.value.type === 'render') {
      return field.value.render;
    }

    return componentMap[field.value.type] || 'div';
  });

  const fieldProps = computed(() => {
    let common: any = { ...baseProps.value };

    if ('props' in field.value) {
      common = { ...common, ...field.value.props };
    }

    switch (field.value.type) {
      case 'textarea':
        common = { ...common, type: 'textarea' };
        break;
      case 'daterange':
        common = { ...common, type: 'daterange' };
        break;
      case 'select':
      case 'cascader':
      case 'transfer':
      case 'checkbox':
      case 'radio':
        common = { ...common, options: asyncOptions.value };
        break;
      case 'upload':
        common = {
          ...common,
          'fileList': props.modelValue,
          'onUpdate:fileList': onUpdateModelValue,
          onChange,
        };
        break;
      default:
        break;
    }

    return common;
  });

  return { Component: FieldComponent, props: fieldProps };
}
