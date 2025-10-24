import type { Ref } from 'vue';
import type { DefaultRow } from '../types';

import { computed, ref, watchEffect } from 'vue';
import { arrObject } from '@/utils';

export function useTreeSelection<T extends DefaultRow = DefaultRow>({
  data,
  option,
}: {
  data: Ref<T[]>;
  option: {
    type: 'checkbox' | 'radio';
    childrenField?: string;
    checkStrictly: boolean;
    selectionKeys?: Ref<string[]>;
    defaultSelectionKeys?: string[];
    rowKey: (row: T) => string;
  };
}) {
  type TreeNode = T & { parent: TreeNode | null };
  type TreeMap = Map<string, TreeNode>;

  const {
    type = 'checkbox',
    checkStrictly = false,
    childrenField = 'children',
    selectionKeys: externalSelectionKeys,
    defaultSelectionKeys,
    rowKey = (row: T) => row.id,
  } = option;

  /**
   * 状态
   */
  const innerSelectionKeys = ref(defaultSelectionKeys ?? []);
  const halfCheckedSet = ref(new Set<string>());
  const selectionKeys = computed({
    get() {
      return externalSelectionKeys ? externalSelectionKeys.value : innerSelectionKeys.value;
    },
    set(value: string[]) {
      if (externalSelectionKeys) {
        externalSelectionKeys.value = value;
      }
      else {
        innerSelectionKeys.value = value;
      }
    },
  });
  const selectionKeySet = computed(() => new Set(selectionKeys.value ?? []));

  /**
   * 树结构数据/树结构映射表
   */
  const treeData = computed(() => {
    const treeMap = new Map<string, TreeNode>();
    const tree = makeNodeParents(data.value, null, treeMap);

    return {
      tree,
      treeMap,
    };
  });

  /**
   * 1. 构建具有父节点关系的树结构
   * 2. 构建树结构映射表
   */
  function makeNodeParents(nodes: T[], parent: TreeNode | null, treeMap: TreeMap): TreeNode[] {
    return nodes?.map((node: T) => {
      const children = node[childrenField];

      const newNode: TreeNode = {
        ...node,
        parent,
      };

      if (children?.length) {
        (node as any)[childrenField] = makeNodeParents(children, newNode, treeMap);
      }

      const key = rowKey(node);
      treeMap.set(key, newNode);

      return newNode;
    });
  }

  /**
   * 选中/取消选中 节点
   */
  function toggleRowSelection(key: string, checked: boolean) {
    // 单选模式下，直接设置选中项
    if (type === 'radio') {
      selectionKeys.value = [key];
      halfCheckedSet.value.clear();
      return;
    }

    console.log(type, key, checked);
    if (checked) {
      selectionKeys.value = [...selectionKeys.value, key];
    }
    else {
      selectionKeys.value = selectionKeys.value.filter(item => item !== key);
    }

    // 严格模式下，根据选中项和半选中项判断是否需要更新选中项
    if (checkStrictly) {
      halfCheckedSet.value.clear();
      return;
    }

    // 非严格模式下，需要修改父子关系树结构中节点的选中状态
    const node = findNode(key);
    if (!node) {
      return;
    }

    updateChildrenSelection(node, checked);
    updateParentSelection(node);
  }

  /**
   * 递归更新所有子节点选中状态
   */
  function updateChildrenSelection(node: TreeNode, checked: boolean) {
    const children = getChildren(node);

    if (!children) {
      return;
    }

    children.forEach((child) => {
      const childKey = rowKey(child);
      if (checked) {
        selectionKeys.value = [...selectionKeys.value, childKey];
      }
      else {
        selectionKeys.value = selectionKeys.value.filter(item => item !== childKey);
      }
      halfCheckedSet.value.delete(childKey);
      updateChildrenSelection(child, checked);
    });
  }

  /**
   * 向上更新父节点半选中状态
   */
  function updateParentSelection(node: TreeNode) {
    let parent = node.parent;
    while (parent) {
      const parentKey = rowKey(parent);
      const parentChildren = getChildren(parent);
      const isAllChecked = parentChildren.every(child => selectionKeySet.value.has(rowKey(child)));
      if (isAllChecked) {
        selectionKeys.value = [...selectionKeys.value, parentKey];
        halfCheckedSet.value.delete(parentKey);
      }
      else {
        halfCheckedSet.value.add(parentKey);
        selectionKeys.value = selectionKeys.value.filter(item => item !== parentKey);
      }
      parent = parent.parent;
    }
  }

  /**
   * 工具函数
   */
  function findNode(key: string) {
    return treeData.value.treeMap.get(key);
  }

  function getChildren(node: TreeNode) {
    return node[childrenField] as TreeNode[];
  }

  /**
   * 清空选中
   */
  function clearSelection() {
    selectionKeys.value = [];
    halfCheckedSet.value.clear();
  }

  /**
   * 批量设置选中
   */
  function setSelection(keys: string[]) {
    selectionKeys.value = keys;
    halfCheckedSet.value.clear();

    if (checkStrictly) {
      return;
    }

    keys.forEach((key) => {
      const node = findNode(key);
      if (node) {
        updateChildrenSelection(node, true);
        updateParentSelection(node);
      }
    });
  }

  /**
   * 判断节点选中状态
   */
  function isChecked(key: string) {
    return selectionKeySet.value.has(key);
  }

  /**
   * 判断节点半选中状态
   */
  function isHalfChecked(key: string) {
    return halfCheckedSet.value.has(key);
  }

  /**
   * 选中全部的状态
   */
  const headerChecked = computed(() => {
    const allKeys = Array.from(treeData.value.treeMap.keys());

    const isChecked = allKeys.every(key => selectionKeySet.value.has(key));

    const isHalfChecked = allKeys.some(key => selectionKeySet.value.has(key));

    return {
      checked: isChecked,
      halfChecked: isHalfChecked,
    };
  });

  watchEffect(() => {
    console.log('selectionKeys.value =', selectionKeys.value);
    console.log('selectionKeySet.value =', selectionKeySet.value);
  });
  /**
   * 选中全部
   */
  function toggleAllSelection(checked: boolean) {
    if (checked) {
      selectionKeys.value = Array.from(treeData.value.treeMap.keys());
    }
    else {
      selectionKeys.value = [];
    }
    halfCheckedSet.value.clear();
  }

  return {
    halfCheckedSet,
    selectionKeys,
    headerChecked,

    toggleRowSelection,
    clearSelection,
    setSelection,
    isChecked,
    isHalfChecked,
    toggleAllSelection,
  };
}
