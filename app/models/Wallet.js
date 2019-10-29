import { Coin } from '@/models/Coin.js'

export class Wallet {
  constructor(coin, balance) {
    this._coin = coin
    this._balance = balance
  }

  value() {
    if (!this._coin._currentPrice || !this._balance) {
      return null
    }
    return parseFloat(this._coin._currentPrice * this._balance).toFixed(2)
  }

  get coin() {
    return this._coin
  }

  set coin(value) {
    this._coin = value
  }

  get balance() {
    return this._balance
  }

  set balance(value) {
    this._balance = value
  }
}

export class XRPWallet extends Wallet {
  constructor(balance) {
    super(new Coin('ripple'), balance)
  }
}

export class EOSWallet extends Wallet {
  constructor(balance) {
    super(new Coin('eos'), balance)
  }
}

export class ETHWallet extends Wallet {
  constructor(balance) {
    super(new Coin('ethereum'), balance)
  }
}

export class NEOWallet extends Wallet {
  constructor(balance) {
    super(new Coin('neo'), balance)
  }
}
