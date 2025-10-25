<script setup lang="ts">
import type { ProTableColumn } from '@/components/ui/pro-table/types';
import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import ProTable from '@/components/ui/pro-table/index.vue';

interface UserData {
  id: number;
  name: string;
  email: string;
  age: number;
  status: number;
  department: string;
}

const loading = ref(false);
const tableData = ref<UserData[]>([]);
const selectedRows = ref<UserData[]>([]);

const pageConfig = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
  pageSizes: [10, 20, 50],
  layout: 'total, sizes, prev, pager, next',
});

const columns: ProTableColumn<UserData>[] = [
  {
    prop: 'id',
    label: 'ID',
    width: 80,
    sortable: true,
  },
  {
    prop: 'name',
    label: '姓名',
    width: 120,
    sortable: true,
  },
  {
    prop: 'email',
    label: '邮箱',
    width: 200,
  },
  {
    prop: 'age',
    label: '年龄',
    width: 80,
    sortable: true,
  },
  {
    prop: 'status',
    label: '状态',
    width: 100,
    slot: 'status',
  },
  {
    prop: 'department',
    label: '部门',
    width: 120,
  },
  {
    prop: 'actions',
    label: '操作',
    width: 150,
    slot: 'actions',
    fixed: 'right',
  },
];

// 生成模拟数据
function generateData(count: number): UserData[] {
  const names = ['张三', '李四', '王五', '赵六', '钱七'];
  const departments = ['技术部', '产品部', '运营部', '市场部'];

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: names[Math.floor(Math.random() * names.length)]!,
    email: `user${index + 1}@example.com`,
    age: 20 + Math.floor(Math.random() * 30),
    status: Math.random() > 0.5 ? 1 : 0,
    department: departments[Math.floor(Math.random() * departments.length)]!,
  }));
}

function handleSelectionChange(selection: UserData[]) {
  selectedRows.value = selection;
  console.log('选择变化:', selection);
}

function handlePageChange(page: number, pageSize: number) {
  console.log('分页变化:', { page, pageSize });
  pageConfig.currentPage = page;
  pageConfig.pageSize = pageSize;
  loadData();
}

function handleEdit(row: UserData) {
  ElMessage.info(`编辑用户: ${row.name}`);
}

function handleDelete(row: UserData) {
  ElMessage.warning(`删除用户: ${row.name}`);
}

function handleClearSelection() {
  selectedRows.value = [];
  ElMessage.info('已清空选择');
}

async function loadData() {
  loading.value = true;
  try {
    // 模拟 API 请求
    await new Promise(resolve => setTimeout(resolve, 500));

    const allData = generateData(50);
    const start = (pageConfig.currentPage - 1) * pageConfig.pageSize;
    const end = start + pageConfig.pageSize;

    tableData.value = allData.slice(start, end);
    pageConfig.total = allData.length;
  }
  finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="simple-demo">
    <h2>ProTable 简单示例</h2>

    <el-card>
      <ProTable
        :data="tableData"
        :columns="columns"
        :loading="loading"
        :selected-rows="selectedRows"
        :page-config="pageConfig"
        @selection-change="handleSelectionChange"
        @page-change="handlePageChange"
      >
        <!-- 自定义状态列 -->
        <template #status="{ value }">
          <el-tag :type="value === 1 ? 'success' : 'danger'">
            {{ value === 1 ? '启用' : '禁用' }}
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

      <div v-if="selectedRows.length > 0" class="selected-info">
        <p>已选择 {{ selectedRows.length }} 条记录</p>
        <el-button @click="handleClearSelection">
          清空选择
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.simple-demo {
  padding: 20px;

  h2 {
    margin-bottom: 20px;
    color: #303133;
  }

  .selected-info {
    margin-top: 16px;
    padding: 12px;
    background-color: #f5f7fa;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    p {
      margin: 0;
      color: #606266;
    }
  }
}
</style>
