import { Wallet } from '@/models/Wallet'
import { Coin } from '@/models/Coin'
import { ETH, BTC } from '@/constants'

describe('Wallet.js', () => {
  let coin
  let wallet

  beforeEach(() => {
    coin = new Coin(
      BTC,
      'Bitcoin',
      9000.5999,
      7.5,
      500.862,
      'http://fake.url.com',
      'btc'
    )
    wallet = new Wallet(coin, 10, 'fakeAddress')
  })

  it('returns wallet value', () => {
    expect(wallet.value()).toEqual(90006.0)
  })

  it('throws error when coin current price is null', () => {
    coin.currentPrice = null

    expect(() => wallet.value()).toThrow(
      'balance or current price is not defined'
    )
  })

  it('throws error when wallet balance is null', () => {
    wallet.balance = null

    expect(() => wallet.value()).toThrow(
      'balance or current price is not defined'
    )
  })

  it('returns a built wallet when buildWalletFromPersistedWallet is call with persisted wallet', () => {
    const persistedWallet = {
      coinId: ETH,
      address: '0x70Fe19189628d1050cb0e14aa7A1BBc246A48183',
      isUsingLocalBalance: false
    }

    expect(Wallet.buildWalletFromPersistedWallet(persistedWallet)).toEqual(
      new Wallet(
        new Coin(ETH),
        null,
        '0x70Fe19189628d1050cb0e14aa7A1BBc246A48183',
        false
      )
    )
  })
})
