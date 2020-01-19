import { shallowMount } from '@vue/test-utils'
import WalletPage from '@/pages/WalletPage'
import { Coin } from '@/models/Coin'
import { Wallet } from '@/models/Wallet'
import flushPromises from 'flush-promises'
import * as camera from 'nativescript-camera'
import { USD, BTC } from '@/constants'
import App from '@/App'

jest.mock('nativescript-barcodescanner', () => '')
jest.mock('nativescript-camera', () => {
  return { requestPermissions: jest.fn(() => Promise.resolve()) }
})

describe('WalletPage.vue', () => {
  let wrapper
  let coin
  let wallet

  beforeEach(async () => {
    coin = new Coin(
      BTC,
      'Bitcoin',
      9668.09,
      7.17426,
      647.18,
      'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579'
    )
    wallet = new Wallet(coin, 10, 'fakeAddress', false)

    wrapper = shallowMount(WalletPage, {
      propsData: { wallet, currency: USD },
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

  it('goes to home page when delete button is clicked', () => {
    wrapper.findDataTest('delete-wallet').vm.$emit('tap')

    expect(wrapper.vm.$navigateTo).toHaveBeenCalledWith(App, {
      props: { currency: USD }
    })
  })

  it('goes to home page when user does nothing and clicks on update wallet when he is updating wallet', () => {
    wrapper.setProps({ isUpdating: true })

    wrapper.findDataTest('save-button').vm.$emit('tap')

    expect(wrapper.vm.$navigateTo).toHaveBeenCalledWith(App, {
      props: { currency: USD }
    })
  })

  it('does not go to home page when user clicks on save wallet but did not provide any information', () => {
    wrapper.setProps({ isUpdating: false })

    wrapper.findDataTest('save-button').vm.$emit('tap')

    expect(wrapper.vm.$navigateTo).not.toHaveBeenCalled()
  })

  describe('when it is in tracked mode', () => {
    beforeEach(() => {
      wrapper
        .find('WalletSwitch-stub')
        .vm.$emit('is-balance-mode-did-tap', false)
    })

    it('displays input wallet address', () => {
      expect(wrapper.find('WalletAddressInput-stub').isVisible()).toBe(true)
    })

    it('displays scanner button', () => {
      expect(wrapper.findDataTest('scanner-button').isVisible()).toBe(true)
    })

    it('does not display input wallet balance', () => {
      expect(wrapper.find('WalletBalanceInput-stub').exists()).toBe(false)
    })

    it('displays wallet price', () => {
      expect(wrapper.findDataTest('wallet-price').exists()).toBe(false)
    })

    it('displays scanner when scanner button is clicked', async () => {
      wrapper.vm.scan = jest.fn()
      wrapper.findDataTest('scanner-button').vm.$emit('tap')
      await flushPromises()

      expect(wrapper.vm.scan).toHaveBeenCalled()
    })

    it('requests permission when scanner button is clicked', async () => {
      wrapper.findDataTest('scanner-button').vm.$emit('tap')
      await flushPromises()

      expect(camera.requestPermissions).toHaveBeenCalled()
    })

    it('goes to home page when save button is tapped and address is valid', () => {
      wrapper.find('WalletAddressInput-stub').vm.$emit('is-address-valid', true)
      wrapper.findDataTest('save-button').vm.$emit('tap')

      expect(wrapper.vm.$navigateTo).toHaveBeenCalledWith(App, {
        props: { currency: USD }
      })
    })

    it('does not go to home page when save button is tapped and address is not valid', () => {
      wrapper
        .find('WalletAddressInput-stub')
        .vm.$emit('is-address-valid', false)
      wrapper.findDataTest('save-button').vm.$emit('tap')

      expect(wrapper.vm.$navigateTo).not.toHaveBeenCalled()
    })

    it('does not go to home page when user clicks on save wallet but is checking address validity', () => {
      wrapper.findDataTest('save-button').vm.$emit('tap')
      wrapper
        .find('WalletAddressInput-stub')
        .vm.$emit('is-checking-address-validity', true)

      expect(wrapper.vm.$navigateTo).not.toHaveBeenCalled()
    })
  })

  describe('when it is in manual balance mode', () => {
    beforeEach(() => {
      wrapper
        .find('WalletSwitch-stub')
        .vm.$emit('is-balance-mode-did-tap', true)
    })

    it('displays input wallet balance', () => {
      expect(wrapper.find('WalletBalanceInput-stub').isVisible()).toBe(true)
    })

    it('does not display input wallet address', () => {
      expect(wrapper.find('WalletAddressInput-stub').exists()).toBe(false)
    })

    it('goes to home page when save button is tapped and balance is valid', () => {
      wrapper.find('WalletBalanceInput-stub').vm.$emit('is-balance-valid', true)
      wrapper.findDataTest('save-button').vm.$emit('tap')

      expect(wrapper.vm.$navigateTo).toHaveBeenCalledWith(App, {
        props: { currency: USD }
      })
    })

    it('does not go to home page when save button is tapped and balance is not valid', () => {
      wrapper
        .find('WalletBalanceInput-stub')
        .vm.$emit('is-balance-valid', false)
      wrapper.findDataTest('save-button').vm.$emit('tap')

      expect(wrapper.vm.$navigateTo).not.toHaveBeenCalled()
    })
  })
})
