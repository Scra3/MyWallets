import { shallowMount, createLocalVue } from '@vue/test-utils'
import App from '@/App'
import { EUR, USD } from '@/constants.js'
import Vuex from 'vuex'

jest.mock('nativescript-barcodescanner', () => '')
jest.mock('nativescript-camera', () => {
  return { requestPermissions: jest.fn() }
})

const localVue = createLocalVue()
localVue.use(Vuex)

describe('App.vue', () => {
  let wrapper
  let actions
  let state
  let store

  beforeEach(async () => {
    actions = {
      select: jest.fn(),
      update: jest.fn(),
      insert: jest.fn()
    }
    state = { app: { id: 1, currency: USD.acronym } }

    store = new Vuex.Store({
      modules: {
        appDb: { namespaced: true, actions, state }
      }
    })

    wrapper = shallowMount(App, { store, localVue })
  })

  it('displays USD currency by default', () => {
    expect(
      wrapper.findDataTest('action-item-currency').attributes().text
    ).toEqual(USD.acronym)
  })

  it('toggles EUR currency when USD currency is tapped', () => {
    wrapper.findDataTest('action-item-currency').vm.$emit('tap')
    expect(actions.update).toHaveBeenCalledWith(expect.any(Object), {
      ...store.state.appDb.app,
      currency: EUR.acronym
    })
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
