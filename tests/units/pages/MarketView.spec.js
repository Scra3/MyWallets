import { shallowMount } from '@vue/test-utils'
import MarketView from '@/pages/MarketView'
import { USD, EUR } from '@/constants.js'
import { Coin } from '@/models/Coin'
import flushPromises from 'flush-promises'

jest.mock('@/Api')
import { fetchMarket } from '@/Api'

describe('MarketView.vue', () => {
  let wrapper
  beforeEach(async () => {
    fetchMarket.mockImplementation(() =>
      Promise.resolve([
        new Coin(
          'bitcoin',
          'Bitcoin',
          9668.09,
          7.17426,
          647.18,
          'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579'
        ),
        new Coin(
          'ripple',
          'Ripple',
          1,
          7.17426,
          647.18,
          'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579'
        )
      ])
    )

    wrapper = shallowMount(MarketView, {
      propsData: {
        currency: USD
      }
    })

    await flushPromises()
    fetchMarket.mockClear()
  })

  it('displays index starting to 1', () => {
    expect(wrapper.findDataTest('index').attributes().text).toEqual('1')
  })

  it('displays all coins', () => {
    expect(wrapper.findAllDataTests('coin').length).toEqual(2)
  })

  it('displays coins name', () => {
    expect(wrapper.findDataTest('name').attributes().text).toEqual(
      'Bitcoin'
    )
  })

  it('displays price change percentage of 24h', () => {
    expect(wrapper.find('ChangeLabel-stub').props().value).toEqual(7.17426)
    expect(wrapper.find('ChangeLabel-stub').props().unit).toEqual('%')
  })

  it('displays image', () => {
    expect(wrapper.findDataTest('image').attributes().src).toEqual(
      'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579'
    )
  })

  it('displays current price', () => {
    expect(wrapper.find('PriceLabel-stub').attributes().value).toEqual(
      '9668.09'
    )
  })

  it('displays pull to refresh even though is failing to load', () => {
    wrapper.setData({ isFailedToLoad: true })
    expect(wrapper.find('PullToRefresh-stub').isVisible()).toBe(true)
  })

  it('fetches coins market when currency changes', () => {
    wrapper.setProps({ currency: EUR })

    expect(fetchMarket).toHaveBeenCalled()
  })

  it('displays spinner when is fetching coins market', () => {
    wrapper.vm.fetchCoinsMarket()

    expect(wrapper.find('ActivityIndicator-stub').exists()).toBe(true)
    expect(fetchMarket).toHaveBeenCalled()
  })

  it('displays error message when fetching wallet has a problem', async () => {
    fetchMarket.mockImplementation(() => Promise.reject('fail'))

    await wrapper.vm.fetchCoinsMarket()

    expect(wrapper.findDataTest('error-message').isVisible()).toBe(true)
  })

  it('does not display spinner when fetching coins market is finished', async () => {
    await wrapper.vm.fetchCoinsMarket()

    expect(wrapper.find('ActivityIndicator-stub').exists()).toBe(false)
  })

  it('refreshes coins market when user pulls to refresh the list', () => {
    wrapper.find('PullToRefresh-stub').vm.$emit('refresh', { object: {} })
    expect(fetchMarket).toHaveBeenCalled()
  })
})
