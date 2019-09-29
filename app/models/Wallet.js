import { ETH, XRP, EOS, NEO } from "@/constants.js";
import { Coin } from "@/models/Coin.js";

export class Wallet {
  constructor(coin, balance) {
    this._coin = coin;
    this._balance = balance;
    this._errored = false;
  }

  value() {
    if (this.errored || !this._coin._currentPrice || !this._balance) {
      return null;
    }
    return parseFloat(this._coin._currentPrice * this._balance).toFixed(2);
  }

  get coin() {
    return this._coin;
  }

  set coin(value) {
    this._coin = value;
  }

  get balance() {
    return this._balance;
  }

  set balance(value) {
    this._balance = value;
  }

  get errored() {
    return this._errored;
  }

  set errored(value) {
    this._errored = value;
  }
}

export class XRPWallet extends Wallet {
  constructor(balance) {
    super(new Coin("ripple", XRP), balance);
  }
}

export class EOSWallet extends Wallet {
  constructor(balance) {
    super(new Coin("eos", EOS), balance);
  }
}

export class ETHWallet extends Wallet {
  constructor(balance) {
    super(new Coin("ethereum", ETH), balance);
  }
}

export class NEOWallet extends Wallet {
  constructor(balance) {
    super(new Coin("neo", NEO), balance);
  }
}
