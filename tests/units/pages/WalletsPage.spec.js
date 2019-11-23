import { shallowMount } from '@vue/test-utils'
import WalletsPage from '@/pages/WalletsPage'
import { USD } from '@/constants.js'
import { Coin } from '@/models/Coin'
import { Wallet } from '@/models/Wallet'
import flushPromises from 'flush-promises'
jest.mock('@/Api')
import { fetchWalletsMarket } from '@/Api'

let wrapper
const coin = new Coin(
  'xrp',
  'Ripple',
  96,
  7.17426,
  6,
  'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
  'xrp'
)
const walletA = new Wallet(coin, 10)
const walletB = new Wallet(coin, 11)

describe('WalletsPage.vue', () => {
  beforeEach(async () => {
    fetchWalletsMarket.mockImplementation(() =>
      Promise.resolve([walletA, walletB])
    )

    wrapper = shallowMount(WalletsPage, {
      propsData: {
        currency: USD
      }
    })
    wrapper.setData({ investment: 10 })

    await flushPromises()
  })

  it('displays wallets value in header', () => {
    expect(wrapper.find("[data-test='wallets-value']").props().value).toEqual(
      2016
    )
  })

  it('displays wallets price change in 24h in header', () => {
    expect(
      wrapper.find("[data-test='wallets-price-change']").props().value
    ).toEqual(10 * 6 + 11 * 6)
    expect(
      wrapper.find("[data-test='wallets-price-change']").props().unit
    ).toEqual('$ (24h)')
  })

  it('displays wallets ratio', () => {
    expect(wrapper.find("[data-test='wallets-ratio']").props().value).toEqual(
      Number(
        (((walletA.value() + walletB.value()) / 10) * 100 - 100).toFixed(2)
      )
    )
    expect(wrapper.find("[data-test='wallets-ratio']").props().unit).toEqual(
      '%'
    )
  })

  it('displays each wallet infos', () => {
    expect(wrapper.find("[data-test='image']").attributes().src).toEqual(
      'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579'
    )
    expect(wrapper.find("[data-test='name']").attributes().text).toEqual(
      'Ripple'
    )
    expect(wrapper.find("[data-test='balance']").attributes().text).toEqual(
      '11.00 XRP'
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

  it('displays spinner and reset states when fetching wallets', () => {
    wrapper.setData({ isLoading: false, isFailedToLoad: true })
    wrapper.vm.fetchWallets()

    expect(wrapper.find('ActivityIndicator-stub').exists()).toBe(true)
    expect(wrapper.vm.isLoading).toBe(true)
    expect(wrapper.vm.isFailedToLoad).toBe(false)
  })

  it('does not display spinner when fetching wallets is finished', async () => {
    await wrapper.vm.fetchWallets()

    expect(wrapper.find('ActivityIndicator-stub').exists()).toBe(false)
    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('displays information message when there is no added wallets', () => {
    wrapper.setData({ wallets: [] })

    expect(wrapper.find("[data-test='information-message'").exists()).toBe(true)
  })

  it('displays error message when fetching wallet or market has a problem', async () => {
    fetchWalletsMarket.mockImplementation(() => Promise.reject('fail'))

    await wrapper.vm.fetchWallets()

    expect(wrapper.find("[data-test='error-message']").exists()).toBe(true)
  })

  it('stops refreshing list when fetching wallet has error', async () => {
    fetchWalletsMarket.mockImplementation(() => Promise.reject('fail'))

    const event = { object: { refreshing: true } }
    await wrapper.vm.refresh(event)

    expect(event.object.refreshing).toEqual(false)
  })
})
