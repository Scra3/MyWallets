import { createLocalVue, shallowMount } from '@vue/test-utils'
import WalletsView from '@/pages/WalletsView'
import { Coin } from '@/models/Coin'
import { Wallet } from '@/models/Wallet'
import CoinsPage from '@/pages/CoinsPage'
import WalletFormPage from '@/pages/WalletFormPage'
import Vuex from 'vuex'
import flushPromises from 'flush-promises'
import { fetchWalletsCoinMarket, fetchCryptoFear } from '@/Api'
import { XRP, USD } from '@/constants'
import AnalysesPage from '@/pages/AnalysesPage'
import * as firebase from 'nativescript-plugin-firebase'

jest.mock('@/Api')

const coin = new Coin(
  XRP,
  'Ripple',
  96,
  7.17426,
  6,
  'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
  'xrp'
)
const walletAInvestment = 150
const walletBInvestment = 200
const walletA = new Wallet(coin, 10, 'fakeAddressA', true, walletAInvestment, 1)
const walletB = new Wallet(coin, 11, 'fakeAddressB', true, walletBInvestment, 2)
const walletWithoutInvestment = new Wallet(coin, 11, 'fakeAddressB', true, 0, 2)

const localVue = createLocalVue()
localVue.use(Vuex)

describe('WalletsView.vue', () => {
  let actions
  let store
  let wrapper
  let $_navigateTo
  let $_showInterstitialAd

  beforeEach(() => {
    fetchWalletsCoinMarket.mockImplementation(() =>
      Promise.resolve([walletA, walletB])
    )
    fetchCryptoFear.mockImplementation(() => Promise.resolve(20))

    actions = {
      selectAll: jest.fn(),
      select: jest.fn(),
      update: jest.fn(),
      insert: jest.fn()
    }

    store = new Vuex.Store({
      modules: {
        walletManager: {
          namespaced: true,
          state: { persistedWallets: null },
          actions
        }
      }
    })
  })

  $_navigateTo = jest.fn()
  $_showInterstitialAd = jest.fn(() => Promise.resolve(true))

  beforeEach(async () => {
    wrapper = shallowMount(WalletsView, {
      localVue,
      store,
      propsData: {
        currency: USD
      },
      methods: {
        fetchDataLoop: jest.fn(),
        $_navigateTo,
        $_preloadInterstitialAd: jest.fn(),
        $_showInterstitialAd
      }
    })

    await flushPromises()
  })

  it('displays wallets value in header', () => {
    expect(wrapper.findDataTest('wallets-value').props().value).toEqual(2016)
  })

  it('navigates to analyses page when analyses button is tapped', () => {
    wrapper.findDataTest('analysis-button').vm.$emit('tap')

    expect($_navigateTo).toHaveBeenCalledWith(AnalysesPage, {
      props: { wallets: wrapper.vm.wallets, currency: wrapper.vm.currency }
    })
  })

  it('displays wallets price change in 24h in header', () => {
    expect(wrapper.findDataTest('wallets-price-change').props().value).toEqual(
      10 * 6 + 11 * 6
    )
    expect(wrapper.findDataTest('wallets-price-change').props().unit).toEqual(
      '$'
    )
  })

  it('displays wallets ratio', () => {
    expect(wrapper.findDataTest('wallets-ratio').props().value).toEqual(
      Number(
        (
          ((walletA.value() + walletB.value()) /
            (walletAInvestment + walletBInvestment)) *
            100 -
          100
        ).toFixed(2)
      )
    )
    expect(wrapper.findDataTest('wallets-ratio').props().unit).toEqual('%')
  })

  it('does not display wallets ratio when total investment is equal to 0', () => {
    wrapper.setData({ wallets: [walletWithoutInvestment] })
    expect(wrapper.findDataTest('wallets-ratio').exists()).toBe(false)
  })

  it('does not display wallets price when total investment is equal to 0', () => {
    wrapper.setData({ wallets: [walletWithoutInvestment] })
    expect(wrapper.findDataTest('wallets-price').exists()).toBe(false)
  })

  it('musts ignore the wallets with null investment to count total investment', () => {
    walletB.investment = null
    walletA.investment = 100
    wrapper.setData({ wallets: [walletA, walletB] })

    expect(wrapper.vm.totalInvestment).toEqual(100)
  })

  it('displays each wallet infos', () => {
    expect(wrapper.findDataTest('image').attributes().src).toEqual(
      'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579'
    )
    expect(wrapper.findDataTest('name').attributes().text).toEqual('Ripple')
    expect(wrapper.findDataTest('balance').attributes().text).toEqual('11 XRP')
    expect(wrapper.findDataTest('current-price').props().value).toEqual(96)
    expect(wrapper.findDataTest('change-percentage').props().value).toEqual(
      7.17426
    )
    expect(wrapper.findDataTest('value').props().value).toEqual(1056)
  })

  it('sorts wallets by value', () => {
    expect(wrapper.findDataTest('value').props().value).toEqual(1056)
    expect(
      wrapper
        .findAllDataTests('value')
        .at(1)
        .props().value
    ).toEqual(960)
  })

  it('displays spinner and reset states when fetching data only when there is no fetched wallets', () => {
    wrapper.setData({ wallets: [] })

    wrapper.vm.fetchData()

    expect(wrapper.find('ActivityIndicator-stub').isVisible()).toBe(true)
  })

  it('does not display spinner when fetching wallets is finished', async () => {
    await wrapper.vm.fetchWallets()

    expect(wrapper.find('ActivityIndicator-stub').exists()).toBe(false)
  })

  it('displays information message when there is no added wallets', () => {
    wrapper.setData({ wallets: [] })

    expect(wrapper.findDataTest('information-message').exists()).toBe(true)
  })

  it('displays error message when fetching data has a problem', async () => {
    wrapper.setData({ wallets: [] })
    fetchWalletsCoinMarket.mockImplementation(() => Promise.reject('fail'))

    await wrapper.vm.fetchData()

    expect(wrapper.findDataTest('error-message').isVisible()).toBe(true)
  })

  it('stops refreshing list when fetching wallet has error', async () => {
    fetchWalletsCoinMarket.mockImplementation(() => Promise.reject('fail'))

    const event = { object: { refreshing: true } }
    await wrapper.vm.refresh(event)

    expect(event.object.refreshing).toEqual(false)
  })

  it('navigates to coins page when Fab button is tapped', () => {
    wrapper.find('Fab-stub').vm.$emit('tap')

    expect($_navigateTo).toHaveBeenCalledWith(CoinsPage, {
      props: { currency: USD }
    })
  })

  it('navigates to wallet page when wallet is tapped', () => {
    wrapper.find('ListView-stub').vm.$emit('itemTap', { index: 1 })

    expect($_navigateTo).toHaveBeenCalledWith(WalletFormPage, {
      props: { wallet: walletA, currency: USD, isUpdating: true }
    })
  })

  it('sends firebase analytics screen name', () => {
    expect(firebase.analytics.setScreenName).toHaveBeenCalledWith({
      screenName: 'home_page'
    })
  })

  it('sends firebase analytics log event when refresh manually', () => {
    wrapper
      .findDataTest('pull-to-refresh')
      .vm.$emit('refresh', { object: { refreshing: true } })

    expect(firebase.analytics.logEvent).toHaveBeenCalledWith({
      key: 'refresh_wallets_manually'
    })
  })
})
