const httpModule = require("tns-core-modules/http");
import { ETH, XRP, EOS, NEO } from "@/constants.js";

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
  try {
    const pWallet = httpModule.getJSON(
      `https://data.ripple.com/v2/accounts/${address}/balance_changes?descending=true&limit=1)`
    );
    const pPrice = fetchXRPPrice();
    let [price, wallet] = await Promise.all([pPrice, pWallet]);

    const balance = parseFloat(wallet.balance_changes[0].final_balance);
    price = parseFloat(price.ripple.usd);

    return {
      currency: XRP,
      balance: balance,
      value: (price * balance).toFixed(2),
      price: price
    };
  } catch (error) {
    console.log(error);
    throw "Xrp address is probably incorrect";
  }
};

const fetchEOSWallet = async accountName => {
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
    const balance = parseFloat(available + cpuStaked * 2);
    price = parseFloat(price.eos.usd);

    return {
      currency: EOS,
      balance: balance,
      value: (price * balance).toFixed(2),
      price: price
    };
  } catch (error) {
    console.log(error);
    throw "EOS address is probably incorrect";
  }
};

const fetchETHWallet = async address => {
  try {
    const pWallet = httpModule.getJSON(
      `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=R9D635X3ZRAJHHWH7E4TVJ4IE8N7GBE8QF`
    );
    const pPrice = fetchXETHPrice();
    let [price, wallet] = await Promise.all([pPrice, pWallet]);

    const balance = parseFloat(wallet.result) / 1000000000000000000;
    price = parseFloat(price.ethereum.usd);

    return {
      currency: ETH,
      balance: balance,
      value: (price * balance).toFixed(2),
      price: price.toFixed(2)
    };
  } catch (error) {
    console.log(error);
    throw "ETH address is probably incorrect";
  }
};

const fetchNEOWallet = async address => {
  try {
    const pWallet = httpModule.getJSON(
      `https://api.neoscan.io/api/main_net/v1/get_balance/${address}`
    );
    const pPrice = fetchXNEOPrice();
    let [price, wallet] = await Promise.all([pPrice, pWallet]);

    const balance = parseFloat(wallet.balance[0].amount);
    price = parseFloat(price.neo.usd);

    return {
      currency: NEO,
      balance: balance,
      value: (price * balance).toFixed(2),
      price: price
    };
  } catch (error) {
    console.log(error);
    throw "NEO address is probably incorrect";
  }
};

export { fetchXRPWallet, fetchETHWallet, fetchEOSWallet, fetchNEOWallet };
