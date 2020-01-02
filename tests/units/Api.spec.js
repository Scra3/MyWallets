import * as httpModule from 'tns-core-modules/http'
import {
  fetchCoinsMarket,
  fetchWalletsMarket,
  checkEOSAccountValidity
} from '@/Api'
import { Coin } from '@/models/Coin'
import { USD, XRP, BTC } from '@/constants'
import { Wallet } from '@/models/Wallet'

describe('Api.js', () => {
  let coins

  describe('checkEOSAccountValidity function', () => {
    it('returns true when account name is valid', async () => {
      httpModule.request.mockImplementation(() =>
        Promise.resolve({ statusCode: 200 })
      )

      expect(await checkEOSAccountValidity('scra')).toEqual(true)
    })

    it('returns false when account name is valid', async () => {
      httpModule.request.mockImplementation(() =>
        Promise.resolve({ statusCode: 500 })
      )

      expect(await checkEOSAccountValidity('badAccountName')).toEqual(false)
    })
  })

  describe('fetchCoinsMarket function', () => {
    beforeEach(async () => {
      httpModule.getJSON.mockImplementation(() =>
        Promise.resolve([
          {
            id: BTC,
            symbol: 'btc',
            name: 'Bitcoin',
            image:
              'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
            current_price: 9668.09,
            market_cap: 174138329047,
            market_cap_rank: 1,
            total_volume: 37724532035,
            high_24h: 9699.48,
            low_24h: 9020.9,
            price_change_24h: 647.18,
            price_change_percentage_24h: 7.17426,
            market_cap_change_24h: 11628273395,
            market_cap_change_percentage_24h: 7.15542,
            circulating_supply: 18016125,
            total_supply: 21000000,
            ath: 19665.39,
            ath_change_percentage: -50.9156,
            ath_date: '2017-12-16T00:00:00.000Z',
            roi: null,
            last_updated: '2019-10-27T20:35:48.744Z'
          }
        ])
      )
    })

    it('returns an list of coins', async () => {
      coins = [
        new Coin(
          BTC,
          'Bitcoin',
          9668.09,
          7.17426,
          647.18,
          'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
          'btc'
        )
      ]
      expect(await fetchCoinsMarket(USD)).toEqual(coins)
    })
  })

  describe('fetchWalletsMarket function', () => {
    beforeEach(async () => {
      httpModule.getJSON.mockImplementation(() =>
        Promise.resolve([
          {
            id: XRP,
            symbol: 'XRP',
            name: 'Ripple',
            image:
              'https://assets.coingecko.com/coins/images/1/large/ripple.png?1547033579',
            current_price: 9.09,
            market_cap: 174138329047,
            market_cap_rank: 1,
            total_volume: 37724532035,
            high_24h: 9699.48,
            low_24h: 9020.9,
            price_change_24h: 647.18,
            price_change_percentage_24h: 7.17426,
            market_cap_change_24h: 11628273395,
            market_cap_change_percentage_24h: 7.15542,
            circulating_supply: 18016125,
            total_supply: 21000000,
            ath: 19665.39,
            ath_change_percentage: -50.9156,
            ath_date: '2017-12-16T00:00:00.000Z',
            roi: null,
            last_updated: '2019-10-27T20:35:48.744Z'
          }
        ])
      )
    })

    it('returns an list of hydrated wallets', async () => {
      const wallet = (
        await fetchWalletsMarket(
          [new Wallet(new Coin(XRP), 10, 'fakeAddress')],
          USD
        )
      )[0]
      expect(wallet.coin.symbol).toEqual('XRP')
      expect(wallet.coin.priceChangePercentage24H).toEqual(7.17426)
      expect(wallet.coin.currentPrice).toEqual(9.09)
      expect(wallet.coin.priceChange24H).toEqual(647.18)
      expect(wallet.coin.name).toEqual('Ripple')
      expect(wallet.coin.image).toEqual(
        'https://assets.coingecko.com/coins/images/1/large/ripple.png?1547033579'
      )
    })
  })
})
