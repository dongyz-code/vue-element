<script setup lang="ts">
import type { ProFormEmits, ProFormExpose, ProFormProps } from './types';

import { VIcon } from '..';
import ProFormField from './ProFormField.vue';
import { useProForm } from './useProForm';

const props = withDefaults(defineProps<ProFormProps>(), {
  labelWidth: '100px',
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
  optionsCache,
  toggleCollapse,
  handleSubmit,
  handleReset,
  handleFieldChange,
  getFieldRules,
  getSlotName,
  getColSpanStyle,
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
      :label-width="labelPosition === 'top' ? undefined : labelWidth"
      :label-position="labelPosition"
      v-bind="formProps"
    >
      <div
        class="grid gap-4"
        :class="{
          'grid-cols-1': currentCols === 1,
          'grid-cols-2': currentCols === 2,
          'grid-cols-3': currentCols === 3,
          'grid-cols-4': currentCols === 4,
        }"
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
            :name="getSlotName(field)!"
            :field="field"
            :model="internalModel"
            :value="internalModel[field.key]"
            :set-value="(val: any) => { internalModel[field.key] = val }"
            :form="formRef"
          />

          <ProFormField
            v-else
            :field="field"
            :model-value="internalModel[field.key]"
            :options-cache="optionsCache"
            @update:model-value="internalModel[field.key] = $event"
            @change="handleFieldChange(field.key, $event)"
          />
        </el-form-item>

        <div
          :class="[
            canActionsInSameLine ? 'justify-start' : 'col-span-full justify-end',
          ]"
          class="flex items-center gap-2"
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
