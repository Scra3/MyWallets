import { shallowMount } from '@vue/test-utils'
import App from '@/App'
import { EUR, USD } from '@/constants.js'

jest.mock('nativescript-barcodescanner', () => '')
jest.mock('nativescript-camera', () => {
  return { requestPermissions: jest.fn() }
})

describe('App.vue', () => {
  let wrapper

  beforeEach(async () => {
    wrapper = shallowMount(App)
  })

  it('displays EUR currency by default', () => {
    expect(
      wrapper.findDataTest('action-item-currency').attributes().text
    ).toEqual(EUR.acronym)
  })

  it('displays USD currency when EUR currency is tapped', () => {
    wrapper.findDataTest('action-item-currency').vm.$emit('tap')

    expect(
      wrapper.findDataTest('action-item-currency').attributes().text
    ).toEqual(USD.acronym)
  })

  it('displays EUR currency when USD currency is tapped', () => {
    wrapper.findDataTest('action-item-currency').vm.$emit('tap')
    wrapper.findDataTest('action-item-currency').vm.$emit('tap')

    expect(
      wrapper.findDataTest('action-item-currency').attributes().text
    ).toEqual(EUR.acronym)
  })

  it('renders MarketView when his tab is clicked', () => {
    wrapper.find('TabView-stub').vm.$emit('selectedIndexChange', { value: 1 })

    // tabView selectedIndex props is undefined... that why whe test selectedIndex data
    expect(wrapper.vm.selectedIndex).toBe(1)
  })

  it('renders WalletView when his tab is clicked', () => {
    wrapper.find('TabView-stub').vm.$emit('selectedIndexChange', { value: 0 })

    // tabView selectedIndex props is undefined... that why whe test selectedIndex data
    expect(wrapper.vm.selectedIndex).toBe(0)
  })
})
