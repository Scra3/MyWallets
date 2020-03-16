import { shallowMount, createLocalVue } from '@vue/test-utils'
import AlertFormPage from '@/pages/AlertFormPage'
import { Coin } from '@/models/Coin'
import flushPromises from 'flush-promises'
import { USD, BTC } from '@/constants'
import App from '@/App'

jest.mock('nativescript-barcodescanner', () => jest.fn())
jest.mock('nativescript-camera', () => jest.fn())

const coin = new Coin(
  BTC,
  'Bitcoin',
  9668.09,
  7.17426,
  647.18,
  'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579'
)

describe('AlertFormPage.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(AlertFormPage, {
      propsData: { coin, currency: USD },
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

  it('goes to home page when delete button is clicked when it is updating alert', () => {
    wrapper.setProps({ isUpdating: true })

    wrapper.findDataTest('delete-alert').vm.$emit('tap')

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

  it('goes to home page when save button is tapped and target value is valid', () => {
    wrapper.findDataTest('input-target-value').vm.$emit('value-did-change', 5)

    wrapper.findDataTest('save-button').vm.$emit('tap')

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
