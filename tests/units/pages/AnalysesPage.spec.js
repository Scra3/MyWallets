import { shallowMount, createLocalVue } from '@vue/test-utils'
import AnalysesPage from '@/pages/AnalysesPage'
import { Coin } from '@/models/Coin'
import { Wallet } from '@/models/Wallet'
import { USD, BTC } from '@/constants'
import Vuex from 'vuex'
import * as firebase from 'nativescript-plugin-firebase'

jest.mock('@/Api')

const localVue = createLocalVue()
localVue.use(Vuex)

const coin = new Coin(
  BTC,
  'Bitcoin',
  9668.09,
  7.17426,
  647.18,
  'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579'
)
const wallet = new Wallet(coin, 10, 'fakeAddress', false)

describe('AnalysesPage.vue', () => {
  beforeEach(() => {
    shallowMount(AnalysesPage, {
      propsData: { wallets: [wallet], currency: USD }
    })
  })

  it('sends firebase analytics screen name', () => {
    expect(firebase.analytics.setScreenName).toHaveBeenCalledWith({
      screenName: 'analyses_page'
    })
  })
})
