<script setup lang="ts">
import type { ProFormField } from './types';

import { useProFormField } from './hooks/useProFormField';

interface ProFormFieldProps {
  field: ProFormField;
  modelValue: any;
}

const props = defineProps<ProFormFieldProps>();

const emit = defineEmits<{
  'update:modelValue': [value: any];
  'change': [value: any];
}>();

const { componentConfig, slots, handleUpdate, handleChange } = useProFormField({
  props,
  emit,
});
</script>

<template>
  <component
    :is="componentConfig.component"
    v-bind="componentConfig.props"
    v-slots="slots"
    @update:model-value="handleUpdate"
    @change="handleChange"
  />
</template>
