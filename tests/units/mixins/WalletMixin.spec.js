jest.mock('@/Api')
import {
  fetchXRPWallet,
  fetchEOSWallet,
  fetchETHWallet,
  fetchNEOWallet,
  fetchBTCWallet,
  checkEOSAccountValidity
} from '@/Api'

import { XRP, BTC, EOS, ETH, NEO } from '@/constants'
import { WalletMixin } from '@/mixins/WalletMixin.js'
import { shallowMount } from '@vue/test-utils'

describe('WalletMixin', () => {
  const DummyComponent = { template: '<div></div>' }
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(DummyComponent, { mixins: [WalletMixin] })
  })

  describe('$_checkAddressValidity function', () => {
    it('calls checkEOSAccountValidity when it is and EOS account', async () => {
      await wrapper.vm.$_checkAddressValidity('eosAddress', EOS)
      expect(checkEOSAccountValidity).toHaveBeenCalledWith('eosAddress')
    })

    describe('when address is falsy', () => {
      const cases = [
        ['ethAddress', ETH],
        ['xrpAddress', XRP],
        ['btcAddress', BTC],
        ['neoAddress', NEO]
      ]

      test.each(cases)(
        'given %p and %p as bad address and ID',
        async (addressOrAccountName, id) => {
          expect(
            await wrapper.vm.$_checkAddressValidity(addressOrAccountName, id)
          ).toBe(false)
        }
      )
    })

    describe('when address is truthy', () => {
      const cases = [
        ['0x70Fe19189628d1050cb0e14aa7A1BBc246A48183', ETH],
        ['rs7YB1m6EQfNRCmm5VbqFW3GDvA9SoFTAR', XRP],
        ['ASfa8eQHaG2ZXt9VZaYA9SkkcCpbi3cacf', NEO],
        ['3P3QsMVK89JBNqZQv5zMAKG8FK3kJM4rjt', BTC]
      ]

      test.each(cases)(
        'given %p and %p as bad address and ID',
        async (addressOrAccountName, id) => {
          expect(
            await wrapper.vm.$_checkAddressValidity(addressOrAccountName, id)
          ).toBe(true)
        }
      )
    })
  })

  describe('$_fetchWallet function', () => {
    const cases = [
      ['xrpAddress', XRP, fetchXRPWallet],
      ['eosAccountName', EOS, fetchEOSWallet],
      ['ethAddress', ETH, fetchETHWallet],
      ['neoAddress', NEO, fetchNEOWallet],
      ['btcAddress', BTC, fetchBTCWallet]
    ]

    describe('calls the right function associated to id coin', () => {
      test.each(cases)(
        'given %p and %p as arguments, calls %p',
        (addressOrAccountName, id, fetchFunction) => {
          wrapper.vm.$_fetchWallet(addressOrAccountName, id)

          expect(fetchFunction).toHaveBeenCalledWith(addressOrAccountName)
        }
      )
    })
  })
})
