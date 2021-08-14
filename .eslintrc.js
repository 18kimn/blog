module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': [
    'google',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  'settings': {
    'react': {
      'version': 'detect',
    },
  },
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
    },
    'ecmaVersion': 12,
    'sourceType': 'module',
  },
  'plugins': [
    'react',
    'react-hooks',
    'jsx-a11y',
  ],
  'rules': {
    'react/prop-types': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'indent': ['warn', 2, { 'SwitchCase': 1 }],
    'semi': ['warn', 'never'],
    'object-curly-spacing': ['off', 'always'],
    'array-bracket-spacing': ['off', 'always'],
    'quotes': ['warn', 'single', {'avoidEscape': true}],
    'space-infix-ops': ['warn', {'int32Hint': false}],
    'no-unused-vars': 'warn',
    'linebreak-style': 'off',
    'max-len': ['error', { 'ignoreStrings': true }],
    'no-invalid-this': 'off',
  },
}
