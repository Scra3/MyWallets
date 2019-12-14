import { shallowMount } from '@vue/test-utils'
import WalletPage from '@/pages/WalletPage'
import { Coin } from '@/models/Coin'
import { Wallet } from '@/models/Wallet'

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
    wallet = new Wallet(10, coin, 'fakeAddress')
    wrapper = shallowMount(WalletPage, {
      propsData: { wallet },
      mocks: { $navigateBack: jest.fn() }
    })
  })

  it('goes to back page when save button is clicked', () => {
    wrapper.find("[data-test='save-button']").vm.$emit('tap')

    expect(wrapper.vm.$navigateBack).toHaveBeenCalled()
  })

  it('goes to back page when back button is clicked', () => {
    wrapper.find("[data-test='back-button']").vm.$emit('tap')

    expect(wrapper.vm.$navigateBack).toHaveBeenCalled()
  })

  it('emits delete event page when delete button is clicked', () => {
    wrapper.find("[data-test='delete-wallet']").vm.$emit('tap')

    expect(wrapper.emitted('delete-wallet-did-click')).toBeTruthy()
  })

  it('goes to back page when delete button is clicked', () => {
    wrapper.find("[data-test='delete-wallet']").vm.$emit('tap')

    expect(wrapper.vm.$navigateBack).toHaveBeenCalled()
  })

  describe('when is in synchronized mode', () => {
    beforeEach(() => {
      wrapper.find("[data-test='synchronized-mode-switch']").vm.$emit('tap')
    })

    it('displays synchronized mode by default', () => {
      expect(
        wrapper.find("[data-test='synchronized-mode-switch']").classes()
      ).toContain('selected')
    })

    it('displays address input', () => {
      expect(wrapper.find("[data-test='address-input']").isVisible()).toBe(true)
    })

    it('displays scanner button', () => {
      expect(wrapper.find("[data-test='scanner-button']").isVisible()).toBe(
        true
      )
    })

    it('displays scanner when scanner button is clicked', () => {
      wrapper.vm.doScanWithFrontCamera = jest.fn()
      wrapper.find("[data-test='scanner-button']").vm.$emit('tap')

      expect(wrapper.vm.doScanWithFrontCamera).toHaveBeenCalled()
    })
  })

  describe('when is in manual balance mode', () => {
    beforeEach(() => {
      wrapper.find("[data-test='manual-balance-mode-switch']").vm.$emit('tap')
    })

    it('highlights manual balance mode button', () => {
      expect(
        wrapper.find("[data-test='manual-balance-mode-switch']").classes()
      ).toContain('selected')
    })

    it('displays balance input', () => {
      expect(wrapper.find("[data-test='balance-input']").isVisible()).toBe(true)
    })
  })
})
