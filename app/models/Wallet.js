import { ETH, XRP, EOS, NEO } from "@/constants.js";

class Wallet {
  constructor(
    coin,
    balance = 0,
    currentPrice = null,
    priceChangePercentage24h = null
  ) {
    this._balance = parseFloat(balance);
    this._currentPrice = parseFloat(currentPrice);
    this._errored = false;
    this._coin = coin;
    this._balance = parseFloat(balance);
    this._currentPrice = parseFloat(currentPrice);
    this._priceChangePercentage24h = priceChangePercentage24h;
  }

  value() {
    if (this.errored) {
      return 0;
    }
    return parseFloat(this._currentPrice * this._balance).toFixed(2);
  }

  set coin(value) {
    this._coin = value;
  }

  set balance(value) {
    this._balance = parseFloat(value);
  }

  set currentPrice(value) {
    this._currentPrice = parseFloat(value);
  }

  set priceChangePercentage24h(value) {
    this._priceChangePercentage24h = value;
  }

  set errored(value) {
    this._errored = value;
  }

  get coin() {
    return this._coin;
  }

  get balance() {
    return this._balance;
  }

  get currentPrice() {
    return this._currentPrice;
  }

  get priceChangePercentage24h() {
    return this._priceChangePercentage24h;
  }

  get errored() {
    return this._errored;
  }
}

export class XRPWallet extends Wallet {
  constructor(...args) {
    super(XRP, ...args);
  }
}

export class EOSWallet extends Wallet {
  constructor(...args) {
    super(EOS, ...args);
  }
}

export class ETHWallet extends Wallet {
  constructor(...args) {
    super(ETH, ...args);
  }
}

export class NEOWallet extends Wallet {
  constructor(...args) {
    super(NEO, ...args);
  }
}
