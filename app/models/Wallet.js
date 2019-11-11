export class Wallet {
  constructor(coin, balance) {
    this.coin = coin
    this.balance = balance
  }

  value() {
    if (!this.coin.currentPrice || !this.balance) {
      return null
    }
    return Number(parseFloat(this.coin.currentPrice * this.balance).toFixed(2))
  }
}
