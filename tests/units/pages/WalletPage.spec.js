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

    it('displays wallet price', () => {
      expect(wrapper.findDataTest('wallet-price').exists()).toBe(false)
    })

    it('does not add error class on input address', () => {
      expect(wrapper.findDataTest('address-input').classes()).not.toContain(
        'error'
      )
    })

    it('does not add focus class on input address', () => {
      expect(wrapper.findDataTest('address-input').classes()).not.toContain(
        'focus'
      )
    })

    it('displays address mode', () => {
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

    it('displays spinner when save button is tapped pending verify address', () => {
      wrapper.vm.checkAddress = jest.fn()

      wrapper.findDataTest('save-button').vm.$emit('tap')

      expect(wrapper.find('ActivityIndicator-stub').isVisible()).toBe(true)
    })

    describe('when switching mode', () => {
      it('resets error when there is error ', () => {
        wrapper.findDataTest('address-input').vm.$emit('input', '')
        wrapper.findDataTest('save-button').vm.$emit('tap')

        wrapper.findDataTest('manual-balance-mode-label').vm.$emit('tap')

        expect(wrapper.findDataTest('failed-icon').exists()).toBe(false)
      })
    })

    describe('when is a valid address', () => {
      it('goes to home page when save button is clicked', async () => {
        wrapper.vm.checkAddress = jest.fn(() => Promise.resolve(true))

        wrapper.findDataTest('address-input').vm.$emit('input', 'fakeAddress')
        wrapper.findDataTest('save-button').vm.$emit('tap')
        await flushPromises()

        expect(wrapper.vm.$navigateTo).toHaveBeenCalledWith(App, {
          props: { currency: USD }
        })
      })
    })

    describe('when is not a valid address', () => {
      it('displays failed icon', async () => {
        wrapper.vm.checkAddress = jest.fn(() => Promise.resolve(false))

        wrapper.findDataTest('save-button').vm.$emit('tap')
        await flushPromises()

        expect(wrapper.findDataTest('failed-icon').isVisible()).toBe(true)
      })

      it('displays label error', async () => {
        wrapper.vm.checkAddress = jest.fn(() => Promise.resolve(false))

        wrapper.findDataTest('save-button').vm.$emit('tap')
        await flushPromises()

        expect(wrapper.findDataTest('label-error').isVisible()).toBe(true)
      })

      it('does not go to home page when address is not valid', async () => {
        wrapper.vm.checkAddress = jest.fn(() => Promise.resolve(false))

        wrapper.findDataTest('save-button').vm.$emit('tap')
        await flushPromises()

        expect(wrapper.vm.$navigateTo).not.toHaveBeenCalled()
      })

      it('does not go to home page when address is not defined', async () => {
        wrapper.vm.checkAddress = jest.fn(() => Promise.resolve(true))

        wrapper.findDataTest('address-input').vm.$emit('input', '')
        wrapper.findDataTest('save-button').vm.$emit('tap')
        await flushPromises()

        expect(wrapper.vm.$navigateTo).not.toHaveBeenCalled()
      })
    })
  })

  describe('when it is in manual balance mode', () => {
    beforeEach(() => {
      wrapper.findDataTest('manual-balance-mode-label').vm.$emit('tap')
    })

    it('displays wallet price', () => {
      expect(wrapper.findDataTest('wallet-price').isVisible()).toBe(true)
    })

    it('does not focus input address', () => {
      expect(wrapper.findDataTest('balance-input').classes()).not.toContain(
        'focus'
      )
    })

    it('highlights manual balance mode button', () => {
      expect(
        wrapper.findDataTest('manual-balance-mode-label').classes()
      ).toContain('selected')
    })

    it('displays balance input', () => {
      expect(wrapper.findDataTest('balance-input').isVisible()).toBe(true)
    })

    it('goes to home page when save button is clicked with 0 value', () => {
      wrapper.findDataTest('balance-input').vm.$emit('input', 0)

      wrapper.findDataTest('save-button').vm.$emit('tap')

      expect(wrapper.vm.$navigateTo).toHaveBeenCalled()
    })

    describe('when is not a valid balance', () => {
      it('displays failed icon', () => {
        wrapper.findDataTest('balance-input').vm.$emit('input', '')

        wrapper.findDataTest('save-button').vm.$emit('tap')

        expect(wrapper.findDataTest('failed-icon').isVisible()).toBe(true)
      })

      it('highlights input', () => {
        wrapper.findDataTest('balance-input').vm.$emit('input', '')

        wrapper.findDataTest('save-button').vm.$emit('tap')

        expect(wrapper.findDataTest('balance-input').classes()).toContain(
          'error'
        )
      })

      it('displays label error', () => {
        wrapper.findDataTest('balance-input').vm.$emit('input', '')

        wrapper.findDataTest('save-button').vm.$emit('tap')

        expect(wrapper.findDataTest('label-error').isVisible()).toBe(true)
      })

      it('does not go to home page when save button is clicked', () => {
        wrapper.findDataTest('balance-input').vm.$emit('input', '')

        wrapper.findDataTest('save-button').vm.$emit('tap')

        expect(wrapper.vm.$navigateTo).not.toHaveBeenCalled()
      })
    })
  })
})
