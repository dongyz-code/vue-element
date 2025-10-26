import type { ProFormOption, ProFormOptions } from '../types';

import { isRef, unref } from 'vue';

/**
 * 规范化 options（支持数组、ref、computed、函数）
 */
export function normalizeOptions(options?: ProFormOptions): ProFormOption[] {
  if (!options) {
    return [];
  }

  // 函数
  if (typeof options === 'function') {
    const result = options();
    return Array.isArray(result) ? result : [];
  }

  // Ref 或 ComputedRef
  if (isRef(options)) {
    return unref(options) || [];
  }

  // 普通数组
  return options;
}
