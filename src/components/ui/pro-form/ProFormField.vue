<script setup lang="ts">
import type { ProFormField } from './types';

import { computed, h } from 'vue';
import {
  renderAutocomplete,
  renderCascader,
  renderCheckbox,
  renderColor,
  renderDate,
  renderDateRange,
  renderInput,
  renderInputNumber,
  renderRadio,
  renderRate,
  renderSelect,
  renderSlider,
  renderSwitch,
  renderTextarea,
  renderTime,
  renderTimeSelect,
  renderTransfer,
  renderUpload,
} from './field-renderers';
import { useProFormField } from './useProFormField';

interface ProFormFieldProps {
  field: ProFormField;
  modelValue: any;
  optionsCache?: Map<string, any[]>;
  disabled?: boolean;
}

const props = defineProps<ProFormFieldProps>();

const emit = defineEmits<{
  'update:modelValue': [value: any];
  'change': [value: any];
}>();

const { loading, normalizedOptions } = useProFormField({
  field: props.field,
  modelValue: props.modelValue,
  optionsCache: props.optionsCache,
});

function handleChange(value: any) {
  emit('update:modelValue', value);
  emit('change', value);
}

const renderContext = computed(() => ({
  value: props.modelValue,
  onChange: handleChange,
  placeholder: props.field.placeholder,
  disabled: props.disabled,
  loading: loading.value,
  options: normalizedOptions.value as any,
  ...props.field.props,
} as any));

const fieldComponent = computed(() => {
  const ctx = renderContext.value;

  switch (props.field.type) {
    case 'input':
      return renderInput(ctx);
    case 'textarea':
      return renderTextarea(ctx);
    case 'input-number':
      return renderInputNumber(ctx);
    case 'select':
      return renderSelect(ctx);
    case 'cascader':
      return renderCascader(ctx);
    case 'date':
      return renderDate(ctx);
    case 'daterange':
      return renderDateRange(ctx);
    case 'time':
      return renderTime(ctx);
    case 'timeselect':
      return renderTimeSelect(ctx);
    case 'switch':
      return renderSwitch(ctx);
    case 'checkbox':
      return renderCheckbox(ctx);
    case 'radio':
      return renderRadio(ctx);
    case 'rate':
      return renderRate(ctx);
    case 'color':
      return renderColor(ctx);
    case 'slider':
      return renderSlider(ctx);
    case 'transfer':
      return renderTransfer(ctx);
    case 'upload':
      return renderUpload(ctx);
    case 'autocomplete':
      return renderAutocomplete(ctx);
    default:
      return renderInput(ctx);
  }
});

function renderField() {
  const config = fieldComponent.value;
  return h(config.component, config.props, config.children);
}
</script>

<template>
  <component :is="renderField()" />
</template>
