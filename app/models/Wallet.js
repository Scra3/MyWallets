import { Coin } from '@/models/Coin'

export class Wallet {
  constructor(
    coin = null,
    balance = null,
    address = null,
    isUsingLocalBalance = true,
    investment = 0,
    id
  ) {
    this.coin = coin
    this.balance = balance
    this.address = address
    this.isUsingLocalBalance = isUsingLocalBalance
    this.investment = investment
    this.id = id
  }

  value() {
    if (!this.coin.currentPrice || this.balance === null) {
      throw 'balance or current price is not defined'
    }
    return Number(parseFloat(this.coin.currentPrice * this.balance).toFixed(2))
  }

  static buildWalletFromPersistedWallet(persistedWallet) {
    return new Wallet(
      new Coin(persistedWallet.coinId),
      persistedWallet.balance,
      persistedWallet.address,
      persistedWallet.isUsingLocalBalance,
      persistedWallet.investment,
      persistedWallet.id
    )
  }
}
