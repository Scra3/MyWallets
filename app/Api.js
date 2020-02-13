import * as httpModule from 'tns-core-modules/http'
import { Coin } from '@/models/Coin'

const fetchCoinsMarket = async currency => {
  const coinsMarket = await httpModule.getJSON(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.acronym}&order=market_cap_desc&per_page=200&page=1&sparkline=false`
  )

  return coinsMarket.map(coin => new Coin().deserialize(coin))
}

const fetchWalletsCoinMarket = async (wallets, currency) => {
  const ids = wallets.map(wallet => wallet.coin.id).join(',')
  const coinsMarket = await httpModule.getJSON(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.acronym}&ids=${ids}&order=market_cap_desc&per_page=200&page=1&sparkline=false`
  )

  return wallets.map(wallet => {
    const coin = coinsMarket.find(w => w.id === wallet.coin.id)
    wallet.coin = new Coin().deserialize(coin)
    return wallet
  })
}

const fetchXRPWalletBalance = async wallet => {
  const fetchedWallet = await httpModule.getJSON(
    `https://data.ripple.com/v2/accounts/${wallet.address}/balance_changes?descending=true&limit=1)`
  )
  return parseFloat(fetchedWallet.balance_changes[0].final_balance)
}

const checkEOSAccountValidity = async accountName => {
  let httpResponse = await httpModule.request({
    url: 'https://eos.greymass.com/v1/chain/get_account',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    content: JSON.stringify({ account_name: accountName })
  })
  return httpResponse.statusCode === 200
}

const fetchEOSWalletBalance = async wallet => {
  let fetchedWallet = await httpModule.request({
    url: 'https://eos.greymass.com/v1/chain/get_account',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    content: JSON.stringify({ account_name: wallet.address })
  })
  fetchedWallet = fetchedWallet.content.toJSON()

  const removeEOSUnit = value => value.slice(0, -4)

  const available = parseFloat(removeEOSUnit(fetchedWallet.core_liquid_balance))
  const cpuStaked = parseFloat(
    removeEOSUnit(fetchedWallet.total_resources.cpu_weight)
  )

  return parseFloat(available + cpuStaked * 2)
}

const fetchETHWalletBalance = async wallet => {
  const fetchedWallet = await httpModule.getJSON(
    `https://api.etherscan.io/api?module=account&action=balance&address=${wallet.address}&tag=latest&apikey=R9D635X3ZRAJHHWH7E4TVJ4IE8N7GBE8QF`
  )

  return parseFloat(fetchedWallet.result) / 1000000000000000000
}

const fetchNEOWalletBalance = async wallet => {
  const fetchedWallet = await httpModule.getJSON(
    `https://api.neoscan.io/api/main_net/v1/get_balance/${wallet.address}`
  )
  return parseFloat(fetchedWallet.balance[0].amount)
}

const fetchBTCWalletBalance = async wallet => {
  const fetchedWallet = await httpModule.getJSON(
    `https://blockchain.info/balance?active=${wallet.address}`
  )

  return parseFloat(fetchedWallet[wallet.address].final_balance) / 100000000
}

const fetchCryptoFear = async () => {
  const cryptoFear = await httpModule.getJSON(`https://api.alternative.me/fng/`)
  return cryptoFear.data[0].value
}

export {
  fetchXRPWalletBalance,
  fetchETHWalletBalance,
  checkEOSAccountValidity,
  fetchEOSWalletBalance,
  fetchNEOWalletBalance,
  fetchBTCWalletBalance,
  fetchWalletsCoinMarket,
  fetchCoinsMarket,
  fetchCryptoFear
}
