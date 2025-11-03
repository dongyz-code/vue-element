<script setup lang="ts">
import type { ProFormField } from '@/components/ui/pro-form/types';

import { computed, ref } from 'vue';
import { ProForm } from '@/components/ui/pro-form';

const form1 = ref<Record<string, any>>({});
const form2 = ref<Record<string, any>>({});
const form3 = ref<Record<string, any>>({ filter: true });

const staticOptions = [
  { label: '选项1', value: 1 },
  { label: '选项2', value: 2 },
];

const refOptions = ref([
  { label: 'Ref A', value: 'a' },
  { label: 'Ref B', value: 'b' },
]);

const computedOptions = computed(() => {
  return form3.value.filter
    ? [{ label: 'Computed 1', value: 1 }]
    : [
        { label: 'Computed 1', value: 1 },
        { label: 'Computed 2', value: 2 },
      ];
});

function funcOptions() {
  console.log('funcOptions');
  return [
    { label: 'Func X', value: 'x' },
    { label: 'Func Y', value: 'y' },
  ];
}

const formOptions1: ProFormField[] = [
  { key: 'name', label: '名称', type: 'input' },
  { key: 'age', label: '年龄', type: 'input-number' },
];

const formOptions2: ProFormField[] = [
  { key: 'f1', label: '字段1', type: 'input' },
  { key: 'f2', label: '字段2', type: 'input' },
  { key: 'f3', label: '字段3', type: 'input' },
  { key: 'f4', label: '字段4', type: 'input' },
  { key: 'f5', label: '字段5', type: 'input' },
  { key: 'f6', label: '字段6', type: 'input' },
];

const formOptions3: ProFormField[] = [
  { key: 'static', label: '静态', type: 'select', options: staticOptions },
  { key: 'ref', label: 'Ref', type: 'select', options: refOptions },
  { key: 'computed', label: 'Computed', type: 'select', options: computedOptions },
  { key: 'func', label: '函数', type: 'select', options: funcOptions },
  { key: 'filter', label: '过滤开关', type: 'switch', defaultValue: true },
];

function updateRefOptions() {
  refOptions.value = [
    { label: 'Ref C', value: 'c' },
    { label: 'Ref D', value: 'd' },
  ];
}

function toggleFilter() {
  form3.value.filter = !form3.value.filter;
}

function handleSubmit(values: Record<string, any>) {
  console.log('Submit:', values);
}
</script>

<template>
  <div class="p-4 space-y-6">
    <h2>1. Label 在上方</h2>
    <ProForm
      v-model="form1"
      :options="formOptions1"
      label-position="top"
      @submit="handleSubmit"
    />

    <h2>2. 响应式布局（尝试缩放浏览器）</h2>
    <ProForm
      v-model="form2"
      :options="formOptions2"
      @submit="handleSubmit"
    />

    <h2>3. 动态 Options</h2>
    <ProForm
      v-model="form3"
      :options="formOptions3"
      @submit="handleSubmit"
    />
    <div class="flex gap-2">
      <ElButton @click="updateRefOptions">
        更新 Ref Options
      </ElButton>
      <ElButton @click="toggleFilter">
        切换过滤条件
      </ElButton>
    </div>
  </div>
</template>
