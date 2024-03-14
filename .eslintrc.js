module.exports = {
  root: true,
  extends: ['react-app', 'airbnb', 'prettier'],
  parser: '@babel/eslint-parser',
  plugins: ['@babel', 'unused-imports'],
  rules: {
    'no-console': 'off',
    camelcase: [
      'error',
      {
        ignoreGlobals: true,
      },
    ],
    'no-param-reassign': ['error', { props: false }],
    'lines-between-class-members': 'off',
    'import/prefer-default-export': 'off',
    'react/jsx-wrap-multilines': [
      'error',
      {
        prop: 'ignore',
      },
    ],
    'react/forbid-prop-types': 'off',
    'react/require-default-props': 'off',
    'unused-imports/no-unused-imports': 'error',
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack.common.js',
      },
    },
  },
  globals: {
    GM_info: true,
    GM_openInTab: true,
    GM_setValue: true,
    GM_getValue: true,
    GM_deleteValue: true,
    GM_listValues: true,
    GM_xmlhttpRequest: true,
    GM_addValueChangeListener: true,
    unsafeWindow: true,
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
};
