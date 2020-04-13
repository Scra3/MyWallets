import { XRP, ETH, EOS, NEO, BTC } from '@/constants'
import {
  fetchXRPWalletBalance,
  fetchEOSWalletBalance,
  fetchETHWalletBalance,
  fetchNEOWalletBalance,
  fetchBTCWalletBalance,
  checkEOSAccountValidity
} from '@/Api'
import WAValidator from 'multicoin-address-validator'

export const WalletMixin = {
  methods: {
    $_totalInvestment(wallets) {
      const sum = (currentValue, wallet) =>
        currentValue + parseFloat(wallet.investment || 0)
      return Number(parseFloat(wallets.reduce(sum, 0.0)).toFixed(2))
    },
    $_totalValue(wallets) {
      const sum = (currentValue, wallet) =>
        currentValue + parseFloat(wallet.value())
      return Number(parseFloat(wallets.reduce(sum, 0.0)).toFixed(2))
    },
    async $_checkAddressValidity(addressOrAccountName, coinID) {
      if (coinID === EOS) {
        return await checkEOSAccountValidity(addressOrAccountName)
      } else {
        return WAValidator.validate(addressOrAccountName, coinID)
      }
    },
    $_canConnectAddress(coinID) {
      switch (coinID) {
        case XRP:
        case ETH:
        case EOS:
        case NEO:
        case BTC:
          return true
        default:
          return false
      }
    },
    $_fetchWalletBalance(wallet) {
      switch (wallet.coin.id) {
        case XRP:
          return fetchXRPWalletBalance(wallet)
        case ETH:
          return fetchETHWalletBalance(wallet)
        case EOS:
          return fetchEOSWalletBalance(wallet)
        case NEO:
          return fetchNEOWalletBalance(wallet)
        case BTC:
          return fetchBTCWalletBalance(wallet)
      }
    }
  }
}
