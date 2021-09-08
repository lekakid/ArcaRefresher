module.exports = {
  root: true,
  extends: ['react-app', 'airbnb', 'prettier'],
  parser: '@babel/eslint-parser',
  plugins: ['@babel'],
  rules: {
    'no-console': 'off',
    'no-param-reassign': [
      'error',
      { props: true, ignorePropertyModificationsFor: ['state'] },
    ],
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
      alias: {
        map: [
          ['~', './src'],
          ['core', './src/core'],
          ['menu', './src/menu'],
          ['feature', './src/feature'],
          ['util', './src/util'],
        ],
        extensions: ['.js', '.jsx'],
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
    unsafeWindow: true,
    ClipboardItem: true,
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
};
