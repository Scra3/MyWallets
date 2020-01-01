jest.mock('@/Api')

import {
  fetchXRPWallet,
  fetchBTCWallet,
  fetchETHWallet,
  fetchEOSWallet,
  fetchNEOWallet
} from '@/Api'

import { XRP, BTC, EOS, ETH, NEO } from '@/constants'
import { WalletMixin } from '@/mixins/WalletMixin.js'
import { shallowMount } from '@vue/test-utils'

describe('fetchWallet function', () => {
  let DummyComponent = { template: '<div></div>' }
  let wrapper

  beforeEach(() => {
    fetchXRPWallet.mockImplementation(() => '')

    wrapper = shallowMount(DummyComponent, { mixins: [WalletMixin] })
  })

  const cases = [
    ['xrpAddress', XRP, fetchXRPWallet],
    ['eosAddress', EOS, fetchEOSWallet],
    ['ethAddress', ETH, fetchETHWallet],
    ['neoAddress', NEO, fetchNEOWallet],
    ['btcAddress', BTC, fetchBTCWallet]
  ]
  describe('calls the right function associated to id coin', () => {
    test.each(cases)(
      'given %p and %p as arguments, calls %p',
      (address, id, fetchFunction) => {
        wrapper.vm.$_fetchWallet(address, id)

        expect(fetchFunction).toHaveBeenCalledWith(address)
      }
    )
  })
})
