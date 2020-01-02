import { Coin } from '@/models/Coin'

export class Wallet {
  constructor(
    coin = null,
    balance = null,
    address = null,
    isUsingBalanceSetting = true
  ) {
    this.coin = coin
    this.balance = balance
    this.address = address
    this.isUsingBalanceSetting = isUsingBalanceSetting
  }

  value() {
    if (!this.coin.currentPrice || this.balance === null) {
      throw 'balance or current price is not defined'
    }
    return Number(parseFloat(this.coin.currentPrice * this.balance).toFixed(2))
  }

  static buildWalletFromPersistedWallet(persistedWallet) {
    return new Wallet(
      new Coin(persistedWallet.id),
      persistedWallet.balance,
      persistedWallet.address,
      persistedWallet.isUsingBalanceSetting
    )
  }
}
