export type Theme = {
  element_theme?: {
    /** 主题色 */
    primary?: string;
    /** 信息色 */
    info?: string;
    /** 警告色 */
    warning?: string;
    /** 成功色 */
    success?: string;
    /** 危险色 */
    danger?: string;
  };
  colors?: {
    '--color-primary'?: string;
  };
};
