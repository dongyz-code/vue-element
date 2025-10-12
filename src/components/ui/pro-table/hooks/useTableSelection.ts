import type { Ref } from 'vue';
import { computed, reactive, watch } from 'vue';

// 通用树节点接口
export type TreeNode = {
  key: string | number;
  children?: TreeNode[];
  parent?: TreeNode | null;
  disabled?: boolean;
  [key: string]: any;
};

// 选择状态接口
export type TreeSelectionState = {
  selectedKeys: Set<string | number>;
  indeterminateKeys: Set<string | number>;
};

// 配置选项
export type TreeSelectionOptions = {
  keyField?: string;
  childrenField?: string;
  checkStrictly?: boolean; // 是否严格模式（不关联父子节点）
  autoSelectChildren?: boolean; // 是否自动选择子节点
  autoUpdateParents?: boolean; // 是否自动更新父节点状态
};

/**
 * 重写表格选择状态
 *
 * 功能：
 * 1. 单选、多选、
 * 2. 严格模式、非严格模式
 * 3. 自动选择子节点、自动更新父节点状态
 * 4. 设置选中状态、清除选择
 * 5. 根据key查找节点
 * 6. 展平树结构
 * 7. 计算属性 已选中的节点
 * 8. 计算属性 半选中的节点
 */
