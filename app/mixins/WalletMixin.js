import { XRP, ETH, EOS, NEO, BTC } from '@/constants'
import {
  fetchXRPWallet,
  fetchEOSWallet,
  fetchETHWallet,
  fetchNEOWallet,
  fetchBTCWallet
} from '@/Api'
import WAValidator from 'multicoin-address-validator'
import { checkEOSAccountValidity } from '@/Api'

export const WalletMixin = {
  methods: {
    async $_checkAddressValidity(addressOrAccountName, coinID) {
      if (coinID === EOS) {
        return await checkEOSAccountValidity(addressOrAccountName)
      } else {
        return WAValidator.validate(addressOrAccountName, coinID)
      }
    },
    $_fetchWallet(addressOrAccountName, coinId) {
      switch (coinId) {
        case XRP:
          return fetchXRPWallet(addressOrAccountName)
        case ETH:
          return fetchETHWallet(addressOrAccountName)
        case EOS:
          return fetchEOSWallet(addressOrAccountName)
        case NEO:
          return fetchNEOWallet(addressOrAccountName)
        case BTC:
          return fetchBTCWallet(addressOrAccountName)
      }
    }
  }
}
