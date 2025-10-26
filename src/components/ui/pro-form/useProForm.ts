import type { FormInstance } from 'element-plus';
import type { EmitFn } from 'vue';
import type { ProFormEmits, ProFormField, ProFormOption, ProFormProps } from './types';

import { computed, ref } from 'vue';
import { useResponsiveCols } from './useResponsiveCols';

type ProFormHookProps = {
  props: ProFormProps;
  emit: EmitFn<ProFormEmits>;
};

export function useProForm({ props, emit }: ProFormHookProps) {
  const formRef = ref<FormInstance>();
  const collapsed = ref(props.defaultCollapsed);

  const { currentCols } = useResponsiveCols();

  const optionsCache = ref<Map<string, ProFormOption[]>>(new Map());

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
    if (!props.showCollapse) {
      return false;
    }
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
    if (!collapsed.value) {
      return false;
    }

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
    optionsCache,
    handleFieldChange,
    toggleCollapse,
    handleSubmit,
    handleReset,
    getFieldRules,
    getSlotName,
    getColSpanStyle,
    validate,
    clearValidate,
    resetFields,
  };
}
