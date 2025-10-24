<script setup lang="ts">
import type { ProTableColumn } from '@/components/ui/pro-table/types';
import { ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import ProTable from '@/components/ui/pro-table/index.vue';

// 数据类型定义
interface UserData {
  id: number;
  name: string;
  email: string;
  age: number;
  status: number;
  avatar: string;
  createTime: string;
  department: string;
}

// 响应式数据
const loading = ref(false);
const tableData = ref<UserData[]>([]);
const selectedRows = ref<UserData[]>([]);
const crossPageSelectedRows = ref<UserData[]>([]);
const singleSelectedRows = ref<UserData[]>([]);

// 分页配置
const pageConfig = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
  pageSizes: [10, 20, 50, 100],
  layout: 'total, sizes, prev, pager, next, jumper',
});

// 列配置
const columns: ProTableColumn<UserData>[] = [
  {
    prop: 'id',
    label: 'ID',
    width: 80,
    sortable: true,
  },
  {
    prop: 'avatar',
    label: '头像',
    width: 100,
    slot: 'avatar',
  },
  {
    prop: 'name',
    label: '姓名',
    width: 120,
    sortable: true,
    filterOptions: [
      { label: '张三', value: '张三' },
      { label: '李四', value: '李四' },
      { label: '王五', value: '王五' },
    ],
  },
  {
    prop: 'email',
    label: '邮箱',
    width: 200,
    sortable: true,
  },
  {
    prop: 'age',
    label: '年龄',
    width: 80,
    sortable: true,
    filterOptions: [
      { label: '20-30', value: '20-30' },
      { label: '30-40', value: '30-40' },
      { label: '40-50', value: '40-50' },
    ],
  },
  {
    prop: 'status',
    label: '状态',
    width: 100,
    slot: 'status',
    filterOptions: [
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 },
    ],
  },
  {
    prop: 'department',
    label: '部门',
    minWidth: 120,
    filterOptions: [
      { label: '技术部', value: '技术部' },
      { label: '产品部', value: '产品部' },
      { label: '运营部', value: '运营部' },
    ],
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 180,
    sortable: true,
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
function generateMockData(count: number): UserData[] {
  const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十'];
  const departments = ['技术部', '产品部', '运营部', '市场部', '人事部'];
  const statuses = [0, 1];

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: names[Math.floor(Math.random() * names.length)]!,
    email: `user${index + 1}@example.com`,
    age: 20 + Math.floor(Math.random() * 30),
    status: statuses[Math.floor(Math.random() * statuses.length)]!,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${index}`,
    createTime: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleString(),
    department: departments[Math.floor(Math.random() * departments.length)]!,
  }));
}

// 获取状态类型
function getStatusType(status: number) {
  return status === 1 ? 'success' : 'danger';
}

// 获取状态文本
function getStatusText(status: number) {
  return status === 1 ? '启用' : '禁用';
}

// 事件处理
function handlePageChange(page: number, pageSize: number) {
  console.log('分页变化:', { page, pageSize });
  pageConfig.currentPage = page;
  pageConfig.pageSize = pageSize;
  loadData();
}

function handleSortChange(sort: { prop: string; order: 'asc' | 'desc' | null }) {
  console.log('排序变化:', sort);
  // 这里可以实现服务端排序逻辑
}

function handleFilterChange(filters: Record<string, any[]>) {
  console.log('筛选变化:', filters);
  // 这里可以实现服务端筛选逻辑
}

function handleRowClick(row: UserData) {
  console.log('行点击:', row);
}

function handleSelectionChange(selection: UserData[]) {
  selectedRows.value = selection;
  console.log('多选变化:', selection);
}

function handleCrossPageSelectionChange(selection: UserData[]) {
  crossPageSelectedRows.value = selection;
  console.log('跨页多选变化:', selection);
}

function handleSingleSelectionChange(selection: UserData[]) {
  singleSelectedRows.value = selection;
  console.log('单选变化:', selection);
}

function handleAdd() {
  ElMessage.info('新增功能');
}

function handleEdit(row: UserData) {
  ElMessage.info(`编辑用户: ${row.name}`);
}

async function handleDelete(row: UserData) {
  try {
    await ElMessageBox.confirm('确定要删除这条记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    ElMessage.success('删除成功');
  }
  catch {
    ElMessage.info('已取消删除');
  }
}

async function handleBatchDelete() {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 条记录吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    ElMessage.success('批量删除成功');
    selectedRows.value = [];
  }
  catch {
    ElMessage.info('已取消删除');
  }
}

function handleClearSelection() {
  selectedRows.value = [];
  crossPageSelectedRows.value = [];
  singleSelectedRows.value = [];
  ElMessage.info('已清空选择');
}

// 加载数据
async function loadData() {
  loading.value = true;
  try {
    // 模拟 API 请求
    await new Promise(resolve => setTimeout(resolve, 1000));

    const allData = generateMockData(100);
    const start = (pageConfig.currentPage - 1) * pageConfig.pageSize;
    const end = start + pageConfig.pageSize;

    tableData.value = allData.slice(start, end);
    pageConfig.total = allData.length;
  }
  finally {
    loading.value = false;
  }
}

// 初始化
onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="demo-pro-table">
    <el-card class="demo-card">
      <template #header>
        <div class="card-header">
          <span>ProTable 组件示例</span>
          <div class="header-actions">
            <el-button @click="handleAdd">
              新增
            </el-button>
            <el-button :disabled="selectedRows.length === 0" @click="handleBatchDelete">
              批量删除 ({{ selectedRows.length }})
            </el-button>
            <el-button @click="handleClearSelection">
              清空选择
            </el-button>
          </div>
        </div>
      </template>

      <!-- 基础表格 -->
      <div class="demo-section">
        <h3>基础表格</h3>
        <ProTable
          :data="tableData"
          :columns="columns"
          :loading="loading"
          :pagination="{
            size: 10,
          }"
          :page-config="pageConfig"
          @page-change="handlePageChange"
          @sort-change="handleSortChange"
          @filter-change="handleFilterChange"
          @row-click="handleRowClick"
        />
      </div>

      <!-- 带选择的表格 -->
      <div class="demo-section">
        <h3>多选表格</h3>
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
      </div>

      <!-- 跨页多选表格 -->
      <div class="demo-section">
        <h3>跨页多选表格</h3>
        <ProTable
          :data="tableData"
          :columns="columns"
          :loading="loading"
          :selected-rows="crossPageSelectedRows"
          :page-config="pageConfig"
          @selection-change="handleCrossPageSelectionChange"
          @page-change="handlePageChange"
        >
          <!-- 自定义头像列 -->
          <template #avatar="{ row, value }">
            <el-avatar :src="value" :size="40">
              {{ row.name?.charAt(0) }}
            </el-avatar>
          </template>
        </ProTable>
      </div>

      <!-- 单选表格 -->
      <div class="demo-section">
        <h3>单选表格</h3>
        <ProTable
          :data="tableData"
          :columns="columns"
          :loading="loading"
          :selected-rows="singleSelectedRows"
          :page-config="pageConfig"
          @selection-change="handleSingleSelectionChange"
          @page-change="handlePageChange"
        />
      </div>

      <!-- 无分页表格 -->
      <div class="demo-section">
        <h3>无分页表格</h3>
        <ProTable
          :data="tableData"
          :columns="columns"
          :loading="loading"
          :stripe="true"
          :border="true"
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.demo-pro-table {
  padding: 20px;

  .demo-card {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .header-actions {
        display: flex;
        gap: 8px;
      }
    }
  }

  .demo-section {
    margin-bottom: 40px;

    h3 {
      margin-bottom: 16px;
      color: #303133;
      font-size: 16px;
      font-weight: 600;
    }
  }
}
</style>
