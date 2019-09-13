const httpModule = require("tns-core-modules/http");
import { ETH, XRP, EOS } from "@/constants.js";

const fetchXRPPrice = async () =>
  httpModule.getJSON(
    "https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=eur"
  );

const fetchXETHPrice = async () =>
  httpModule.getJSON(
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=eur"
  );

const fetchXEOSPrice = async () =>
  httpModule.getJSON(
    "https://api.coingecko.com/api/v3/simple/price?ids=eos&vs_currencies=eur"
  );

const fetchXRPWallet = async address => {
  try {
    const pWallet = httpModule.getJSON(
      `https://data.ripple.com/v2/accounts/${address}/balance_changes?descending=true&limit=1)`
    );
    const pPrice = fetchXRPPrice();
    const [price, wallet] = await Promise.all([pPrice, pWallet]);

    const balance = parseFloat(wallet.balance_changes[0].final_balance);
    return {
      currency: XRP,
      balance: balance,
      value: (price.ripple.eur * balance).toFixed(2)
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
    const cpuStaked = parseFloat(removeEOSUnit(wallet.core_liquid_balance));
    const balance = parseFloat(available + cpuStaked * 2);

    return {
      currency: EOS,
      balance: balance,
      value: (price.eos.eur * balance).toFixed(2)
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
    const [price, wallet] = await Promise.all([pPrice, pWallet]);

    const balance = parseFloat(wallet.result) / 1000000000000000000;
    return {
      currency: ETH,
      balance: balance,
      value: (price.ethereum.eur * balance).toFixed(2)
    };
  } catch (error) {
    console.log(error);
    throw "ETH address is probably incorrect";
  }
};

export { fetchXRPWallet, fetchXRPPrice, fetchETHWallet, fetchEOSWallet };
