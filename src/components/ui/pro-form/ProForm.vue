<script setup lang="ts">
import type { FormInstance } from 'element-plus';
import type { ProFormEmits, ProFormExpose, ProFormField, ProFormProps } from './types';
import { computed, ref } from 'vue';

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

const formRef = ref<FormInstance>();
const collapsed = ref(props.defaultCollapsed);

const internalModel = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  },
});

const visibleFields = computed(() => {
  return props.options.filter((field) => {
    if (field.visible === undefined)
      return true;
    if (typeof field.visible === 'boolean')
      return field.visible;
    return field.visible({ model: internalModel.value });
  });
});

const needCollapse = computed(() => {
  if (!props.showCollapse)
    return false;
  let totalSpan = 0;
  for (const field of visibleFields.value) {
    totalSpan += field.colSpan || 1;
  }
  return totalSpan > props.collapseToRows * 4;
});

const displayFields = computed(() => {
  if (!needCollapse.value || !collapsed.value) {
    return visibleFields.value;
  }

  const maxSpan = props.collapseToRows * 4;
  let currentSpan = 0;
  const result: ProFormField[] = [];

  for (const field of visibleFields.value) {
    const fieldSpan = field.colSpan || 1;
    if (currentSpan + fieldSpan <= maxSpan) {
      result.push(field);
      currentSpan += fieldSpan;
    }
    else {
      break;
    }
  }

  return result;
});

function handleFieldChange(key: string, value: any) {
  emit('change', key, value, internalModel.value);
}

function toggleCollapse() {
  collapsed.value = !collapsed.value;
  emit('toggle', collapsed.value);
}

async function handleSubmit() {
  try {
    await formRef.value?.validate();
    emit('submit', { ...internalModel.value });
  }
  catch (error) {
    console.error('Form validation failed:', error);
  }
}

function handleReset() {
  const resetValues: Record<string, any> = {};
  props.options.forEach((field) => {
    resetValues[field.key] = field.defaultValue !== undefined ? field.defaultValue : undefined;
  });
  internalModel.value = resetValues;
  formRef.value?.clearValidate();
  emit('reset');
}

function getFieldRules(field: ProFormField) {
  return field.rules || props.rules?.[field.key] || [];
}

function getSlotName(field: ProFormField) {
  if (typeof field.slot === 'string')
    return field.slot;
  if (field.slot === true)
    return `field-${field.key}`;
  return null;
}

function getColSpanStyle(colSpan?: number) {
  if (!colSpan || colSpan === 1)
    return {};
  return {
    gridColumn: `span ${Math.min(colSpan, 4)}`,
  };
}

async function validate() {
  await formRef.value?.validate();
}

function clearValidate() {
  formRef.value?.clearValidate();
}

