module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:vue/vue3-recommended', 'plugin:prettier/recommended'],
  plugins: ['vue', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
};
