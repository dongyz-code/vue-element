<script lang="ts" setup>
import type { DialogProps } from './types';
import { computed, ref, watch } from 'vue';

const props = withDefaults(defineProps<DialogProps>(), {
  title: '',
  width: '50%',
  top: '15vh',
  modal: true,
  lockScroll: true,
  closeOnClickModal: true,
  closeOnPressEscape: true,
  showClose: true,
  beforeClose: undefined,
  center: false,
  alignCenter: false,
  destroyOnClose: false,
  draggable: false,
  appendToBody: false,
  zIndex: 2000,
  confirmText: '确定',
  cancelText: '取消',
  showConfirmButton: true,
  showCancelButton: true,
  confirmButtonType: 'primary',
  cancelButtonType: 'default',
  loading: false,
  confirmLoading: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'open': [];
  'opened': [];
  'close': [];
  'closed': [];
  'confirm': [];
  'cancel': [];
  'before-close': [done: () => void];
}>();

// 内部状态
const visible = defineModel({ default: false });
const isConfirmLoading = ref(false);

// 计算属性
const dialogProps = computed(() => ({
  'modelValue': visible.value,
  'title': props.title,
  'width': props.width,
  'top': props.top,
  'modal': props.modal,
  'lock-scroll': props.lockScroll,
  'close-on-click-modal': props.closeOnClickModal,
  'close-on-press-escape': props.closeOnPressEscape,
  'show-close': props.showClose,
  'before-close': handleBeforeClose,
  'center': props.center,
  'align-center': props.alignCenter,
  'destroy-on-close': props.destroyOnClose,
  'draggable': props.draggable,
  'append-to-body': props.appendToBody,
  'z-index': props.zIndex,
}));

// 处理关闭前的回调
function handleBeforeClose(done: () => void) {
  if (props.beforeClose) {
    props.beforeClose(done);
  }
  else {
    done();
  }
}

// 打开对话框
function open() {
  visible.value = true;
  emit('open');
}

// 关闭对话框
function close() {
  visible.value = false;
  emit('close');
}

// 确认按钮点击
async function handleConfirm() {
  if (props.confirmLoading || isConfirmLoading.value)
    return;

  try {
    isConfirmLoading.value = true;
    emit('confirm');
  }
  finally {
    isConfirmLoading.value = false;
  }
}

// 取消按钮点击
function handleCancel() {
  emit('cancel');
  close();
}

// 对话框打开后
function handleOpened() {
  emit('opened');
}

// 对话框关闭后
function handleClosed() {
  emit('closed');
}

// 暴露方法给父组件
defineExpose({
  open,
  close,
  visible: computed(() => visible.value),
});
</script>

<template>
  <el-dialog
    v-bind="dialogProps"
    @opened="handleOpened"
    @closed="handleClosed"
  >
    <!-- 头部插槽 -->
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>

    <!-- 默认插槽 - 内容区域 -->
    <slot></slot>

    <!-- 底部插槽 -->
    <template v-if="$slots.footer || showConfirmButton || showCancelButton" #footer>
      <slot name="footer">
        <div class="dialog-footer">
          <el-button
            v-if="showCancelButton"
            :type="cancelButtonType"
            @click="handleCancel"
          >
            {{ cancelText }}
          </el-button>
          <el-button
            v-if="showConfirmButton"
            :type="confirmButtonType"
            :loading="confirmLoading || isConfirmLoading"
            @click="handleConfirm"
          >
            {{ confirmText }}
          </el-button>
        </div>
      </slot>
    </template>
  </el-dialog>
</template>

<style lang="postcss" scoped>
.dialog-footer {
  @apply flex justify-end gap-3;
}
</style>
