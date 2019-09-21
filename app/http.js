import * as httpModule from "tns-core-modules/http";
import { XRPWallet, EOSWallet, ETHWallet, NEOWallet } from "@/models/Wallet.js";

const fetchXRPPrice = async currency =>
  httpModule.getJSON(
    `https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=${currency}`
  );

const fetchXETHPrice = async currency =>
  httpModule.getJSON(
    `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=${currency}`
  );

const fetchXEOSPrice = async currency =>
  httpModule.getJSON(
    `https://api.coingecko.com/api/v3/simple/price?ids=eos&vs_currencies=${currency}`
  );

const fetchXNEOPrice = async currency =>
  httpModule.getJSON(
    `https://api.coingecko.com/api/v3/simple/price?ids=neo&vs_currencies=${currency}`
  );

const fetchXRPWallet = async (address, currency) => {
  const xrpWallet = new XRPWallet();

  try {
    const pWallet = httpModule.getJSON(
      `https://data.ripple.com/v2/accounts/${address}/balance_changes?descending=true&limit=1)`
    );
    const pPrice = fetchXRPPrice(currency);
    const date = new Date();
    const pPrices = fetchPricesRange(
      Math.floor(date.setDate(date.getDate() - 1) / 1000),
      Math.floor(Date.now() / 1000),
      "ripple",
      currency
    );

    let [price, wallet, { prices }] = await Promise.all([
      pPrice,
      pWallet,
      pPrices
    ]);

    xrpWallet.balance = wallet.balance_changes[0].final_balance;
    xrpWallet.price = price.ripple[currency];
    xrpWallet.prices = prices;

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
    const pWallet = httpModule.request({
      url: "https://eos.greymass.com/v1/chain/get_account",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      content: JSON.stringify({ account_name: accountName })
    });

    const date = new Date();
    const pPrices = fetchPricesRange(
      Math.floor(date.setDate(date.getDate() - 1) / 1000),
      Math.floor(Date.now() / 1000),
      "eos",
      currency
    );

    const pPrice = fetchXEOSPrice(currency);
    let [price, wallet, { prices }] = await Promise.all([
      pPrice,
      pWallet,
      pPrices
    ]);

    wallet = wallet.content.toJSON();

    const removeEOSUnit = value => value.slice(0, -4);

    const available = parseFloat(removeEOSUnit(wallet.core_liquid_balance));
    const cpuStaked = parseFloat(
      removeEOSUnit(wallet.total_resources.cpu_weight)
    );

    eosWallet.balance = available + cpuStaked * 2;
    eosWallet.price = price.eos[currency];
    eosWallet.prices = prices;

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
    const pWallet = httpModule.getJSON(
      `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=R9D635X3ZRAJHHWH7E4TVJ4IE8N7GBE8QF`
    );
    const date = new Date();
    const pPrices = fetchPricesRange(
      Math.floor(date.setDate(date.getDate() - 1) / 1000),
      Math.floor(Date.now() / 1000),
      "ethereum",
      currency
    );
    const pPrice = fetchXETHPrice(currency);

    let [price, wallet, { prices }] = await Promise.all([
      pPrice,
      pWallet,
      pPrices
    ]);

    ethWallet.balance = parseFloat(wallet.result) / 1000000000000000000;
    ethWallet.price = price.ethereum[currency];
    ethWallet.prices = prices;

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
    const pWallet = httpModule.getJSON(
      `https://api.neoscan.io/api/main_net/v1/get_balance/${address}`
    );
    const pPrice = fetchXNEOPrice(currency);
    const date = new Date();
    const pPrices = fetchPricesRange(
      Math.floor(date.setDate(date.getDate() - 1) / 1000),
      Math.floor(Date.now() / 1000),
      "neo",
      currency
    );

    let [price, wallet, { prices }] = await Promise.all([
      pPrice,
      pWallet,
      pPrices
    ]);

    neoWallet.balance = wallet.balance[0].amount;
    neoWallet.price = price.neo[currency];
    neoWallet.prices = prices;

    return neoWallet;
  } catch (error) {
    console.log(error);

    neoWallet.errored = true;
    return neoWallet;
  }
};

const fetchPricesRange = (from, to, coin, currency) => {
  try {
    return httpModule.getJSON(
      `https://api.coingecko.com/api/v3/coins/${coin}/market_chart/range?vs_currency=${currency}&from=${from}&to=${to}`
    );
  } catch (error) {
    console.log(error);
  }
};

export {
  fetchXRPWallet,
  fetchETHWallet,
  fetchEOSWallet,
  fetchNEOWallet,
  fetchPricesRange
};
