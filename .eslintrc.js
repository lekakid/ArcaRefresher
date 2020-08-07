module.exports = {
  root: true,
  extends: [
    require.resolve('@gera2ld/plaid/eslint'),
    require.resolve('@gera2ld/plaid-common-react/eslint'),
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
  },
  rules: {
    'indent': ["error", 4],
    'react/jsx-indent': "off",
    'react/no-unknown-property': "off",
    'react/style-prop-object': "off",
    'linebreak-style': 0,
    'keyword-spacing': "off",
    'no-restricted-globals':"off",
    'eqeqeq':"off",
    'brace-style':["error", "stroustrup"],
    'func-names': "off",
    'no-undef': "off",
    'no-alert': "off",
    'no-prototype-builtins': "off",
  }
};
