import { shallowMount } from '@vue/test-utils'
import WalletPage from '@/pages/WalletPage'
import { Coin } from '@/models/Coin'
import { Wallet } from '@/models/Wallet'
import flushPromises from 'flush-promises'
import * as camera from 'nativescript-camera'
import { USD } from '@/constants.js'
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
      'bitcoin',
      'Bitcoin',
      9668.09,
      7.17426,
      647.18,
      'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579'
    )
    wallet = new Wallet(coin, 10, 'fakeAddress', false)

    wrapper = shallowMount(WalletPage, {
      propsData: { wallet, currency: USD },
      mocks: { $navigateBack: jest.fn(), $navigateTo: jest.fn() }
    })
  })

  it('goes to home page when save button is clicked', () => {
    wrapper.findDataTest('save-button').vm.$emit('tap')

    expect(wrapper.vm.$navigateTo).toHaveBeenCalledWith(App, {
      props: { currency: USD }
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

  describe('when it is in synchronized mode', () => {
    beforeEach(() => {
      wrapper.findDataTest('address-mode-label').vm.$emit('tap')
    })

    it('displays synchronized mode by default', () => {
      expect(wrapper.findDataTest('address-mode-label').classes()).toContain(
        'selected'
      )
    })

    it('displays address input', () => {
      expect(wrapper.findDataTest('address-input').isVisible()).toBe(true)
    })

    it('displays scanner button', () => {
      expect(wrapper.findDataTest('scanner-button').isVisible()).toBe(true)
    })

    it('displays scanner when scanner button is clicked', () => {
      wrapper.findDataTest('scanner-button').vm.$emit('tap')

      expect(wrapper.find('BarcodeScanner-stub').isVisible()).toBe(true)
    })

    it('requests permission when scanner button is clicked', async () => {
      wrapper.findDataTest('scanner-button').vm.$emit('tap')
      await flushPromises()

      expect(camera.requestPermissions).toHaveBeenCalled()
    })
  })

  describe('when it is in manual balance mode', () => {
    beforeEach(() => {
      wrapper.findDataTest('manual-balance-mode-label').vm.$emit('tap')
    })

    it('highlights manual balance mode button', () => {
      expect(
        wrapper.findDataTest('manual-balance-mode-label').classes()
      ).toContain('selected')
    })

    it('displays balance input', () => {
      expect(wrapper.findDataTest('balance-input').isVisible()).toBe(true)
    })
  })
})
