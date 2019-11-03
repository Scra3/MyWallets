import { shallowMount } from '@vue/test-utils'
import WalletsPage from '@/pages/WalletsPage'
import { USD } from '@/constants.js'
import { Coin } from '@/models/Coin'
import { Wallet } from '@/models/Wallet'
import flushPromises from 'flush-promises'

jest.mock('@/Api')
import { fetchWalletsMarket } from '@/Api'

let wrapper

describe('WalletsPage.vue', () => {
  beforeEach(async () => {
    const coin = new Coin(
      'xrp',
      'Ripple',
      96,
      7.17426,
      6,
      'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
      'xrp'
    )
    fetchWalletsMarket.mockImplementation(() =>
      Promise.resolve([new Wallet(coin, 10), new Wallet(coin, 11)])
    )

    wrapper = shallowMount(WalletsPage, {
      propsData: {
        currency: USD
      }
    })

    await flushPromises()
  })

  it('displays wallets value in header', () => {
    expect(wrapper.find("[data-test='wallets-value']").props().value).toEqual(
      2016
    )
  })

  it('displays wallet price change in 24h in header', () => {
    expect(
      wrapper.find("[data-test='wallet-price-change']").props().value
    ).toEqual(12)
  })

  it('displays each wallet infos', () => {
    expect(wrapper.find("[data-test='image']").attributes().src).toEqual(
      'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579'
    )
    expect(wrapper.find("[data-test='name']").attributes().text).toEqual(
      'Ripple'
    )
    expect(wrapper.find("[data-test='balance']").attributes().text).toEqual(
      '11 XRP'
    )
    expect(wrapper.find("[data-test='current-price']").props().value).toEqual(
      96
    )
    expect(
      wrapper.find("[data-test='change-percentage']").props().value
    ).toEqual(7.17426)
    expect(wrapper.find("[data-test='value']").props().value).toEqual(1056)
  })

  it('sorts wallets by value', () => {
    expect(
      wrapper
        .findAll("[data-test='value']")
        .at(0)
        .props().value
    ).toEqual(1056)
    expect(
      wrapper
        .findAll("[data-test='value']")
        .at(1)
        .props().value
    ).toEqual(960)
  })

  it('displays message when there is no wallets and is no loading', () => {
    wrapper.setData({ wallets: [] })
    expect(wrapper.find("[data-test='message']").exists()).toBe(true)
  })
})
