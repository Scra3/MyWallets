import { createLocalVue, shallowMount } from '@vue/test-utils'
import AlertsView from '@/pages/AlertsView'
import { USD } from '@/constants.js'
import { Coin } from '@/models/Coin'
import Vuex from 'vuex'
import flushPromises from 'flush-promises'
import AlertFormPage from '@/pages/AlertFormPage'
import CoinsPage from '@/pages/CoinsPage'

jest.mock('@/Api')
jest.mock('nativescript-barcodescanner', () => jest.fn())
jest.mock('nativescript-camera', () => jest.fn())
jest.mock('nativescript-local-notifications', () => jest.fn())

import { fetchCoinsMarket } from '@/Api'
import { XRP, BTC } from '@/constants'

const xrpCoin = new Coin(
  XRP,
  'Ripple',
  96,
  7.17426,
  6,
  'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
  'xrp'
)
const btcCoin = new Coin(
  BTC,
  'Bitcoin',
  9668.09,
  7.17426,
  647.18,
  'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579'
)
const persistedAlerts = [
  {
    id: 1,
    targetPrice: 10,
    note: 'a note',
    currentValueDuringCreation: '11',
    coinId: BTC
  },
  {
    id: 2,
    targetPrice: 15,
    note: 'a note',
    currentValueDuringCreation: '1',
    coinId: XRP
  }
]

const localVue = createLocalVue()
localVue.use(Vuex)

describe('AlertsView.vue', () => {
  let actions
  let store
  let wrapper

  beforeEach(() => {
    fetchCoinsMarket.mockImplementation(() =>
      Promise.resolve([btcCoin, xrpCoin])
    )

    actions = {
      selectAll: jest.fn()
    }

    store = new Vuex.Store({
      modules: {
        alertManager: {
          namespaced: true,
          state: { persistedAlerts },
          actions
        }
      }
    })
  })

  beforeEach(async () => {
    wrapper = shallowMount(AlertsView, {
      localVue,
      store,
      propsData: {
        currency: USD
      },
      mocks: { $navigateTo: jest.fn() }
    })

    await flushPromises()
  })

  it('displays the number of alerts', () => {
    expect(wrapper.findDataTest('alerts-number').attributes().text).toEqual(
      '2 Alerts'
    )
  })

  it('displays all alert items', () => {
    expect(wrapper.findAllDataTests('alert').length).toEqual(2)
  })

  it('sorts alerts', () => {
    const alertCoin = wrapper.findAllDataTests('alert-coin-name')
    expect(alertCoin.at(0).attributes().text).toEqual('Bitcoin')
    expect(alertCoin.at(1).attributes().text).toEqual('Ripple')
  })

  it('displays error message when there is a fetching problem', async () => {
    fetchCoinsMarket.mockImplementation(() => Promise.reject('fail'))
    await wrapper.vm.fetchData()

    expect(wrapper.findDataTest('error-message').isVisible()).toBe(true)
  })

  it('displays information message when there is no alerts', async () => {
    wrapper.setData({ alerts: [] })

    expect(wrapper.findDataTest('information-message').isVisible()).toBe(true)
  })

  it('navigates to alert form page when alert is tapped', async () => {
    let selectedAlert = wrapper.vm.sortedAlerts[0]
    wrapper.find('ListView-stub').vm.$emit('itemTap', { index: 0 })

    expect(wrapper.vm.$navigateTo).toHaveBeenCalledWith(AlertFormPage, {
      props: {
        coin: btcCoin,
        currency: USD,
        alert: selectedAlert,
        isUpdating: true
      }
    })
  })

  it('navigates to coins page when Fab button is tapped', async () => {
    wrapper.find('Fab-stub').vm.$emit('tap')

    expect(wrapper.vm.$navigateTo).toHaveBeenCalledWith(CoinsPage, {
      props: {
        navigateTo: 'AlertFormPage',
        currency: USD,
        isConnectableTagDisplayed: false
      }
    })
  })
})
