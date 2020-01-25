import { createLocalVue, shallowMount } from '@vue/test-utils'
import WalletsView from '@/pages/WalletsView'
import { USD } from '@/constants.js'
import { Coin } from '@/models/Coin'
import { Wallet } from '@/models/Wallet'
import CoinsPage from '@/pages/CoinsPage'
import WalletPage from '@/pages/WalletPage'
import Vuex from 'vuex'
import flushPromises from 'flush-promises'

jest.mock('@/Api')
jest.mock('nativescript-barcodescanner', () => jest.fn())
jest.mock('nativescript-camera', () => jest.fn())

import { fetchWalletsCoinMarket } from '@/Api'
import { XRP } from '@/constants'

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

const localVue = createLocalVue()
localVue.use(Vuex)

describe('WalletsView.vue', () => {
  let actions
  let store
  let wrapper

  beforeEach(async () => {
    fetchWalletsCoinMarket.mockImplementation(() =>
      Promise.resolve([walletA, walletB])
    )
    actions = {
      selectAll: jest.fn()
    }
    store = new Vuex.Store({
      state: { persistedWallets: null },
      actions
    })

    wrapper = shallowMount(WalletsView, {
      localVue,
      store,
      propsData: {
        currency: USD
      },
      mocks: { $navigateTo: jest.fn() }
    })

    await flushPromises()
  })

  it('displays wallets value in header', () => {
    expect(wrapper.findDataTest('wallets-value').props().value).toEqual(2016)
  })

  it('displays wallets price change in 24h in header', () => {
    expect(wrapper.findDataTest('wallets-price-change').props().value).toEqual(
      10 * 6 + 11 * 6
    )
    expect(wrapper.findDataTest('wallets-price-change').props().unit).toEqual(
      '$ (24h)'
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
    expect(wrapper.findDataTest('balance').attributes().text).toEqual(
      '11.00 XRP'
    )
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

  it('displays spinner and reset states when fetching wallets', () => {
    wrapper.vm.fetchWallets()

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

  it('displays error message when fetching wallet or market has a problem', async () => {
    fetchWalletsCoinMarket.mockImplementation(() => Promise.reject('fail'))

    await wrapper.vm.fetchWallets()

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

    expect(wrapper.vm.$navigateTo).toHaveBeenCalledWith(CoinsPage, {
      props: { currency: USD }
    })
  })

  it('navigates to wallet page when wallet is tapped', () => {
    wrapper.find('ListView-stub').vm.$emit('itemTap', { index: 1 })

    expect(wrapper.vm.$navigateTo).toHaveBeenCalledWith(WalletPage, {
      props: { wallet: walletA, currency: USD, isUpdating: true }
    })
  })
})
