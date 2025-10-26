<script setup lang="ts">
import type { ProFormEmits, ProFormExpose, ProFormProps } from './types';

import { VIcon } from '..';
import { useProForm } from './useProForm';

const props = withDefaults(defineProps<ProFormProps>(), {
  labelWidth: '100px',
  collapseToRows: 1,
  defaultCollapsed: true,
  showCollapse: true,
  submitText: '搜索',
  resetText: '重置',
  formProps: () => ({}),
});

const emit = defineEmits<ProFormEmits>();

const {
  formRef,
  collapsed,
  internalModel,
  needCollapse,
  displayFields,
  showCollapseButton,
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
} = useProForm({ props, emit });

defineExpose<ProFormExpose>({
  validate,
  clearValidate,
  resetFields,
});
</script>

<template>
  <div class="pro-form">
    <el-form
      ref="formRef"
      :model="internalModel"
      :label-width="labelWidth"
      v-bind="formProps"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <el-form-item
          v-for="field in displayFields"
          :key="field.key"
          :label="field.label"
          :prop="field.key"
          :rules="getFieldRules(field)"
          :style="getColSpanStyle(field.colSpan)"
        >
          <slot
            v-if="getSlotName(field)"
            :name="getSlotName(field)!"
            :field="field"
            :model="internalModel"
            :value="internalModel[field.key]"
            :set-value="(val: any) => { internalModel[field.key] = val }"
            :form="formRef"
          />

          <component :is="renderFieldControl(field)" v-else />
        </el-form-item>

        <div
          class="grid items-center gap-2 col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 justify-end"
        >
          <slot
            name="actions"
            :submit="handleSubmit"
            :reset="handleReset"
            :collapsed="collapsed"
            :toggle="toggleCollapse"
          >
            <ElButton type="primary" @click="handleSubmit">
              {{ submitText }}
            </ElButton>
            <ElButton @click="handleReset">
              {{ resetText }}
            </ElButton>
            <ElButton v-if="showCollapseButton" text type="primary" @click="toggleCollapse">
              {{ collapsed ? '展开' : '收起' }}
              <VIcon :class="{ 'rotate-90': collapsed, 'rotate-270': !collapsed }" icon="weui:arrow-filled"></VIcon>
            </ElButton>
          </slot>
        </div>
      </div>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.pro-form {
  :deep(.el-form-item) {
    margin-bottom: 0;
  }

  :deep(.el-input),
  :deep(.el-input-number),
  :deep(.el-select),
  :deep(.el-cascader),
  :deep(.el-date-picker),
  :deep(.el-time-select),
  :deep(.el-time-picker),
  :deep(.el-autocomplete) {
    width: 100%;
  }

  .rotate-180 {
    transform: rotate(180deg);
    transition: transform 0.3s;
  }

  .el-icon {
    transition: transform 0.3s;
  }
}
</style>
