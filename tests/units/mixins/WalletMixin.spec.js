import { Wallet } from '@/models/Wallet'
import { Coin } from '@/models/Coin'
jest.mock('@/Api')
import {
  fetchXRPWalletBalance,
  fetchEOSWalletBalance,
  fetchETHWalletBalance,
  fetchNEOWalletBalance,
  fetchBTCWalletBalance,
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

  describe('$_canTrackAddress function', () => {
    describe('when address can be tracked', () => {
      const cases = [[ETH], [XRP], [BTC], [NEO]]

      test.each(cases)('given %p as coinID', id => {
        expect(wrapper.vm.$_canTrackAddress(id)).toBe(true)
      })
    })

    it("returns false when address can't be tracked", () => {
      expect(wrapper.vm.$_canTrackAddress('badId')).toBe(false)
    })
  })

  describe('$_fetchWalletBalance function', () => {
    const cases = [
      [XRP, fetchXRPWalletBalance],
      [EOS, fetchEOSWalletBalance],
      [ETH, fetchETHWalletBalance],
      [NEO, fetchNEOWalletBalance],
      [BTC, fetchBTCWalletBalance]
    ]

    describe('calls the right function associated to id coin', () => {
      test.each(cases)(
        'given %p and %p as arguments, calls %p',
        (coinID, fetchFunction) => {
          const expectedWallet = new Wallet(new Coin(coinID))
          wrapper.vm.$_fetchWalletBalance(expectedWallet)

          expect(fetchFunction).toHaveBeenCalledWith(expectedWallet)
        }
      )
    })
  })
})
