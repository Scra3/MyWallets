export class Wallet {
  constructor(coin, balance, address) {
    this.coin = coin
    this.balance = balance
    this.address = address
  }

  value() {
    if (!this.coin.currentPrice || !this.balance) {
      return null
    }
    return Number(parseFloat(this.coin.currentPrice * this.balance).toFixed(2))
  }
}
