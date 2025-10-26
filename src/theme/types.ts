export type ThemeConfig = {
  element_theme: {
    /** 主题色 */
    primary: string;
    /** 信息色 */
    info: string;
    /** 警告色 */
    warning: string;
    /** 成功色 */
    success: string;
    /** 危险色 */
    danger: string;
  };
  colors: {
    /** 文字 */
    '--el-text-color-primary': string;
    '--el-text-color-regular': string;
    '--el-text-color-secondary': string;
    '--el-text-color-placeholder': string;
    '--el-text-color-disabled': string;
    /** 线条 */
    '--el-border-color': string;
    '--el-border-color-light': string;
    '--el-border-color-lighter': string;
    '--el-border-color-extra-light': string;
    '--el-border-color-dark': string;
    '--el-border-color-darker': string;
  };
};

export type ThemeKey = 'default';
