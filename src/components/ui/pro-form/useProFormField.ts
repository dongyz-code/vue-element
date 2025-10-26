import type { ProFormField, ProFormOption, ProFormOptions } from './types';

import { computed, isRef, ref, unref, watch } from 'vue';

export interface UseProFormFieldOptions {
  field: ProFormField;
  modelValue?: any;
  optionsCache?: Map<string, ProFormOption[]>;
}

export function useProFormField(options: UseProFormFieldOptions) {
  const { field, optionsCache } = options;

  const loading = ref(false);
  const localOptions = ref<ProFormOption[]>([]);

  const hasOptions = computed(() => {
    return 'options' in field && field.options;
  });

  async function loadOptions() {
    if (!hasOptions.value) {
      return;
    }

    const fieldOptions = (field as any).options as ProFormOptions;

    // 检查缓存
    if (optionsCache && optionsCache.has(field.key)) {
      localOptions.value = optionsCache.get(field.key)!;
      return;
    }

    if (typeof fieldOptions === 'function') {
      loading.value = true;
      try {
        const result = fieldOptions();
        if (result instanceof Promise) {
          const resolved = await result;
          const normalized = Array.isArray(resolved) ? resolved : [];
          localOptions.value = normalized;
          if (optionsCache) {
            optionsCache.set(field.key, normalized);
          }
        }
        else {
          const normalized = Array.isArray(result) ? result : [];
          localOptions.value = normalized;
          if (optionsCache) {
            optionsCache.set(field.key, normalized);
          }
        }
      }
      catch (error) {
        console.error(`Failed to load options for field "${field.key}":`, error);
        localOptions.value = [];
      }
      finally {
        loading.value = false;
      }
    }
    else if (isRef(fieldOptions)) {
      localOptions.value = unref(fieldOptions) || [];
      // 监听 ref 变化
      watch(fieldOptions, (newVal) => {
        localOptions.value = newVal || [];
      });
    }
    else {
      localOptions.value = fieldOptions || [];
    }
  }

  // 初始化时加载选项
  loadOptions();

  const normalizedOptions = computed(() => {
    if (!hasOptions.value) {
      return [];
    }
    return localOptions.value;
  });

  const isVisible = computed(() => {
    if (field.visible === undefined) {
      return true;
    }
    if (typeof field.visible === 'boolean') {
      return field.visible;
    }
    // 这里需要从外部传入 model，暂时返回 true
    return true;
  });

  return {
    loading,
    normalizedOptions,
    isVisible,
    loadOptions,
  };
}
