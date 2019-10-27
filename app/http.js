import * as httpModule from "tns-core-modules/http"
import { XRPWallet, EOSWallet, ETHWallet, NEOWallet } from "@/models/Wallet.js"
import { Coin } from "@/models/Coin.js"

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
const fetchMarket = async currency => {
  const coinsMarket = await httpModule.getJSON(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
  )

  return coinsMarket.map(c => {
    const coin = new Coin(
      c.id,
      c.name,
      c.current_price,
      c.price_change_percentage_24h,
      c.price_change_24h,
      c.image
    )

    return coin
  })
}

const fetchWalletsMarket = async (wallets, currency) => {
  const ids = wallets.map(wallet => wallet.coin.id).join(",")
  const coinsMarket = await httpModule.getJSON(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${ids}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
  )

  return wallets.map(wallet => {
    const coin = coinsMarket.find(w => w.id === wallet.coin.id)

    wallet.coin.priceChangePercentage24h = coin.price_change_percentage_24h
    wallet.coin.currentPrice = coin.current_price
    wallet.coin.priceChange24 = coin.price_change_24h
    wallet.coin.image = coin.image
    wallet.coin.name = coin.name
    wallet.coin.symbol = coin.symbol
    return wallet
  })
}

const fetchXRPWallet = async address => {
  try {
    const wallet = await httpModule.getJSON(
      `https://data.ripple.com/v2/accounts/${address}/balance_changes?descending=true&limit=1)`
    )

    return new XRPWallet(wallet.balance_changes[0].final_balance)
  } catch (error) {
    console.log(error)
  }
}

const fetchEOSWallet = async accountName => {
  try {
    let wallet = await httpModule.request({
      url: "https://eos.greymass.com/v1/chain/get_account",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      content: JSON.stringify({ account_name: accountName })
    })
    wallet = wallet.content.toJSON()

    const removeEOSUnit = value => value.slice(0, -4)

    const available = parseFloat(removeEOSUnit(wallet.core_liquid_balance))
    const cpuStaked = parseFloat(
      removeEOSUnit(wallet.total_resources.cpu_weight)
    )

    return new EOSWallet(available + cpuStaked * 2)
  } catch (error) {
    console.log(error)
  }
}

const fetchETHWallet = async address => {
  try {
    const wallet = await httpModule.getJSON(
      `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=R9D635X3ZRAJHHWH7E4TVJ4IE8N7GBE8QF`
    )
    return new ETHWallet(parseFloat(wallet.result) / 1000000000000000000)
  } catch (error) {
    console.log(error)
  }
}

const fetchNEOWallet = async address => {
  try {
    const wallet = await httpModule.getJSON(
      `https://api.neoscan.io/api/main_net/v1/get_balance/${address}`
    )

    return new NEOWallet(wallet.balance[0].amount)
  } catch (error) {
    console.log(error)
  }
}

export {
  fetchXRPWallet,
  fetchETHWallet,
  fetchEOSWallet,
  fetchNEOWallet,
  fetchWalletsMarket,
  fetchMarket
}
