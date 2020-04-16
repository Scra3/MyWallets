import { shallowMount, createLocalVue } from '@vue/test-utils'
import WalletTotalValueChart from '@/pages/WalletTotalValueChart'
import { Coin } from '@/models/Coin'
import { Wallet } from '@/models/Wallet'
import { USD, BTC } from '@/constants'
import { fetchMarketChart } from '@/Api'
import { pricesLastYear } from '../factory'

const coin = new Coin(
  BTC,
  'Bitcoin',
  9668.09,
  7.17426,
  647.18,
  'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579'
)
const wallets = [
  new Wallet(coin, 10, 'fakeAddress', false),
  new Wallet(coin, 10, 'fakeAddress', false)
]

jest.mock('@/Api')

const localVue = createLocalVue()

localVue.directive('tkCartesianVerticalAxis', {})
localVue.directive('tkCartesianSeries', {})
localVue.directive('tkCartesianHorizontalAxis', {})

describe('WalletTotalValueChart.vue', () => {
  let wrapper

  beforeEach(() => {
    fetchMarketChart.mockImplementation(() => Promise.resolve(pricesLastYear))

    wrapper = shallowMount(WalletTotalValueChart, {
      localVue,
      propsData: { wallets, currency: USD }
    })
  })

  it('grouped point by month', async () => {
    await wrapper.vm.fetchData()

    expect(wrapper.vm.charts.length).toEqual(13)
  })
})
