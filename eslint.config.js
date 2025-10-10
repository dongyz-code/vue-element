import antfu from '@antfu/eslint-config';

export default antfu({
  formatters: true,
  vue: true,
  stylistic: {
    semi: true,
    quotes: 'single',

  },
  rules: {
    'no-console': 'off',
    'no-unused-vars': 'warn',
    'unused-imports/no-unused-imports': 'warn',
  },
});
