import type { ThemeConfig } from '../types';

/**
 * 默认主题
 */
const theme: ThemeConfig = {
  element_theme: {
    primary: '#165DFF',
    info: '#303030',
    warning: '#FF7D00',
    danger: '#F53F3F',
    success: '#00B42A',
  },
  colors: {
    /** 文字 */
    '--el-text-color-primary': '#121314',
    '--el-text-color-regular': '#5C5C5C',
    '--el-text-color-secondary': '#909399',
    '--el-text-color-placeholder': '#909399',
    '--el-text-color-disabled': '#C2C2C2',
    /** 线条 */
    '--el-border-color': '#E5E6EB',
    '--el-border-color-light': '#E4E7ED',
    '--el-border-color-lighter': '#EBEEF5',
    '--el-border-color-extra-light': '#F2F6FC',
    '--el-border-color-dark': '#D4D7DE',
    '--el-border-color-darker': '#CDD0D6',
  },
};

export default theme;
