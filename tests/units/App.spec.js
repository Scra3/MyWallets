import { shallowMount } from '@vue/test-utils'
import App from '@/App'
import { EUR, USD } from '@/constants.js'

describe('App.vue', () => {
  let wrapper

  beforeEach(async () => {
    wrapper = shallowMount(App)
  })

  it('displays EUR currency by default', () => {
    expect(
      wrapper.find("[data-test='action-item-currency']").attributes().text
    ).toEqual(EUR.acronym)
  })

  it('displays USD currency when EUR currency is tapped', () => {
    wrapper.find("[data-test='action-item-currency']").vm.$emit('tap')

    expect(
      wrapper.find("[data-test='action-item-currency']").attributes().text
    ).toEqual(USD.acronym)
  })
})
