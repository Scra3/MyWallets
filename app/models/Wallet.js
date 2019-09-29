import { ETH, XRP, EOS, NEO } from "@/constants.js";

class Wallet {
  constructor(
    coin,
    id,
    balance = 0,
    currentPrice = null,
    priceChangePercentage24h = null,
    priceChange24 = null
  ) {
    this._id = id;
    this._balance = parseFloat(balance);
    this._currentPrice = parseFloat(currentPrice).toFixed(2);
    this._errored = false;
    this._coin = coin;
    this._balance = parseFloat(balance);
    this._currentPrice = parseFloat(currentPrice);
    this._priceChangePercentage24h = parseFloat(
      priceChangePercentage24h
    ).toFixed(2);
    this.priceChange24 = parseFloat(priceChange24).toFixed();
    this._priceChange24 = priceChange24;
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
    this._currentPrice = parseFloat(value).toFixed(2);
  }

  set priceChangePercentage24h(value) {
    this._priceChangePercentage24h = parseFloat(value).toFixed(2);
  }

  set errored(value) {
    this._errored = value;
  }

  set id(value) {
    this._id = value;
  }

  set priceChange24(value) {
    this._priceChange24 = value;
  }

  get priceChange24() {
    return this._priceChange24;
  }

  get id() {
    return this._id;
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
    super(XRP, "ripple", ...args);
  }
}

export class EOSWallet extends Wallet {
  constructor(...args) {
    super(EOS, "eos", ...args);
  }
}

export class ETHWallet extends Wallet {
  constructor(...args) {
    super(ETH, "ethereum", ...args);
  }
}

export class NEOWallet extends Wallet {
  constructor(...args) {
    super(NEO, "neo", ...args);
  }
}
