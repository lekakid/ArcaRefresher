module.exports = {
  root: true,
  extends: [
    require.resolve('@gera2ld/plaid/eslint'),
    require.resolve('@gera2ld/plaid-common-react/eslint'),
    'prettier',
  ],
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
    react: {
      pragma: 'VM',
    },
  },
  globals: {
    VM: true,
    GM_setValue: true,
    GM_getValue: true,
    GM_deleteValue: true,
    GM_listValues: true,
    GM_xmlhttpRequest: true,
    unsafeWindow: true,
    ClipboardItem: true,
    JSZip: true,
  },
  rules: {
    'no-alert': 'off',
  },
};
