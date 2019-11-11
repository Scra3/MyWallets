import * as httpModule from 'tns-core-modules/http'
import { XRPWallet, EOSWallet, ETHWallet, NEOWallet } from '@/models/Wallet'
import { Coin } from '@/models/Coin'

const fetchMarket = async currency => {
  const coinsMarket = await httpModule.getJSON(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
  )

  return coinsMarket.map(
    coin =>
      new Coin(
        coin.id,
        coin.name,
        coin.current_price,
        coin.price_change_percentage_24h,
        coin.price_change_24h,
        coin.image
      )
  )
}

const fetchWalletsMarket = async (wallets, currency) => {
  const ids = wallets.map(wallet => wallet.coin.id).join(',')
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
  const wallet = await httpModule.getJSON(
    `https://data.ripple.com/v2/accounts/${address}/balance_changes?descending=true&limit=1)`
  )

  return new XRPWallet(wallet.balance_changes[0].final_balance)
}

const fetchEOSWallet = async accountName => {
  let wallet = await httpModule.request({
    url: 'https://eos.greymass.com/v1/chain/get_account',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    content: JSON.stringify({ account_name: accountName })
  })
  wallet = wallet.content.toJSON()

  const removeEOSUnit = value => value.slice(0, -4)

  const available = parseFloat(removeEOSUnit(wallet.core_liquid_balance))
  const cpuStaked = parseFloat(removeEOSUnit(wallet.total_resources.cpu_weight))

  return new EOSWallet(available + cpuStaked * 2)
}

const fetchETHWallet = async address => {
  const wallet = await httpModule.getJSON(
    `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=R9D635X3ZRAJHHWH7E4TVJ4IE8N7GBE8QF`
  )
  return new ETHWallet(parseFloat(wallet.result) / 1000000000000000000)
}

const fetchNEOWallet = async address => {
  const wallet = await httpModule.getJSON(
    `https://api.neoscan.io/api/main_net/v1/get_balance/${address}`
  )
  return new NEOWallet(wallet.balance[0].amount)
}

export {
  fetchXRPWallet,
  fetchETHWallet,
  fetchEOSWallet,
  fetchNEOWallet,
  fetchWalletsMarket,
  fetchMarket
}
