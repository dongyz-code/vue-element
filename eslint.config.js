import antfu from '@antfu/eslint-config';

export default antfu({
  formatters: true,
  vue: true,
  markdown: false,
  stylistic: {
    indent: 2,
    semi: true,
    quotes: 'single',

  },
  typescript: {

  },
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'no-unused-vars': 'warn',
    'unused-imports/no-unused-imports': 'warn',
    'vue/html-self-closing': 'off',
    /** ts 关闭 type 转 interface 的规则 */
    'ts/consistent-type-definitions': 'off',
  },
});
