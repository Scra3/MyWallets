module.exports = {
  root: true,
  extends: [
    // add more generic rulesets here, such as:
    'eslint:recommended',
    'plugin:vue/recommended',
    'plugin:prettier/recommended',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    allowImportExportEverywhere: false
  },
  env: {
    'jest': true
  },
  rules: {
    'vue/attribute-hyphenation': ['error', 'always', {
      'ignore': [
        'android:androidTabsPosition',
        'android.systemIcon',
        'horizontalAlignment',
        'verticalAlignment',
        'keyboardType',
        'selectionMode',
        'expandRadius',
        'valueProperty',
        'outerRadiusFactor',
        'v-tkPieSeries',
        'allowAnimation',
        'loadMode',
        'offsetOrigin',
        'maxBarSize',
        'legendLabel',
        'enableSelection',
        'legendTitle',
        'categoryProperty',
        'automationText'
      ]
    }],
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: false,
      }
      ],
      'vue/max-attributes-per-line': [2, {
      singleline: 20,
      multiline: {
        max: 1,
        allowFirstLine: false
      }
    }]
  }
}