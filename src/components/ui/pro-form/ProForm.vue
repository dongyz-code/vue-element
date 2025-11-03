<script setup lang="ts">
import type { ProFormEmits, ProFormExpose, ProFormProps } from './types';

import { useProForm } from './hooks/useProForm';
import ProFormField from './ProFormField.vue';

const props = withDefaults(defineProps<ProFormProps>(), {
  labelWidth: '120px',
  labelPosition: 'left',
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
  displayFields,
  showCollapseButton,
  currentCols,
  canActionsInSameLine,
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
} = useProForm({ props, emit });

function updateFieldValue(key: string, value: any) {
  internalModel.value[key] = value;
}

defineExpose<ProFormExpose>({
  validate,
  clearValidate,
  resetFields,
});
</script>

<template>
  <el-form
    ref="formRef"
    :model="internalModel"
    :rules="rules"
    :label-width="labelPosition === 'top' ? undefined : labelWidth"
    :label-position="labelPosition"
    v-bind="formProps"
  >
    <div
      class=" grid gap-4"
      :class="[`grid-cols-${currentCols}`]"
    >
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
          :name="getSlotName(field)"
          :field="field"
          :model-value="internalModel[field.key]"
          :set-value="(val: any) => updateFieldValue(field.key, val)"
        />

        <ProFormField
          v-else
          :field="field"
          :model-value="internalModel[field.key]"
          @update:model-value="updateFieldValue(field.key, $event)"
          @change="handleFieldChange(field.key, $event)"
        />
      </el-form-item>

      <div
        class="flex items-center gap-2"
        :class="canActionsInSameLine ? 'justify-start' : 'col-span-full justify-end'"
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
          <ElButton
            v-if="showCollapseButton"
            text
            type="primary"
            @click="toggleCollapse"
          >
            {{ collapsed ? '展开' : '收起' }}
          </ElButton>
        </slot>
      </div>
    </div>
  </el-form>
</template>

<style scoped lang="postcss">
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
}
</style>
