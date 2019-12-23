import { Wrapper } from '@vue/test-utils'

Wrapper.prototype.findDataTest = function(dataTest) {
  return this.find(`[data-test="${dataTest}"]`)
}

Wrapper.prototype.findAllDataTests = function(dataTest) {
  return this.findAll(`[data-test="${dataTest}"]`)
}
