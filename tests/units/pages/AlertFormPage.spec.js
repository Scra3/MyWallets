import { shallowMount, createLocalVue } from '@vue/test-utils'
import AlertFormPage from '@/pages/AlertFormPage'
import { Coin } from '@/models/Coin'
import { Alert } from '@/models/Alert'
import { USD, BTC } from '@/constants'
import App from '@/App'
import Vuex from 'vuex'
import flushPromises from 'flush-promises'

jest.mock('nativescript-barcodescanner', () => jest.fn())
jest.mock('nativescript-camera', () => jest.fn())
jest.mock('nativescript-local-notifications', () => jest.fn())

const coin = new Coin(
  BTC,
  'Bitcoin',
  9668.09,
  7.17426,
  647.18,
  'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579'
)

const newAlert = new Alert(null, null, 10, coin.id)

const alert = new Alert(11, 'stop lose', 10, coin.id)

const localVue = createLocalVue()
localVue.use(Vuex)

describe('AlertFormPage.vue', () => {
  let wrapper
  let store
  let actions

  beforeEach(async () => {
    actions = {
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }
    store = new Vuex.Store({
      modules: {
        alertManager: {
          namespaced: true,
          actions
        }
      }
    })

    wrapper = shallowMount(AlertFormPage, {
      propsData: { coin, currency: USD, alert: newAlert },
      localVue,
      store,
      mocks: {
        $navigateBack: jest.fn(),
        $navigateTo: jest.fn()
      }
    })
  })

  it('goes to back page when back button is clicked', () => {
    wrapper.findDataTest('back-button').vm.$emit('tap')

    expect(wrapper.vm.$navigateBack).toHaveBeenCalled()
  })

  it('goes to home page when delete button is clicked when it is updating alert', async () => {
    wrapper.setProps({ isUpdating: true, alert })

    wrapper.findDataTest('delete-alert').vm.$emit('tap')

    await flushPromises()

    expect(wrapper.vm.$navigateTo).toHaveBeenCalledWith(App, {
      props: { defaultSelectedViewIndex: 2 }
    })
  })

  it('does not go to alerts view when user clicks on save alert and did not provide target value', () => {
    wrapper.findDataTest('save-button').vm.$emit('tap')

    expect(wrapper.vm.$navigateTo).not.toHaveBeenCalled()
  })

  it('displays input target value', () => {
    expect(wrapper.findDataTest('input-target-value').isVisible()).toBe(true)
  })

  it('displays input note', () => {
    expect(wrapper.findDataTest('input-note').isVisible()).toBe(true)
  })

  it('goes to home page when save button is tapped and target value is valid', async () => {
    wrapper.findDataTest('input-target-value').vm.$emit('value-did-change', 5)

    wrapper.findDataTest('save-button').vm.$emit('tap')

    await flushPromises()

    expect(wrapper.vm.$navigateTo).toHaveBeenCalledWith(App, {
      props: { defaultSelectedViewIndex: 2 }
    })
  })

  it('does not go to home page when save button is tapped and target value is valid', () => {
    wrapper.findDataTest('input-target-value').vm.$emit('value-did-change', -5)

    wrapper.findDataTest('save-button').vm.$emit('tap')

    expect(wrapper.vm.$navigateTo).not.toHaveBeenCalled()
  })
})
