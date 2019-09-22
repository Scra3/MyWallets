import { ETH, XRP, EOS, NEO } from "@/constants.js";

class Wallet {
  constructor(coin, balance = 0, prices = []) {
    this.coin = coin;
    this.balance = parseFloat(balance);
    this.prices = prices;
    this.errored = false;
  }

  value() {
    if (this.errored) {
      return 0;
    }
    return parseFloat(this.lastPrice() * this.balance).toFixed(2);
  }

  change() {
    if (this.prices.length === 0 || !this.prices) {
      return 0;
    }

    const currentPrice = this.prices[this.prices.length - 1][1];
    const firsPrice = this.prices[0][1];
    return parseFloat(((currentPrice - firsPrice) * 100) / firsPrice).toFixed(
      2
    );
  }

  lastPrice() {
    if (this.prices.length === 0 || !this.prices) {
      return undefined;
    }

    return parseFloat(this.prices[this.prices.length - 1][1]).toFixed(2);
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
