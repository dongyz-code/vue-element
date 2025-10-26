<script setup lang="ts">
import type { ProFormField } from '@/components/ui/pro-form/types';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { ProForm } from '@/components/ui/pro-form';

const formModel = ref<Record<string, any>>({
  name: '',
  age: undefined,
  email: '',
  gender: '',
  hobbies: [],
  status: true,
  rating: 0,
  color: '#409eff',
  slider: 50,
  date: '',
  dateRange: [],
  time: '',
  region: [],
  description: '',
  city: '',
  fileList: [],
  transfer: [],
});

const formRef = ref();

const cities = [
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai' },
  { label: '广州', value: 'guangzhou' },
  { label: '深圳', value: 'shenzhen' },
  { label: '杭州', value: 'hangzhou' },
  { label: '成都', value: 'chengdu' },
];

const regionOptions = [
  {
    label: '华东',
    value: 'east',
    children: [
      { label: '上海', value: 'shanghai' },
      { label: '江苏', value: 'jiangsu' },
      { label: '浙江', value: 'zhejiang' },
    ],
  },
  {
    label: '华南',
    value: 'south',
    children: [
      { label: '广东', value: 'guangdong' },
      { label: '广西', value: 'guangxi' },
      { label: '海南', value: 'hainan' },
    ],
  },
  {
    label: '华北',
    value: 'north',
    children: [
      { label: '北京', value: 'beijing' },
      { label: '天津', value: 'tianjin' },
      { label: '河北', value: 'hebei' },
    ],
  },
];

const formOptions: ProFormField[] = [
  {
    key: 'name',
    label: '姓名',
    type: 'input',
    placeholder: '请输入姓名',
    colSpan: 1,
    rules: [
      { required: true, message: '请输入姓名', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
    ],
    defaultValue: '',
  },
  {
    key: 'age',
    label: '年龄',
    type: 'input-number',
    placeholder: '请输入年龄',
    colSpan: 1,
    props: {
      min: 1,
      max: 150,
    },
    rules: [{ required: true, message: '请输入年龄', trigger: 'change' }],
  },
  {
    key: 'email',
    label: '邮箱',
    type: 'input',
    placeholder: '请输入邮箱',
    colSpan: 1,
    rules: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
    ],
    defaultValue: '',
  },
  {
    key: 'gender',
    label: '性别',
    type: 'radio',
    colSpan: 1,
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' },
      { label: '其他', value: 'other' },
    ],
    defaultValue: '',
  },
  {
    key: 'city',
    label: '城市',
    type: 'select',
    placeholder: '请选择城市',
    colSpan: 1,
    options: cities,
    props: {
      clearable: true,
      filterable: true,
    },
    defaultValue: '',
  },
  {
    key: 'region',
    label: '地区',
    type: 'cascader',
    placeholder: '请选择地区',
    colSpan: 1,
    options: regionOptions,
    props: {
      multiple: true,
    },
    defaultValue: [],
  },
  {
    key: 'hobbies',
    label: '爱好',
    type: 'checkbox',
    colSpan: 2,
    options: [
      { label: '读书', value: 'reading' },
      { label: '运动', value: 'sports' },
      { label: '音乐', value: 'music' },
      { label: '旅游', value: 'travel' },
      { label: '游戏', value: 'gaming' },
    ],
    defaultValue: [],
  },
  {
    key: 'date',
    label: '日期',
    type: 'date',
    placeholder: '请选择日期',
    colSpan: 1,
    props: {
      type: 'date',
      valueFormat: 'YYYY-MM-DD',
    },
    defaultValue: '',
  },
  {
    key: 'dateRange',
    label: '日期范围',
    type: 'daterange',
    placeholder: '请选择日期范围',
    colSpan: 2,
    props: {
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      valueFormat: 'YYYY-MM-DD',
    },
    defaultValue: [],
  },
  {
    key: 'time',
    label: '时间',
    type: 'timeselect',
    placeholder: '请选择时间',
    colSpan: 1,
    props: {
      start: '08:00',
      end: '18:00',
      step: '00:30',
    },
    defaultValue: '',
  },
  {
    key: 'status',
    label: '状态',
    type: 'switch',
    colSpan: 1,
    props: {
      activeText: '启用',
      inactiveText: '禁用',
    },
    defaultValue: true,
  },
  {
    key: 'rating',
    label: '评分',
    type: 'rate',
    colSpan: 1,
    props: {
      allowHalf: true,
      showText: true,
    },
    defaultValue: 0,
  },
  {
    key: 'color',
    label: '颜色',
    type: 'color',
    colSpan: 1,
    props: {
      showAlpha: true,
    },
    defaultValue: '#409eff',
  },
  {
    key: 'slider',
    label: '滑块',
    type: 'slider',
    colSpan: 2,
    props: {
      showStops: true,
      step: 10,
    },
    defaultValue: 50,
  },
  {
    key: 'transfer',
    label: '穿梭框',
    type: 'transfer',
    colSpan: 4,
    options: [
      { label: '选项1', value: '1' },
      { label: '选项2', value: '2' },
      { label: '选项3', value: '3' },
      { label: '选项4', value: '4' },
      { label: '选项5', value: '5' },
      { label: '选项6', value: '6' },
    ],
    props: {
      titles: ['源列表', '目标列表'],
      filterable: true,
    },
    defaultValue: [],
  },
  {
    key: 'fileList',
    label: '文件上传',
    type: 'upload',
    colSpan: 2,
    placeholder: '点击上传',
    props: {
      action: '#',
      listType: 'text',
      limit: 3,
    },
    defaultValue: [],
  },
  {
    key: 'description',
    label: '描述',
    type: 'textarea',
    placeholder: '请输入描述',
    colSpan: 4,
    props: {
      rows: 3,
    },
    defaultValue: '',
  },
];

