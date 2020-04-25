import { shallowMount, createLocalVue } from '@vue/test-utils'
import App from '@/App'
import { EUR, USD } from '@/constants'
import Vuex from 'vuex'
import flushPromises from 'flush-promises'

jest.mock('nativescript-barcodescanner', () => jest.fn())
jest.mock('nativescript-camera', () => {
  return { requestPermissions: jest.fn() }
})
jest.mock('nativescript-sqlite')
global.android = jest.fn()

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
        appManager: { namespaced: true, actions, state },
        walletManager: { namespaced: true, actions, state }
      }
    })

    wrapper = shallowMount(App, {
      store,
      localVue
    })
  })

  it('displays USD currency by default', () => {
    expect(
      wrapper.findDataTest('action-item-currency').attributes().text
    ).toEqual(USD.acronym)
  })

  it('toggles EUR currency when USD currency is tapped', async () => {
    wrapper.vm.displayConfirmCurrency = jest.fn(() => Promise.resolve(true))

    wrapper.findDataTest('action-item-currency').vm.$emit('tap')
    await flushPromises()

    expect(actions.update).toHaveBeenCalledWith(expect.any(Object), {
      ...store.state.appManager.app,
      currency: EUR.acronym
    })
  })

  it('does not toggles EUR currency when USD currency is tapped and it cancel', async () => {
    wrapper.vm.displayConfirmCurrency = jest.fn(() => Promise.resolve(false))

    wrapper.findDataTest('action-item-currency').vm.$emit('tap')
    await flushPromises()

    expect(actions.update).not.toHaveBeenCalled()
  })
})
