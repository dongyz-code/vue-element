import type { Ref } from 'vue';
import type { DefaultRow } from '../types';

import { computed, ref } from 'vue';
import { arrObject } from '@/utils';

export function useTreeSelection<T extends DefaultRow = DefaultRow>({
  data,
  childrenField,
  option,
}: {
  data: Ref<T[]>;
  childrenField: string;
  option: {
    checkStrictly: boolean;
    type: 'checkbox' | 'radio';
  };
}) {
  const state = ref({
    selectionKeys: new Set<string>(),
    halfCheckedMap: new Set<string>(),
  });
  /** 树结构数据 */
  const treeData = computed(() => makeNodeParents(data.value, null));

  /** 构建具有父子关系的树结构 */
  function makeNodeParents(nodes: T[], parent: T | null): (T & { parent: T | null }) [] {
    return nodes?.map((node: T) => {
      const children = node[childrenField];
      if (children?.length) {
        (node as any)[childrenField] = makeNodeParents(children, node);
      }
      return {
        ...node,
        [childrenField]: makeNodeParents(children, node),
        parent,
      };
    });
  }

  function toggleRowSelection(key: string) {
    // 单选模式下，直接设置选中项
    if (option.type === 'radio') {
      state.value.selectionKeys = new Set([key]);
      state.value.halfCheckedMap.clear();
      return;
    }

    // 严格模式下，根据选中项和半选中项判断是否需要更新选中项
    if (state.value.selectionKeys.has(key)) {
      state.value.selectionKeys.delete(key);
    }
    else {
      state.value.selectionKeys.add(key);
    }

    if (option.checkStrictly) {
      state.value.halfCheckedMap.clear();
      return;
    }

    // 非严格模式下，需要修改父子关系树结构中节点的选中状态
    const node = findNode(treeData.value, key);
    if (node) {
      updateNodeSelection(node);
    }

    function updateNodeSelection(node: (T & { parent: T | null })) {
      if (node.parent) {
        updateNodeSelection(node.parent);
      }
    }
  }
}
