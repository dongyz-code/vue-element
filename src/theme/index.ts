import type { ThemeConfig, ThemeKey } from './types';

import { merge } from 'lodash-es';
import { watchEffect } from 'vue';
import { useAppStore } from '@/store';
import { genMixColor, getKeys } from '@/utils';
import defaultTheme from './default';

const themeMap: Record<ThemeKey, () => Promise<{ default: ThemeConfig }>> = {
  default: () => import('./default'),
};

export function useTheme() {
  const appStore = useAppStore();

  function setStyleProperty(propName: string, value: string) {
    document.documentElement.style.setProperty(propName, value);
  }

  function updateThemeColorVar({ colors, element_theme }: ThemeConfig) {
    // 遍历当前主题色，生成混合色，并更新到css变量（tailwind + elementPlus）
    getKeys(element_theme).forEach((brand) => {
      updateBrandExtendColorsVar(element_theme[brand], brand);
    });

    getKeys(colors).forEach((key) => {
      setStyleProperty(key, colors[key]);
    });

    function updateBrandExtendColorsVar(color: string, name: string) {
      const { DEFAULT, dark, light } = genMixColor(color);
      // 每种主题色由浅到深分为五个阶梯以供开发者使用。
      setStyleProperty(`--${name}-lighter-color`, light[5]);
      setStyleProperty(`--${name}-light-color`, light[3]);
      setStyleProperty(`--${name}-color`, DEFAULT);
      setStyleProperty(`--${name}-deep-color`, dark[2]);
      setStyleProperty(`--${name}-deeper-color`, dark[4]);

      // elementPlus主题色更新
      setStyleProperty(`--el-color-${name}`, DEFAULT);
      setStyleProperty(`--el-color-${name}-dark-2`, dark[2]);
      setStyleProperty(`--el-color-${name}-light-3`, light[3]);
      setStyleProperty(`--el-color-${name}-light-5`, light[5]);
      setStyleProperty(`--el-color-${name}-light-7`, light[7]);
      setStyleProperty(`--el-color-${name}-light-8`, light[8]);
      setStyleProperty(`--el-color-${name}-light-9`, light[9]);
    }
  }

  watchEffect(async () => {
    const themeImport = themeMap[appStore.theme];
    let { default: themeConfig } = await themeImport();
    themeConfig = merge(defaultTheme, themeConfig ?? {});
    updateThemeColorVar(themeConfig);
  });
}
