import { Wallet } from '@/models/Wallet'
import { Coin } from '@/models/Coin'

describe('Wallet.js', () => {
  let coin
  let wallet

  beforeEach(() => {
    coin = new Coin(
      'bitcoin',
      'Bitcoin',
      9000.5999,
      7.5,
      500.862,
      'http://fake.url.com',
      'btc'
    )
    wallet = new Wallet(coin, 10, 'fakeAddress')
  })

  it('returns value', () => {
    expect(wallet.value()).toEqual(90006.0)
  })

  it('returns null value when coin current price is null', () => {
    coin.currentPrice = null
    expect(wallet.value()).toEqual(null)
  })

  it('returns null value when wallet balance is null', () => {
    wallet.balance = null
    expect(wallet.value()).toEqual(null)
  })
})
