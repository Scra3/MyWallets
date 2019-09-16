import * as httpModule from "tns-core-modules/http";
import { XRPWallet, EOSWallet, ETHWallet, NEOWallet } from "@/models/Wallet.js";

const fetchXRPPrice = async () =>
  httpModule.getJSON(
    "https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd"
  );

const fetchXETHPrice = async () =>
  httpModule.getJSON(
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
  );

const fetchXEOSPrice = async () =>
  httpModule.getJSON(
    "https://api.coingecko.com/api/v3/simple/price?ids=eos&vs_currencies=usd"
  );

const fetchXNEOPrice = async () =>
  httpModule.getJSON(
    "https://api.coingecko.com/api/v3/simple/price?ids=neo&vs_currencies=usd"
  );

const fetchXRPWallet = async address => {
  const xrpWallet = new XRPWallet();

  try {
    const pWallet = httpModule.getJSON(
      `https://data.ripple.com/v2/accounts/${address}/balance_changes?descending=true&limit=1)`
    );
    const pPrice = fetchXRPPrice();
    let [price, wallet] = await Promise.all([pPrice, pWallet]);

    xrpWallet.balance = wallet.balance_changes[0].final_balance;
    xrpWallet.price = price.ripple.usd;

    return xrpWallet;
  } catch (error) {
    console.log(error);

    xrpWallet.errored = true;
    return xrpWallet;
  }
};

const fetchEOSWallet = async accountName => {
  const eosWallet = new EOSWallet();

  try {
    const pWallet = httpModule.request({
      url: "https://eos.greymass.com/v1/chain/get_account",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      content: JSON.stringify({ account_name: accountName })
    });

    const pPrice = fetchXEOSPrice();
    let [price, wallet] = await Promise.all([pPrice, pWallet]);

    wallet = wallet.content.toJSON();

    const removeEOSUnit = value => value.slice(0, -4);

    const available = parseFloat(removeEOSUnit(wallet.core_liquid_balance));
    const cpuStaked = parseFloat(
      removeEOSUnit(wallet.total_resources.cpu_weight)
    );

    eosWallet.balance = available + cpuStaked * 2;
    eosWallet.price = price.eos.usd;
    return eosWallet;
  } catch (error) {
    console.log(error);

    eosWallet.errored = true;
    return eosWallet;
  }
};

const fetchETHWallet = async address => {
  const ethWallet = new ETHWallet();

  try {
    const pWallet = httpModule.getJSON(
      `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=R9D635X3ZRAJHHWH7E4TVJ4IE8N7GBE8QF`
    );
    const pPrice = fetchXETHPrice();
    let [price, wallet] = await Promise.all([pPrice, pWallet]);

    ethWallet.balance = parseFloat(wallet.result) / 1000000000000000000;
    ethWallet.price = price.ethereum.usd;

    return ethWallet;
  } catch (error) {
    console.log(error);

    ethWallet.errored = true;
    return ethWallet;
  }
};

const fetchNEOWallet = async address => {
  const neoWallet = new NEOWallet();

  try {
    const pWallet = httpModule.getJSON(
      `https://api.neoscan.io/api/main_net/v1/get_balance/${address}`
    );
    const pPrice = fetchXNEOPrice();
    let [price, wallet] = await Promise.all([pPrice, pWallet]);

    neoWallet.balance = wallet.balance[0].amount;
    neoWallet.price = price.neo.usd;
    return neoWallet;
  } catch (error) {
    console.log(error);

    neoWallet.errored = true;
    return neoWallet;
  }
};

export { fetchXRPWallet, fetchETHWallet, fetchEOSWallet, fetchNEOWallet };
