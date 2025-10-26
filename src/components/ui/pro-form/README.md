# ProForm 组件

生产级别的表单组件，支持多种字段类型、响应式布局、动态选项等功能。

## 目录结构

```
pro-form/
├── field-renderers/          # 字段渲染器目录
│   ├── base.ts               # 基础字段渲染器（input、textarea、input-number）
│   ├── options.ts            # 选项类字段渲染器（select、cascader、checkbox、radio、transfer）
│   ├── others.ts             # 其他字段渲染器（date、time、switch、rate等）
│   ├── types.ts              # 渲染器类型定义
│   └── index.ts              # 统一导出
├── ProForm.vue               # 主表单组件
├── ProFormField.vue          # 单个字段组件
├── useProForm.ts             # 表单级别逻辑 Hook
├── useProFormField.ts        # 字段级别逻辑 Hook
├── useResponsiveCols.ts      # 响应式列数管理 Hook
├── types.ts                  # 类型定义
├── index.ts                  # 组件导出
└── README.md                 # 本文档
```

## 组件架构

### 1. ProForm（主组件）

- 负责整体布局和表单管理
- 处理表单提交、重置、校验
- 管理折叠/展开状态
- 支持自定义插槽

### 2. ProFormField（字段组件）

- 负责单个字段的渲染
- 自动处理 options 的异步加载
- 支持字段级别的加载状态
- 与字段渲染器配合工作

### 3. Field Renderers（字段渲染器）

将字段渲染逻辑按类型拆分：

- **base.ts**: 基础输入类字段
- **options.ts**: 选项类字段（需要 options 数据）
- **others.ts**: 其他特殊字段

优点：

- 代码更清晰、易维护
- 易于扩展新字段类型
- 便于单元测试

### 4. Hooks

- **useProForm**: 表单级别的状态和逻辑
- **useProFormField**: 字段级别的状态和逻辑（如 options 加载）
- **useResponsiveCols**: 响应式列数计算

## 核心功能

### 1. Label 位置控制

```vue
<ProForm
  label-position="top"  <!-- 或 "left" -->
  :options="fields"
/>
```

### 2. 智能响应式布局

- 自动根据屏幕宽度调整列数
- > = 1280px: 4列
- 1024-1279px: 3列
- 768-1023px: 2列
- < 768px: 1列

### 3. 动态 Options 支持

```typescript
// 1. 静态数组
options: [{ label: 'A', value: 1 }]

// 2. Ref
const options = ref([...])

// 3. Computed
const options = computed(() => [...])

// 4. 同步函数
options: () => [...]

// 5. 异步函数
options: async () => {
  const data = await fetchData()
  return data
}
```

### 4. 字段折叠/展开

- 自动计算是否需要折叠
- 按钮智能换行
- 支持自定义折叠行数

### 5. 字段插槽

```vue
<ProForm :options="fields">
  <template #field-username="{ model, setValue }">
    <CustomInput v-model="model.username" />
  </template>
</ProForm>
```

## 扩展指南

### 添加新字段类型

1. 在 `types.ts` 中添加字段类型定义：

```typescript
export type CustomField = ProFormFieldBase & {
  type: 'custom';
  customProp?: any;
  props?: Partial<CustomComponentProps>;
};
```

2. 在 `ProFormField` 联合类型中添加：

```typescript
export type ProFormField
  = | InputField
    | CustomField  // 新增
    | ...
```

3. 在 `field-renderers` 中创建渲染函数：

```typescript
// field-renderers/custom.ts
export function renderCustom(ctx: FieldRenderContext): FieldRenderConfig {
  return {
    component: CustomComponent,
    props: {
      modelValue: ctx.value,
      'onUpdate:modelValue': ctx.onChange,
      ...ctx,
    },
  };
}
```

4. 在 `ProFormField.vue` 中添加 case：

```typescript
case 'custom':
  return renderCustom(ctx);
```

### 自定义字段渲染器

如果需要完全自定义字段渲染，可以使用插槽：

```vue
<ProForm :options="fields">
  <template #field-custom="{ field, value, setValue }">
    <YourCustomComponent
      :value="value"
      @update:value="setValue"
    />
  </template>
</ProForm>
```

## 最佳实践

### 1. Options 缓存

异步加载的 options 会自动缓存，避免重复请求。缓存基于 `field.key`。

### 2. 性能优化

- 字段组件已实现细颗粒度更新
- 只有变化的字段会重新渲染
- Options 加载与渲染解耦

### 3. 类型安全

所有 API 都有完整的 TypeScript 类型定义，IDE 会提供智能提示。

### 4. 代码组织

- 表单级逻辑放在 `useProForm`
- 字段级逻辑放在 `useProFormField`
- 渲染逻辑放在 `field-renderers`

## API

详见 `types.ts` 中的类型定义。

## 示例

完整示例见 `/src/pages/demo/pro-form/index.vue`
