module.exports = {
  root: true,
  extends: [
    // add more generic rulesets here, such as:
    "eslint:recommended",
    "plugin:vue/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "babel-eslint",
    sourceType: "module",
    allowImportExportEverywhere: false
  },
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
  }
}