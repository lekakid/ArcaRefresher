module.exports = {
  root: true,
  extends: ['react-app', 'airbnb', 'prettier'],
  parser: '@babel/eslint-parser',
  plugins: ['@babel'],
  rules: {
    'no-console': 'off',
    camelcase: [
      'error',
      {
        ignoreGlobals: true,
      },
    ],
    'no-param-reassign': [
      'error',
      { props: true, ignorePropertyModificationsFor: ['state'] },
    ],
    'import/prefer-default-export': 'off',
    'react/jsx-wrap-multilines': [
      'error',
      {
        prop: 'ignore',
      },
    ],
    'react/prop-types': 'off',
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
    GM_setValue: true,
    GM_getValue: true,
    GM_deleteValue: true,
    GM_listValues: true,
    GM_xmlhttpRequest: true,
    GM_addValueChangeListener: true,
    GM_download: true,
    GM_setClipboard: true,
    unsafeWindow: true,
    ClipboardItem: true,
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
};
