export class Wallet {
  constructor(coin = null, balance = null, address = null) {
    this.coin = coin
    this.balance = balance
    this.address = address
  }

  value() {
    if (!this.coin.currentPrice || this.balance === null) {
      throw 'balance or current price is not defined'
    }
    return Number(parseFloat(this.coin.currentPrice * this.balance).toFixed(2))
  }
}
