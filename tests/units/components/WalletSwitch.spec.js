import { Coin } from '@/models/Coin'
import { Wallet } from '@/models/Wallet'
import { BTC } from '@/constants'
import WalletSwitch from '@/components/WalletSwitch'
import { shallowMount } from '@vue/test-utils'

describe('WalletSwitch.vue', () => {
  let wrapper
  let coin
  let wallet
  beforeEach(() => {
    coin = new Coin(
      BTC,
      'Bitcoin',
      9668.09,
      7.17426,
      647.18,
      'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579'
    )
    wallet = new Wallet(coin, 10, 'fakeAddress', false)

    wrapper = shallowMount(WalletSwitch, {
      propsData: { wallet }
    })
  })

  it('displays address label', () => {
    expect(wrapper.findDataTest('address-label').isVisible()).toBe(true)
  })

  it('displays balance label', () => {
    expect(wrapper.findDataTest('balance-label').isVisible()).toBe(true)
  })

  it('emits an event with true value when balance mode is tapped', () => {
    wrapper.findDataTest('balance-label').vm.$emit('tap')

    expect(wrapper.emitted('is-balance-mode-did-tap')[0][0]).toEqual(true)
  })

  it('emits an event with false value when address mode is tapped', () => {
    wrapper.findDataTest('address-label').vm.$emit('tap')

    expect(wrapper.emitted('is-balance-mode-did-tap')[0][0]).toEqual(false)
  })
})
