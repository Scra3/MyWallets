const httpModule = require("tns-core-modules/http");

const fetchXRPWallet = async address =>
  httpModule.getJSON(
    `https://data.ripple.com/v2/accounts/${address}/balance_changes?descending=true&limit=1)`
  );

const fetchXRPPrice = async () =>
  httpModule.getJSON(
    "https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=eur"
  );
export { fetchXRPWallet, fetchXRPPrice };
