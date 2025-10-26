import type { ProFormField } from '../types';
import { computed } from 'vue';
import { resolveFieldComponent } from '../utils/fieldResolver';

type ProFormFieldEmit = {
  (event: 'update:modelValue', value: any): void;
  (event: 'change', value: any): void;
};

interface UseProFormFieldProps {
  props: {
    field: ProFormField;
    modelValue: any;
  };
  emit: ProFormFieldEmit;
}

export function useProFormField({ props, emit }: UseProFormFieldProps) {
  const componentConfig = computed(() => {
    return resolveFieldComponent(props.field, props.modelValue, {
      onUpdateModelValue: (val: any) => emit('update:modelValue', val),
      onChange: (val: any) => emit('change', val),
    });
  });

  const slots = computed(() => {
    const config = componentConfig.value;
    if (!config.children) {
      return {};
    }

    const children = Array.isArray(config.children) ? config.children : [config.children];
    return {
      default: () => children,
    };
  });

  function handleUpdate(value: any) {
    emit('update:modelValue', value);
  }

  function handleChange(value: any) {
    emit('change', value);
  }

  return {
    componentConfig,
    slots,
    handleUpdate,
    handleChange,
  };
}