const dynamicFormOptions: ProFormField[] = [
  {
    key: 'showAdvanced',
    label: '显示高级选项',
    type: 'switch',
    colSpan: 1,
    defaultValue: false,
  },
  {
    key: 'advancedOption1',
    label: '高级选项1',
    type: 'input',
    placeholder: '请输入',
    colSpan: 1,
    visible: ({ model }) => model.showAdvanced === true,
    defaultValue: '',
  },
  {
    key: 'advancedOption2',
    label: '高级选项2',
    type: 'input',
    placeholder: '请输入',
    colSpan: 1,
    visible: ({ model }) => model.showAdvanced === true,
    defaultValue: '',
  },
];

const slotFormOptions: ProFormField[] = [
  {
    key: 'username',
    label: '用户名',
    type: 'input',
    placeholder: '请输入用户名',
    colSpan: 1,
    slot: true,
    defaultValue: '',
  },
  {
    key: 'password',
    label: '密码',
    type: 'input',
    placeholder: '请输入密码',
    colSpan: 1,
    defaultValue: '',
  },
];

function handleSubmit(values: Record<string, any>) {
  console.log('表单提交:', values);
  ElMessage.success('提交成功');
}

function handleReset() {
  console.log('表单重置');
  ElMessage.info('表单已重置');
}

function handleChange(key: string, value: any, model: Record<string, any>) {
  console.log('字段变化:', { key, value, model });
}

function handleToggle(collapsed: boolean) {
  console.log('折叠状态变化:', collapsed);
}

async function validateForm() {
  try {
    await formRef.value?.validate();
    ElMessage.success('校验通过');
  }
  catch {
    ElMessage.error('校验失败');
  }
}

function clearValidation() {
  formRef.value?.clearValidate();
  ElMessage.info('已清除校验');
}

function resetForm() {
  formRef.value?.resetFields();
  ElMessage.info('已重置表单');
}

const queryParams = ref<Record<string, any>>({});
const autocompleteModel = ref<Record<string, any>>({ autocomplete: '' });

function fetchSuggestions(queryString: string, cb: (suggestions: any[]) => void) {
  const results = queryString
    ? cities.filter(city => city.label.toLowerCase().includes(queryString.toLowerCase()))
    : cities;
  cb(results.map(city => ({ value: city.label })));
}
</script>

