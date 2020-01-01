import { XRP, ETH, EOS, NEO, BTC } from '@/constants'
import {
  fetchXRPWallet,
  fetchEOSWallet,
  fetchETHWallet,
  fetchNEOWallet,
  fetchBTCWallet
} from '@/Api'

export const WalletMixin = {
  methods: {
    $_fetchWallet(address, id) {
      switch (id) {
        case XRP:
          return fetchXRPWallet(address)
        case ETH:
          return fetchETHWallet(address)
        case EOS:
          return fetchEOSWallet(address)
        case NEO:
          return fetchNEOWallet(address)
        case BTC:
          return fetchBTCWallet(address)
      }
    }
  }
}
