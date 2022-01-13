module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': ['google'],
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
  'plugins': ['svelte3'],
  'overrides': [{files: ['*.svelte'], processor: 'svelte3/svelte3'}],
  'parserOptions': {
    sourceType: 'module',
    ecmaVersion: 2019,
  },
  'env': {
    browser: true,
    es2017: true,
    node: true,
  },
  'rules': {
    'indent': ['warn', 2, {'SwitchCase': 1}],
    'semi': ['warn', 'never'],
    'object-curly-spacing': ['off', 'always'],
    'array-bracket-spacing': ['off', 'always'],
    'quotes': ['warn', 'single', {'avoidEscape': true}],
    'space-infix-ops': ['warn', {'int32Hint': false}],
    'no-unused-vars': 'warn',
    'linebreak-style': 'off',
    'max-len': ['error', {'ignoreStrings': true}],
    'no-invalid-this': 'off',
  },
}