function resetFields() {
  handleReset();
}

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
          <!-- 自定义插槽 -->
          <slot
            v-if="getSlotName(field)"
            :name="getSlotName(field)!"
            :model="internalModel"
            :field="field"
          />

          <!-- Input -->
          <el-input
            v-else-if="field.type === 'input'"
            v-model="internalModel[field.key]"
            :placeholder="field.placeholder"
            v-bind="field.options"
            @change="handleFieldChange(field.key, internalModel[field.key])"
          />

          <!-- Textarea -->
          <el-input
            v-else-if="field.type === 'textarea'"
            v-model="internalModel[field.key]"
            type="textarea"
            :placeholder="field.placeholder"
            v-bind="field.options"
            @change="handleFieldChange(field.key, internalModel[field.key])"
          />

          <!-- InputNumber -->
          <el-input-number
            v-else-if="field.type === 'input-number'"
            v-model="internalModel[field.key]"
            :placeholder="field.placeholder"
            v-bind="field.options"
            @change="handleFieldChange(field.key, internalModel[field.key])"
          />

          <!-- Select -->
          <el-select
            v-else-if="field.type === 'select'"
            v-model="internalModel[field.key]"
            :placeholder="field.placeholder"
            v-bind="field.options"
            @change="handleFieldChange(field.key, internalModel[field.key])"
          >
            <el-option
              v-for="option in field.choices"
              :key="option.value"
              :label="option.label"
              :value="option.value"
              :disabled="option.disabled"
            />
          </el-select>

          <!-- Cascader -->
          <el-cascader
            v-else-if="field.type === 'cascader'"
            v-model="internalModel[field.key]"
            :options="field.choices"
            :placeholder="field.placeholder"
            v-bind="field.options"
            @change="handleFieldChange(field.key, internalModel[field.key])"
          />

          <!-- DatePicker -->
          <el-date-picker
            v-else-if="field.type === 'date'"
            v-model="internalModel[field.key]"
            :placeholder="field.placeholder"
            v-bind="field.options"
            @change="handleFieldChange(field.key, internalModel[field.key])"
          />

          <!-- DatePicker Range -->
          <el-date-picker
            v-else-if="field.type === 'daterange'"
            v-model="internalModel[field.key]"
            type="daterange"
            :placeholder="field.placeholder"
            v-bind="field.options"
            @change="handleFieldChange(field.key, internalModel[field.key])"
          />

          <!-- TimePicker -->
          <el-time-picker
            v-else-if="field.type === 'time'"
            v-model="internalModel[field.key]"
            :placeholder="field.placeholder"
            v-bind="field.options"
            @change="handleFieldChange(field.key, internalModel[field.key])"
          />

          <!-- TimeSelect -->
          <el-time-select
            v-else-if="field.type === 'timeselect'"
            v-model="internalModel[field.key]"
            :placeholder="field.placeholder"
            v-bind="field.options"
            @change="handleFieldChange(field.key, internalModel[field.key])"
          />

          <!-- Switch -->
          <el-switch
            v-else-if="field.type === 'switch'"
            v-model="internalModel[field.key]"
            v-bind="field.options"
            @change="handleFieldChange(field.key, internalModel[field.key])"
          />

          <!-- Checkbox Group -->
          <el-checkbox-group
            v-else-if="field.type === 'checkbox'"
            v-model="internalModel[field.key]"
            v-bind="field.options"
            @change="handleFieldChange(field.key, internalModel[field.key])"
          >
            <el-checkbox
              v-for="option in field.choices"
              :key="option.value"
              :label="option.value"
              :disabled="option.disabled"
            >
              {{ option.label }}
            </el-checkbox>
          </el-checkbox-group>

          <!-- Radio Group -->
          <el-radio-group
            v-else-if="field.type === 'radio'"
            v-model="internalModel[field.key]"
            v-bind="field.options"
            @change="handleFieldChange(field.key, internalModel[field.key])"
          >
            <el-radio
              v-for="option in field.choices"
              :key="option.value"
              :label="option.value"
              :disabled="option.disabled"
            >
              {{ option.label }}
            </el-radio>
          </el-radio-group>

          <!-- Rate -->
          <el-rate
            v-else-if="field.type === 'rate'"
            v-model="internalModel[field.key]"
            v-bind="field.options"
            @change="handleFieldChange(field.key, internalModel[field.key])"
          />

          <!-- ColorPicker -->
          <el-color-picker
            v-else-if="field.type === 'color'"
            v-model="internalModel[field.key]"
            v-bind="field.options"
            @change="handleFieldChange(field.key, internalModel[field.key])"
          />

          <!-- Slider -->
          <el-slider
            v-else-if="field.type === 'slider'"
            v-model="internalModel[field.key]"
            v-bind="field.options"
            @change="handleFieldChange(field.key, internalModel[field.key])"
          />

          <!-- Transfer -->
          <el-transfer
            v-else-if="field.type === 'transfer'"
            v-model="internalModel[field.key]"
            :data="field.choices"
            :props="{ key: 'value', label: 'label', disabled: 'disabled', ...field.options?.props }"
            v-bind="field.options"
            @change="handleFieldChange(field.key, internalModel[field.key])"
          />

          <!-- Upload -->
          <el-upload
            v-else-if="field.type === 'upload'"
            v-model:file-list="internalModel[field.key]"
            v-bind="field.options"
            @change="handleFieldChange(field.key, internalModel[field.key])"
          >
            <el-button type="primary">
              {{ field.placeholder || '点击上传' }}
            </el-button>
          </el-upload>

          <!-- Autocomplete -->
          <el-autocomplete
            v-else-if="field.type === 'autocomplete'"
            v-model="internalModel[field.key]"
            :placeholder="field.placeholder"
            v-bind="field.options"
            @change="handleFieldChange(field.key, internalModel[field.key])"
          />
        </el-form-item>

        <!-- 操作按钮区域 -->
        <div class="flex items-center justify-end gap-2" :style="getColSpanStyle(4)">
          <slot name="actions" :collapsed="collapsed" :toggle="toggleCollapse">
            <el-button type="primary" @click="handleSubmit">
              {{ submitText }}
            </el-button>
            <el-button @click="handleReset">
              {{ resetText }}
            </el-button>
            <el-button v-if="needCollapse" type="text" @click="toggleCollapse">
              {{ collapsed ? '展开' : '收起' }}
              <el-icon :class="{ 'rotate-180': !collapsed }">
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M831.872 340.864 512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728 30.592 30.592 0 0 0-42.752 0z" />
                </svg>
              </el-icon>
            </el-button>
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