export function useTableSelection(
  treeData: Ref<TreeNode[]>,
  options: TreeSelectionOptions = {},
) {
  const {
    keyField = 'key',
    childrenField = 'children',
    checkStrictly = false,
    autoSelectChildren = true,
    autoUpdateParents = true,
  } = options;

  const state = reactive<TreeSelectionState>({
    selectedKeys: new Set(),
    indeterminateKeys: new Set(),
  });

  /**
   * 构建父子关系
   */
  const buildTreeRelations = (nodes: TreeNode[], parent: TreeNode | null = null) => {
    nodes.forEach((node) => {
      node.parent = parent;
      if (node[childrenField]) {
        buildTreeRelations(node[childrenField], node);
      }
    });
  };

  /**
   * 监听树数据变化，重新构建关系
   */
  watch(treeData, (newData) => {
    if (newData.length > 0) {
      buildTreeRelations([...newData]);
    }
  }, { immediate: true });

  /**
   * 获取所有后代节点
   */
  const getAllDescendants = (node: TreeNode): TreeNode[] => {
    const descendants: TreeNode[] = [];
    const traverse = (current: TreeNode) => {
      if (current[childrenField]) {
        current[childrenField].forEach((child: TreeNode) => {
          if (!child.disabled) {
            descendants.push(child);
            traverse(child);
          }
        });
      }
    };
    traverse(node);
    return descendants;
  };

  /**
   * 更新父链状态
   */
  const updateParentChain = (node: TreeNode) => {
    if (!autoUpdateParents || checkStrictly)
      return;

    let currentParent = node.parent;
    while (currentParent && !currentParent.disabled) {
      const children = currentParent[childrenField] || [];

      const enabledChildren = children.filter((child: TreeNode) => !child.disabled);
      if (enabledChildren.length === 0)
        break;

      const selectedCount = enabledChildren.filter((child: TreeNode) =>
        state.selectedKeys.has(child[keyField]),
      ).length;

      const indeterminateCount = enabledChildren.filter((child: TreeNode) =>
        state.indeterminateKeys.has(child[keyField]),
      ).length;

      const parentKey = currentParent[keyField];

      // 所有子节点都选中
      if (selectedCount === enabledChildren.length) {
        state.selectedKeys.add(parentKey);
        state.indeterminateKeys.delete(parentKey);
      }
      // 部分子节点选中或有不确定状态
      else if (selectedCount > 0 || indeterminateCount > 0) {
        state.indeterminateKeys.add(parentKey);
        state.selectedKeys.delete(parentKey);
      }
      // 没有子节点选中
      else {
        state.selectedKeys.delete(parentKey);
        state.indeterminateKeys.delete(parentKey);
      }

      currentParent = currentParent.parent;
    }
  };

  /**
   * 切换选择状态
   */
  const toggleSelect = (node: TreeNode) => {
    if (node.disabled) {
      return;
    }

    const nodeKey = node[keyField];
    const isCurrentlySelected = state.selectedKeys.has(nodeKey);

    if (checkStrictly) {
      // 严格模式：只切换当前节点
      if (isCurrentlySelected) {
        state.selectedKeys.delete(nodeKey);
      }
      else {
        state.selectedKeys.add(nodeKey);
      }
      state.indeterminateKeys.delete(nodeKey);
      return;
    }

    // 非严格模式：处理关联节点
    if (isCurrentlySelected) {
      // 取消选择
      state.selectedKeys.delete(nodeKey);
      state.indeterminateKeys.delete(nodeKey);

      if (autoSelectChildren) {
        // 取消所有后代节点的选择
        const descendants = getAllDescendants(node);
        descendants.forEach((descendant) => {
          state.selectedKeys.delete(descendant[keyField]);
          state.indeterminateKeys.delete(descendant[keyField]);
        });
      }
    }
    else {
      // 选择
      state.selectedKeys.add(nodeKey);
      state.indeterminateKeys.delete(nodeKey);

      if (autoSelectChildren) {
        // 选择所有后代节点
        const descendants = getAllDescendants(node);
        descendants.forEach((descendant) => {
          if (!descendant.disabled) {
            state.selectedKeys.add(descendant[keyField]);
            state.indeterminateKeys.delete(descendant[keyField]);
          }
        });
      }
    }

    if (autoUpdateParents) {
      updateParentChain(node);
    }
  };

  /**
   * 设置选中状态
   */
  const setSelected = (node: TreeNode, selected: boolean) => {
    if (selected) {
      if (!state.selectedKeys.has(node[keyField])) {
        toggleSelect(node);
      }
    }
    else {
      if (state.selectedKeys.has(node[keyField])) {
        toggleSelect(node);
      }
    }
  };

  /**
   * 单选：选中指定节点，取消其他所有选中
   */
  const selectSingle = (node: TreeNode) => {
    if (node.disabled) {
      return;
    }

    const nodeKey = node[keyField];
    state.selectedKeys.clear();
    state.indeterminateKeys.clear();
    state.selectedKeys.add(nodeKey);
  };

  /**
   * 多选：切换多个节点的选中状态
   */
  const toggleMultiple = (nodes: TreeNode[]) => {
    nodes.forEach((node) => {
      if (!node.disabled) {
        toggleSelect(node);
      }
    });
  };

  /**
   * 选中所有节点
   */
  const selectAll = () => {
    state.selectedKeys.clear();
    state.indeterminateKeys.clear();

    const traverse = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        if (!node.disabled) {
          state.selectedKeys.add(node[keyField]);
          if (node[childrenField]) {
            traverse(node[childrenField]);
          }
        }
      });
    };

    traverse(treeData.value);
  };

  /**
   * 清除所有选择
   */
  const clearSelection = () => {
    state.selectedKeys.clear();
    state.indeterminateKeys.clear();
  };

  /**
   * 根据key查找节点
   */
  const findNode = (nodes: TreeNode[], targetKey: string | number): TreeNode | null => {
    for (const node of nodes) {
      if (node[keyField] === targetKey)
        return node;
      if (node[childrenField]) {
        const found = findNode(node[childrenField], targetKey);
        if (found)
          return found;
      }
    }
    return null;
  };

  /**
   * 展平树结构
   */
  const flattenTree = (node: TreeNode): TreeNode[] => {
    return [node, ...(node[childrenField]?.flatMap((child: TreeNode) => flattenTree(child)) || [])];
  };

  /**
   * 计算属性 已选中的节点
   */
  const selectedNodes = computed(() => {
    const allNodes = treeData.value.flatMap(node => flattenTree(node));
    return allNodes.filter(node =>
      state.selectedKeys.has(node[keyField])
      && !state.indeterminateKeys.has(node[keyField])
      && !node.disabled,
    );
  });

  /**
   * 计算属性 半选中的节点
   */
  const indeterminateNodes = computed(() => {
    return Array.from(state.indeterminateKeys)
      .map(key => findNode(treeData.value, key))
      .filter(Boolean) as TreeNode[];
  });

  const selectedKeys = computed(() => Array.from(state.selectedKeys));
  const indeterminateKeys = computed(() => Array.from(state.indeterminateKeys));

  /**
   * 状态检查方法 是否选中
   */
  const isSelected = (node: TreeNode): boolean => {
    return state.selectedKeys.has(node[keyField])
      && !state.indeterminateKeys.has(node[keyField])
      && !node.disabled;
  };

  /**
   * 状态检查方法 是否半选中
   */
  const isIndeterminate = (node: TreeNode): boolean => {
    return state.indeterminateKeys.has(node[keyField]) && !node.disabled;
  };

  /**
   * 设置选中keys（用于受控模式）
   */
  const setSelectedKeys = (keys: (string | number)[]) => {
    clearSelection();
    keys.forEach((key) => {
      const node = findNode(treeData.value, key);
      if (node && !node.disabled) {
        state.selectedKeys.add(key);
      }
    });

    // 更新父节点状态
    if (autoUpdateParents && !checkStrictly) {
      treeData.value.forEach((node) => {
        updateParentChain(node);
      });
    }
  };

  return {
    // 状态
    selectionState: state,

    // 数据
    selectedNodes,
    selectedKeys,
    indeterminateNodes,
    indeterminateKeys,

    // 方法
    toggleSelect,
    setSelected,
    selectSingle,
    toggleMultiple,
    selectAll,
    clearSelection,
    setSelectedKeys,

    // 状态检查
    isSelected,
    isIndeterminate,

    // 工具方法
    findNode,
    flattenTree,
  };
}
