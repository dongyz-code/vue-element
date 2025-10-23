/**
 * 主题 本地缓存Key
 */
export const THEME_KEY = 'THEME';

const themeMap = {
  default: () => import('./default'),
};

export function useTheme() {

}
