import { shallowMount, createLocalVue } from '@vue/test-utils'
import WalletProfitsChartView from '@/pages/WalletProfitsChartView'
import { Coin } from '@/models/Coin'
import { Wallet } from '@/models/Wallet'
import { USD, BTC } from '@/constants'
import { fetchMarketChart } from '@/Api'
import { pricesLastYear } from '../factory'

jest.mock('@/Api')

const coin = new Coin(
  BTC,
  'Bitcoin',
  9668.09,
  7.17426,
  647.18,
  'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579'
)
const wallets = [
  new Wallet(coin, 10, 'fakeAddress', false, 5),
  new Wallet(coin, 10, 'fakeAddress', false, 4)
]

const localVue = createLocalVue()

localVue.directive('tkCartesianVerticalAxis', {})
localVue.directive('tkCartesianSeries', {})
localVue.directive('tkCartesianHorizontalAxis', {})

describe('WalletProfitsChartView.vue', () => {
  let wrapper

  beforeEach(() => {
    fetchMarketChart.mockImplementation(() => Promise.resolve(pricesLastYear))

    wrapper = shallowMount(WalletProfitsChartView, {
      localVue,
      propsData: { wallets, currency: USD }
    })
  })

  it('grouped profit by month', async () => {
    await wrapper.vm.fetchData()

    expect(wrapper.vm.charts.length).toEqual(13)
  })

  it('displays loading message when charts are fetching', () => {
    wrapper.vm.isLoading = true

    expect(wrapper.find('LoadingMessage-stub').isVisible()).toBe(true)
  })

  it('displays error message when there fetching charts has a problem', () => {
    wrapper.vm.isFailedToLoad = true

    expect(wrapper.find('ErrorMessage-stub').isVisible()).toBe(true)
  })

  it('displays chart when it is loading', () => {
    wrapper.vm.isLoading = false

    expect(wrapper.find('RadCartesianChart-stub').isVisible()).toBe(true)
  })

  it('does not display chart when there is an error', () => {
    wrapper.vm.isFailedToLoad = true

    expect(wrapper.find('RadCartesianChart-stub').isVisible()).toBe(false)
  })

  it('returns the max value', () => {
    const points = { a: [30, 40, 55] }

    expect(wrapper.vm.getMaxValue(points, 'a')).toEqual(55)
  })

  it('formats chart points', () => {
    const chart1 = [
      [new Date(2020, 3, 3), 2],
      [new Date(2020, 3, 3), 3]
    ]
    const chart2 = [
      [new Date(2020, 3, 3), 2],
      [new Date(2020, 3, 3), 3]
    ]
    const charts = [chart1, chart2]

    expect(wrapper.vm.formatChart(charts)).toEqual([
      [
        { month: 'Apr-20', value: 2 * 10 - 5 },
        { month: 'Apr-20', value: 3 * 10 - 5 }
      ],
      [
        { month: 'Apr-20', value: 2 * 10 - 4 },
        { month: 'Apr-20', value: 3 * 10 - 4 }
      ]
    ])
  })
})
