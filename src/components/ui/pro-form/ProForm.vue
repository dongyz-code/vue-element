<script setup lang="ts">
import type { FormInstance } from 'element-plus';
import type { Component, VNode } from 'vue';
import type { ProFormEmits, ProFormExpose, ProFormField, ProFormProps } from './types';

import {
  ElAutocomplete,
  ElButton,
  ElCascader,
  ElCheckbox,
  ElCheckboxGroup,
  ElColorPicker,
  ElDatePicker,
  ElIcon,
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
import { computed, h, ref } from 'vue';

const props = withDefaults(defineProps<ProFormProps>(), {
  labelWidth: '100px',
  collapseToRows: 1,
  defaultCollapsed: true,
  showCollapse: true,
  submitText: '搜索',
  resetText: '重置',
  formProps: () => ({}),
});

const emit = defineEmits<ProFormEmits>();

const formRef = ref<FormInstance>();
const collapsed = ref(props.defaultCollapsed);

const internalModel = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  },
});

const visibleFields = computed(() => {
  return props.options.filter((field) => {
    if (field.visible === undefined)
      return true;
    if (typeof field.visible === 'boolean')
      return field.visible;
    return field.visible({ model: internalModel.value });
  });
});

const needCollapse = computed(() => {
  if (!props.showCollapse)
    return false;
  let totalSpan = 0;
  for (const field of visibleFields.value) {
    totalSpan += field.colSpan || 1;
  }
  return totalSpan > props.collapseToRows * 4;
});

const displayFields = computed(() => {
  if (!needCollapse.value || !collapsed.value) {
    return visibleFields.value;
  }

  const maxSpan = props.collapseToRows * 4;
  let currentSpan = 0;
  const result: ProFormField[] = [];

  for (const field of visibleFields.value) {
    const fieldSpan = field.colSpan || 1;
    if (currentSpan + fieldSpan <= maxSpan) {
      result.push(field);
      currentSpan += fieldSpan;
    }
    else {
      break;
    }
  }

  return result;
});

const showCollapseButton = computed(() => needCollapse.value && props.showCollapse);

function handleFieldChange(key: string, value: any) {
  emit('change', key, value, internalModel.value);
}

function toggleCollapse() {
  collapsed.value = !collapsed.value;
  emit('toggle', collapsed.value);
}

async function handleSubmit() {
  try {
    await formRef.value?.validate();
    emit('submit', { ...internalModel.value });
  }
  catch (error) {
    console.error('Form validation failed:', error);
  }
}

function handleReset() {
  const resetValues: Record<string, any> = {};
  props.options.forEach((field) => {
    resetValues[field.key] = field.defaultValue !== undefined ? field.defaultValue : undefined;
  });
  internalModel.value = resetValues;
  formRef.value?.clearValidate();
  emit('reset');
}

function getFieldRules(field: ProFormField) {
  return field.rules || props.rules?.[field.key] || [];
}

function getSlotName(field: ProFormField) {
  if (typeof field.slot === 'string')
    return field.slot;
  if (field.slot === true)
    return `field-${field.key}`;
  return null;
}

function getColSpanStyle(colSpan?: number) {
  if (!colSpan || colSpan === 1)
    return {};
  return {
    gridColumn: `span ${Math.min(colSpan, 4)} / span ${Math.min(colSpan, 4)}`,
  };
}

interface FieldRenderConfig {
  component: Component;
  props: Record<string, any>;
  children?: VNode | VNode[];
}

