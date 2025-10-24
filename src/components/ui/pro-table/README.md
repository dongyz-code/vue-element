# ProTable 组件

一个基于 Vue 3 + Element Plus 的高级表格组件，支持单选、多选、跨页多选、分页、排序、筛选等功能。

## 功能特性

- ✅ 支持单选、多选、跨页多选
- ✅ 动态列配置
- ✅ 插槽自定义列渲染
- ✅ 分页功能
- ✅ 排序功能
- ✅ 筛选功能
- ✅ 完整的 TypeScript 支持
- ✅ 响应式设计

## 基础用法

```vue
<script setup lang="ts">
import type { ProTableColumn } from '@/components/ui';
import { ProTable } from '@/components/ui';

interface UserData {
  id: number;
  name: string;
  email: string;
  age: number;
  status: number;
}

const columns: ProTableColumn<UserData>[] = [
  {
    prop: 'id',
    label: 'ID',
    width: 80,
    sortable: true
  },
  {
    prop: 'name',
    label: '姓名',
    width: 120,
    sortable: true
  },
  {
    prop: 'email',
    label: '邮箱',
    width: 200
  }
];

const tableData = ref<UserData[]>([]);
const loading = ref(false);
const pageConfig = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

function handlePageChange(page: number, pageSize: number) {
  // 处理分页变化
}

function handleSortChange(sort: { prop: string; order: 'asc' | 'desc' | null }) {
  // 处理排序变化
}

function handleFilterChange(filters: Record<string, any[]>) {
  // 处理筛选变化
}
</script>

<template>
  <ProTable
    :data="tableData"
    :columns="columns"
    :loading="loading"
    :pagination="true"
    :page-config="pageConfig"
    @page-change="handlePageChange"
    @sort-change="handleSortChange"
    @filter-change="handleFilterChange"
  />
</template>
```

## 选择功能

### 多选表格

```vue
<script setup lang="ts">
const selectedRows = ref<UserData[]>([]);

function handleSelectionChange(selection: UserData[]) {
  selectedRows.value = selection;
}
</script>

<template>
  <ProTable
    :data="tableData"
    :columns="columns"
    :selection="true"
    :selected-rows="selectedRows"
    @selection-change="handleSelectionChange"
  />
</template>
```

### 单选表格

```vue
<template>
  <ProTable
    :data="tableData"
    :columns="columns"
    :selection="true"
    :selected-rows="selectedRows"
    @selection-change="handleSelectionChange"
  />
</template>
```

### 跨页多选表格

```vue
<template>
  <ProTable
    :data="tableData"
    :columns="columns"
    :selection="true"
    :selected-rows="selectedRows"
    @selection-change="handleSelectionChange"
  />
</template>
```

## 插槽自定义列

```vue
<script setup lang="ts">
const columns: ProTableColumn<UserData>[] = [
  {
    prop: 'status',
    label: '状态',
    width: 100,
    slot: 'status'
  },
  {
    prop: 'actions',
    label: '操作',
    width: 150,
    slot: 'actions',
    fixed: 'right'
  }
];
</script>

<template>
  <ProTable
    :data="tableData"
    :columns="columns"
  >
    <!-- 自定义状态列 -->
    <template #status="{ row, value }">
      <el-tag :type="getStatusType(value)">
        {{ getStatusText(value) }}
      </el-tag>
    </template>

    <!-- 自定义操作列 -->
    <template #actions="{ row }">
      <el-button size="small" @click="handleEdit(row)">
        编辑
      </el-button>
      <el-button size="small" type="danger" @click="handleDelete(row)">
        删除
      </el-button>
    </template>
  </ProTable>
</template>
```

## API

### Props

| 参数          | 说明           | 类型                                    | 默认值       |
| ------------- | -------------- | --------------------------------------- | ------------ |
| data          | 表格数据       | `T[]`                                   | `[]`         |
| columns       | 列配置         | `ProTableColumn<T>[]`                   | `[]`         |
| selection     | 是否显示选择列 | `boolean`                               | `false`      |
| selectionMode | 选择模式       | `'single' \| 'multiple' \| 'crossPage'` | `'multiple'` |
| selectedRows  | 已选择的行数据 | `T[]`                                   | `[]`         |
| rowKey        | 行唯一标识字段 | `string`                                | `'id'`       |
| pagination    | 是否显示分页   | `boolean`                               | `true`       |
| pageConfig    | 分页配置       | `object`                                | -            |
| sortable      | 是否显示排序   | `boolean`                               | `true`       |
| filterable    | 是否显示筛选   | `boolean`                               | `true`       |
| loading       | 加载状态       | `boolean`                               | `false`      |
| height        | 表格高度       | `string \| number`                      | -            |
| maxHeight     | 最大高度       | `string \| number`                      | -            |
| border        | 是否显示边框   | `boolean`                               | `true`       |
| stripe        | 是否显示斑马纹 | `boolean`                               | `false`      |
| showHeader    | 是否显示表头   | `boolean`                               | `true`       |
| emptyText     | 空数据文本     | `string`                                | `'暂无数据'` |
| showIndex     | 是否显示序号列 | `boolean`                               | `false`      |

### Events

| 事件名          | 说明     | 参数                                                       |
| --------------- | -------- | ---------------------------------------------------------- |
| selectionChange | 选择变化 | `(selectedRows: T[])`                                      |
| pageChange      | 分页变化 | `(page: number, pageSize: number)`                         |
| sortChange      | 排序变化 | `(sort: { prop: string; order: 'asc' \| 'desc' \| null })` |
| filterChange    | 筛选变化 | `(filters: Record<string, any[]>)`                         |
| rowClick        | 行点击   | `(row: T, column: ProTableColumn<T>, event: Event)`        |
| rowDblclick     | 行双击   | `(row: T, column: ProTableColumn<T>, event: Event)`        |

### Methods

| 方法名             | 说明           | 参数                           |
| ------------------ | -------------- | ------------------------------ |
| getSelectedRows    | 获取已选择的行 | -                              |
| clearSelection     | 清空选择       | -                              |
| toggleRowSelection | 切换行选择状态 | `(row: T, selected?: boolean)` |
| toggleAllSelection | 全选/取消全选  | -                              |
| refresh            | 刷新表格       | -                              |

### 列配置 (ProTableColumn)

| 参数          | 说明           | 类型                                                        | 默认值  |
| ------------- | -------------- | ----------------------------------------------------------- | ------- |
| prop          | 列的唯一标识   | `string`                                                    | -       |
| label         | 列标题         | `string`                                                    | -       |
| width         | 列宽度         | `string \| number`                                          | -       |
| minWidth      | 列最小宽度     | `string \| number`                                          | -       |
| fixed         | 是否固定列     | `boolean \| 'left' \| 'right'`                              | -       |
| sortable      | 是否可排序     | `boolean`                                                   | `false` |
| filterable    | 是否可筛选     | `boolean`                                                   | `false` |
| filterOptions | 筛选选项       | `Array<{ label: string; value: any }>`                      | -       |
| align         | 列对齐方式     | `'left' \| 'center' \| 'right'`                             | -       |
| show          | 是否显示       | `boolean`                                                   | `true`  |
| render        | 自定义渲染函数 | `(row: T, column: ProTableColumn<T>, index: number) => any` | -       |
| slot          | 插槽名称       | `string`                                                    | -       |

## 完整示例

查看 `src/pages/demo/pro-table/index.vue` 文件获取完整的使用示例。
