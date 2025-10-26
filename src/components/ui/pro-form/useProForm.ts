import type { FormInstance } from 'element-plus';
import type { Component, EmitFn, VNode } from 'vue';
import type { ProFormEmits, ProFormField, ProFormOptions, ProFormProps } from './types';

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
import { computed, h, isRef, ref, unref } from 'vue';
import { useResponsiveCols } from './useResponsiveCols';

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

type FieldRenderConfig = {
  component: Component;
  props: Record<string, any>;
  children?: VNode | VNode[];
};

type ProFormHookProps = {
  props: ProFormProps;
  emit: EmitFn<ProFormEmits>;
};

export function useProForm({ props, emit }: ProFormHookProps) {
  const formRef = ref<FormInstance>();
  const collapsed = ref(props.defaultCollapsed);

  const { currentCols } = useResponsiveCols();

  const internalModel = computed({
    get: () => props.modelValue,
    set: (value) => {
      emit('update:modelValue', value);
    },
  });

  const visibleFields = computed(() => {
    return props.options.filter((field) => {
      if (field.visible === undefined) {
        return true;
      }
      if (typeof field.visible === 'boolean') {
        return field.visible;
      }
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
    return totalSpan > props.collapseToRows! * 4;
  });

  const displayFields = computed(() => {
    if (!needCollapse.value || !collapsed.value) {
      return visibleFields.value;
    }

    const maxColsInFirstRow = currentCols.value;
    let currentSpan = 0;
    const result: ProFormField[] = [];

    for (const field of visibleFields.value) {
      const fieldSpan = Math.min(field.colSpan || 1, maxColsInFirstRow);
      if (currentSpan + fieldSpan <= maxColsInFirstRow) {
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

  const displayFieldsSpan = computed(() => {
    return displayFields.value.reduce((sum, field) => {
      return sum + Math.min(field.colSpan || 1, currentCols.value);
    }, 0);
  });

  const canActionsInSameLine = computed(() => {
    if (!collapsed.value)
      return false;

    const actionsSpan = 1;
    const usedInLastRow = displayFieldsSpan.value % currentCols.value || currentCols.value;

    return usedInLastRow + actionsSpan <= currentCols.value;
  });

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
    if (typeof field.slot === 'string') {
      return field.slot;
    }
    if (field.slot === true) {
      return `field-${field.key}`;
    }
    return null;
  }

  function getColSpanStyle(colSpan?: number) {
    if (!colSpan || colSpan === 1) {
      return {};
    }

    const actualSpan = Math.min(colSpan, currentCols.value);
    return {
      gridColumn: `span ${actualSpan} / span ${actualSpan}`,
    };
  }

  function normalizeOptions(options?: ProFormOptions) {
    if (!options)
      return [];

    if (typeof options === 'function') {
      const result = options();
      return Array.isArray(result) ? result : [];
    }

    if (isRef(options))
      return unref(options) || [];

    return options;
  }

  /**
   * 最终渲染的表单项
   */
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

      case 'select': {
        const normalizedOptions = normalizeOptions(field.options);
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
      }

      case 'cascader': {
        const normalizedOptions = normalizeOptions(field.options);
        return {
          component: ElCascader,
          props: {
            ...baseProps,
            options: normalizedOptions,
          },
        };
      }

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

      case 'checkbox': {
        const normalizedOptions = normalizeOptions(field.options);
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
          children: normalizedOptions.map(option =>
            h(ElCheckbox, {
              key: option.value,
              value: option.value,
              disabled: option.disabled,
            }, { default: () => option.label }),
          ),
        };
      }

      case 'radio': {
        const normalizedOptions = normalizeOptions(field.options);
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
          children: normalizedOptions.map(option =>
            h(ElRadio, {
              key: option.value,
              value: option.value,
              disabled: option.disabled,
            }, { default: () => option.label }),
          ),
        };
      }

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

      case 'transfer': {
        const normalizedOptions = normalizeOptions(field.options);
        return {
          component: ElTransfer,
          props: {
            'modelValue': internalModel.value[field.key],
            'onUpdate:modelValue': (val: any) => {
              internalModel.value[field.key] = val;
            },
            'onChange': () => handleFieldChange(field.key, internalModel.value[field.key]),
            'data': normalizedOptions,
            'props': { key: 'value', label: 'label', disabled: 'disabled' },
            ...field.props,
          },
        };
      }

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

  return {
    formRef,
    collapsed,
    internalModel,
    visibleFields,
    needCollapse,
    displayFields,
    showCollapseButton,
    currentCols,
    canActionsInSameLine,
    displayFieldsSpan,
    handleFieldChange,
    toggleCollapse,
    handleSubmit,
    handleReset,
    getFieldRules,
    getSlotName,
    getColSpanStyle,
    renderFieldControl,
    validate,
    clearValidate,
    resetFields,
  };
}
