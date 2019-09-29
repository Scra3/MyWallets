import * as httpModule from "tns-core-modules/http";
import { XRPWallet, EOSWallet, ETHWallet, NEOWallet } from "@/models/Wallet.js";

const fetchWalletsMarket = async (wallets, currency) => {
  const ids = wallets.map(wallet => wallet.id).join(",");

  /*
    {
      "id": "eos",
      "symbol": "eos",
      "name": "EOS",
      "image": "https://assets.coingecko.com/coins/images/738/large/eos-eos-logo.png?1547034481",
      "current_price": 2.79,
      "market_cap": 2872054092,
      "market_cap_rank": 7,
      "total_volume": 1411009423,
      "high_24h": 2.87,
      "low_24h": 2.77,
      "price_change_24h": -0.0453254,
      "price_change_percentage_24h": -1.59711,
      "market_cap_change_24h": -46583115.64140131,
      "market_cap_change_percentage_24h": -1.59606,
      "circulating_supply": 1028457746.7103,
      "total_supply": null,
      "ath": 22.71,
      "ath_change_percentage": -87.70379,
      "ath_date": "2018-04-29T07:50:33.540Z",
      "roi": {
        "times": 1.8208647454663405,
        "currency": "usd",
        "percentage": 182.08647454663404
      },
      "last_updated": "2019-09-29T08:40:04.005Z"
    }
   */
  const walletsMarket = await httpModule.getJSON(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${ids}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
  );

  wallets.forEach(wallet => {
    const walletMarket = walletsMarket.find(w => w.id === wallet.id);

    wallet.priceChangePercentage24h = walletMarket.price_change_percentage_24h;
    wallet.currentPrice = walletMarket.current_price;
  });

  return wallets;
};

const fetchXRPWallet = async address => {
  const xrpWallet = new XRPWallet();

  try {
    const wallet = await httpModule.getJSON(
      `https://data.ripple.com/v2/accounts/${address}/balance_changes?descending=true&limit=1)`
    );

    xrpWallet.balance = wallet.balance_changes[0].final_balance;
    return xrpWallet;
  } catch (error) {
    console.log(error);

    xrpWallet.errored = true;
    return xrpWallet;
  }
};

const fetchEOSWallet = async (accountName, currency) => {
  const eosWallet = new EOSWallet(currency);

  try {
    let wallet = await httpModule.request({
      url: "https://eos.greymass.com/v1/chain/get_account",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      content: JSON.stringify({ account_name: accountName })
    });
    wallet = wallet.content.toJSON();

    const removeEOSUnit = value => value.slice(0, -4);

    const available = parseFloat(removeEOSUnit(wallet.core_liquid_balance));
    const cpuStaked = parseFloat(
      removeEOSUnit(wallet.total_resources.cpu_weight)
    );

    eosWallet.balance = available + cpuStaked * 2;

    return eosWallet;
  } catch (error) {
    console.log(error);

    eosWallet.errored = true;
    return eosWallet;
  }
};

const fetchETHWallet = async (address, currency) => {
  const ethWallet = new ETHWallet(currency);

  try {
    const wallet = await httpModule.getJSON(
      `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=R9D635X3ZRAJHHWH7E4TVJ4IE8N7GBE8QF`
    );
    ethWallet.balance = parseFloat(wallet.result) / 1000000000000000000;

    return ethWallet;
  } catch (error) {
    console.log(error);

    ethWallet.errored = true;
    return ethWallet;
  }
};

const fetchNEOWallet = async (address, currency) => {
  const neoWallet = new NEOWallet(currency);

  try {
    const wallet = await httpModule.getJSON(
      `https://api.neoscan.io/api/main_net/v1/get_balance/${address}`
    );

    neoWallet.balance = wallet.balance[0].amount;

    return neoWallet;
  } catch (error) {
    console.log(error);

    neoWallet.errored = true;
    return neoWallet;
  }
};

export {
  fetchXRPWallet,
  fetchETHWallet,
  fetchEOSWallet,
  fetchNEOWallet,
  fetchWalletsMarket
};