function resolveFieldComponent(field: ProFormField): FieldRenderConfig {
  const baseProps = {
    'modelValue': internalModel.value[field.key],
    'onUpdate:modelValue': (val: any) => {
      internalModel.value[field.key] = val;
    },
    'onChange': () => handleFieldChange(field.key, internalModel.value[field.key]),
    'placeholder': field.placeholder,
    ...field.props,
  };

  switch (field.type) {
    case 'input':
      return {
        component: ElInput,
        props: baseProps,
      };

    case 'textarea':
      return {
        component: ElInput,
        props: { ...baseProps, type: 'textarea' },
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
        children: field.choices?.map(option =>
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
          options: field.choices,
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
        props: {
          'modelValue': internalModel.value[field.key],
          'onUpdate:modelValue': (val: any) => {
            internalModel.value[field.key] = val;
          },
          'onChange': () => handleFieldChange(field.key, internalModel.value[field.key]),
          ...field.props,
        },
      };

    case 'checkbox':
      return {
        component: ElCheckboxGroup,
        props: {
          'modelValue': internalModel.value[field.key],
          'onUpdate:modelValue': (val: any) => {
            internalModel.value[field.key] = val;
          },
          'onChange': () => handleFieldChange(field.key, internalModel.value[field.key]),
          ...field.props,
        },
        children: field.choices?.map(option =>
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
        props: {
          'modelValue': internalModel.value[field.key],
          'onUpdate:modelValue': (val: any) => {
            internalModel.value[field.key] = val;
          },
          'onChange': () => handleFieldChange(field.key, internalModel.value[field.key]),
          ...field.props,
        },
        children: field.choices?.map(option =>
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
        props: {
          'modelValue': internalModel.value[field.key],
          'onUpdate:modelValue': (val: any) => {
            internalModel.value[field.key] = val;
          },
          'onChange': () => handleFieldChange(field.key, internalModel.value[field.key]),
          ...field.props,
        },
      };

    case 'color':
      return {
        component: ElColorPicker,
        props: {
          'modelValue': internalModel.value[field.key],
          'onUpdate:modelValue': (val: any) => {
            internalModel.value[field.key] = val;
          },
          'onChange': () => handleFieldChange(field.key, internalModel.value[field.key]),
          ...field.props,
        },
      };

    case 'slider':
      return {
        component: ElSlider,
        props: {
          'modelValue': internalModel.value[field.key],
          'onUpdate:modelValue': (val: any) => {
            internalModel.value[field.key] = val;
          },
          'onChange': () => handleFieldChange(field.key, internalModel.value[field.key]),
          ...field.props,
        },
      };

    case 'transfer':
      return {
        component: ElTransfer,
        props: {
          'modelValue': internalModel.value[field.key],
          'onUpdate:modelValue': (val: any) => {
            internalModel.value[field.key] = val;
          },
          'onChange': () => handleFieldChange(field.key, internalModel.value[field.key]),
          'data': field.choices,
          'props': { key: 'value', label: 'label', disabled: 'disabled' },
          ...field.props,
        },
      };

    case 'upload':
      return {
        component: ElUpload,
        props: {
          'fileList': internalModel.value[field.key],
          'onUpdate:fileList': (val: any) => {
            internalModel.value[field.key] = val;
          },
          'onChange': () => handleFieldChange(field.key, internalModel.value[field.key]),
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

function renderFieldControl(field: ProFormField): VNode {
  const config = resolveFieldComponent(field);
  return h(config.component, config.props, config.children);
}

async function validate() {
  await formRef.value?.validate();
}

function clearValidate() {
  formRef.value?.clearValidate();
}

function resetFields() {
  handleReset();
}

defineExpose<ProFormExpose>({
  validate,
  clearValidate,
  resetFields,
});
</script>

<template>
  <div class="pro-form">
    <el-form
      ref="formRef"
      :model="internalModel"
      :label-width="labelWidth"
      v-bind="formProps"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <el-form-item
          v-for="field in displayFields"
          :key="field.key"
          :label="field.label"
          :prop="field.key"
          :rules="getFieldRules(field)"
          :style="getColSpanStyle(field.colSpan)"
        >
          <slot
            v-if="getSlotName(field)"
            :name="getSlotName(field)!"
            :field="field"
            :model="internalModel"
            :value="internalModel[field.key]"
            :set-value="(val: any) => { internalModel[field.key] = val }"
            :form="formRef"
          />

          <component :is="renderFieldControl(field)" v-else />
        </el-form-item>

        <div
          class="flex items-center gap-2"
          :class="[
            collapsed ? 'justify-start' : 'col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 justify-end',
          ]"
        >
          <slot
            name="actions"
            :submit="handleSubmit"
            :reset="handleReset"
            :collapsed="collapsed"
            :toggle="toggleCollapse"
          >
            <ElButton type="primary" @click="handleSubmit">
              {{ submitText }}
            </ElButton>
            <ElButton @click="handleReset">
              {{ resetText }}
            </ElButton>
            <ElButton v-if="showCollapseButton" text type="primary" @click="toggleCollapse">
              {{ collapsed ? '展开' : '收起' }}
              <ElIcon :class="{ 'rotate-180': !collapsed }">
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M831.872 340.864 512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728 30.592 30.592 0 0 0-42.752 0z" />
                </svg>
              </ElIcon>
            </ElButton>
          </slot>
        </div>
      </div>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.pro-form {
  :deep(.el-form-item) {
    margin-bottom: 0;
  }

  :deep(.el-input),
  :deep(.el-input-number),
  :deep(.el-select),
  :deep(.el-cascader),
  :deep(.el-date-picker),
  :deep(.el-time-select),
  :deep(.el-time-picker),
  :deep(.el-autocomplete) {
    width: 100%;
  }

  .rotate-180 {
    transform: rotate(180deg);
    transition: transform 0.3s;
  }

  .el-icon {
    transition: transform 0.3s;
  }
}
</style>
