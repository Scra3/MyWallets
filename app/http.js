import * as httpModule from "tns-core-modules/http";
import { XRPWallet, EOSWallet, ETHWallet, NEOWallet } from "@/models/Wallet.js";

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
    let [price, wallet] = await Promise.all([pPrice, pWallet]);

    xrpWallet.balance = wallet.balance_changes[0].final_balance;
    xrpWallet.price = price.ripple[currency];

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

    const pPrice = fetchXEOSPrice(currency);
    let [price, wallet] = await Promise.all([pPrice, pWallet]);

    wallet = wallet.content.toJSON();

    const removeEOSUnit = value => value.slice(0, -4);

    const available = parseFloat(removeEOSUnit(wallet.core_liquid_balance));
    const cpuStaked = parseFloat(
      removeEOSUnit(wallet.total_resources.cpu_weight)
    );

    eosWallet.balance = available + cpuStaked * 2;
    eosWallet.price = price.eos[currency];
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
    const pPrice = fetchXETHPrice(currency);
    let [price, wallet] = await Promise.all([pPrice, pWallet]);

    ethWallet.balance = parseFloat(wallet.result) / 1000000000000000000;
    ethWallet.price = price.ethereum[currency];

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
    let [price, wallet] = await Promise.all([pPrice, pWallet]);

    neoWallet.balance = wallet.balance[0].amount;
    neoWallet.price = price.neo[currency];
    return neoWallet;
  } catch (error) {
    console.log(error);

    neoWallet.errored = true;
    return neoWallet;
  }
};

export { fetchXRPWallet, fetchETHWallet, fetchEOSWallet, fetchNEOWallet };
