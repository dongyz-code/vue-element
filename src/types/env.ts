/**
 * 项目基础设置
 */
export type APP_CONFIG = {
  /** 环境变量 */
  NODE_ENV: 'development' | 'test' | 'uat' | 'production';
  /** 应用 */
  APP_KEY: 'default';
  /** API基础路径 */
  API_BASE_URL: string;
};