<template>
  <div class="demo-pro-form">
    <el-card class="demo-card">
      <template #header>
        <div class="card-header">
          <span>ProForm 组件示例</span>
        </div>
      </template>

      <!-- 基础表单 -->
      <div class="demo-section">
        <h3>基础表单</h3>
        <ProForm
          ref="formRef"
          v-model="formModel"
          :options="formOptions"
          :default-collapsed="true"
          @submit="handleSubmit"
          @reset="handleReset"
          @change="handleChange"
          @toggle="handleToggle"
        />
        <div class="mt-4 flex gap-2">
          <el-button @click="validateForm">
            手动校验
          </el-button>
          <el-button @click="clearValidation">
            清除校验
          </el-button>
          <el-button @click="resetForm">
            重置表单
          </el-button>
        </div>
        <div class="mt-4">
          <el-text tag="b">
            当前表单值：
          </el-text>
          <pre class="mt-2 p-4 bg-gray-100 rounded">{{ JSON.stringify(formModel, null, 2) }}</pre>
        </div>
      </div>

      <!-- 动态显隐 -->
      <div class="demo-section">
        <h3>动态显隐</h3>
        <ProForm
          v-model="queryParams"
          :options="dynamicFormOptions"
          :show-collapse="false"
          submit-text="查询"
          @submit="handleSubmit"
        />
        <div class="mt-4">
          <el-text tag="b">
            当前表单值：
          </el-text>
          <pre class="mt-2 p-4 bg-gray-100 rounded">{{ JSON.stringify(queryParams, null, 2) }}</pre>
        </div>
      </div>

      <!-- 自定义插槽 -->
      <div class="demo-section">
        <h3>自定义插槽</h3>
        <ProForm
          v-model="queryParams"
          :options="slotFormOptions"
          :show-collapse="false"
        >
          <template #field-username="{ model }">
            <div class="flex items-center gap-2">
              <el-input v-model="model.username" placeholder="自定义插槽" />
              <el-tooltip content="用户名必须唯一">
                <el-icon>
                  <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm0 832a384 384 0 1 0 0-768 384 384 0 0 0 0 768zm48-176a48 48 0 1 1-96 0 48 48 0 0 1 96 0zm-48-464a32 32 0 0 1 32 32v288a32 32 0 0 1-64 0V288a32 32 0 0 1 32-32z" />
                  </svg>
                </el-icon>
              </el-tooltip>
            </div>
          </template>

          <template #actions="{ collapsed, toggle }">
            <el-button type="primary">
              自定义提交
            </el-button>
            <el-button>自定义重置</el-button>
            <el-button v-if="collapsed !== undefined" @click="toggle">
              {{ collapsed ? '展开' : '收起' }}
            </el-button>
          </template>
        </ProForm>
      </div>

      <!-- Autocomplete 示例 -->
      <div class="demo-section">
        <h3>自动完成</h3>
        <ProForm
          v-model="autocompleteModel"
          :options="[
            {
              key: 'autocomplete',
              label: '城市搜索',
              type: 'autocomplete',
              placeholder: '输入城市名称',
              colSpan: 2,
              props: {
                fetchSuggestions,
              },
              defaultValue: '',
            },
          ]"
          :show-collapse="false"
        />
      </div>

      <!-- 无折叠按钮 -->
      <div class="demo-section">
        <h3>无折叠按钮</h3>
        <ProForm
          v-model="queryParams"
          :options="[
            {
              key: 'keyword',
              label: '关键词',
              type: 'input',
              placeholder: '请输入关键词',
              colSpan: 2,
              defaultValue: '',
            },
            {
              key: 'status',
              label: '状态',
              type: 'select',
              placeholder: '请选择状态',
              colSpan: 1,
              options: [
                { label: '全部', value: '' },
                { label: '启用', value: '1' },
                { label: '禁用', value: '0' },
              ],
              defaultValue: '',
            },
          ]"
          :show-collapse="false"
          submit-text="搜索"
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.demo-pro-form {
  padding: 20px;

  .demo-card {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 18px;
      font-weight: 600;
    }
  }

  .demo-section {
    margin-bottom: 40px;

    &:last-child {
      margin-bottom: 0;
    }

    h3 {
      margin-bottom: 16px;
      color: #303133;
      font-size: 16px;
      font-weight: 600;
    }

    pre {
      font-size: 12px;
      line-height: 1.5;
      max-height: 400px;
      overflow: auto;
    }
  }
}
</style>
