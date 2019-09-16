import { ETH, XRP, EOS, NEO } from "@/constants.js";

class Wallet {
  constructor(currency, balance = 0, price = 0) {
    this.currency = currency;
    this.balance = parseFloat(balance).toFixed(2);
    this.price = parseFloat(price).toFixed(2);
    this.errored = false;
  }

  value() {
    if (this.errored) {
      return 0;
    }
    return parseFloat(this.price * this.balance).toFixed(2);
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
