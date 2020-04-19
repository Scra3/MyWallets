import { shallowMount } from '@vue/test-utils'
import MarketView from '@/pages/MarketView'
import { USD, EUR, BTC, XRP } from '@/constants'
import { Coin } from '@/models/Coin'
import flushPromises from 'flush-promises'

jest.mock('@/Api')
import { fetchCoinsMarket } from '@/Api'

describe('MarketView.vue', () => {
  let wrapper
  let clearSearchBarFocus

  beforeEach(async () => {
    fetchCoinsMarket.mockImplementation(() =>
      Promise.resolve([
        new Coin(
          BTC,
          'Bitcoin',
          9668.09,
          7.17426,
          647.18,
          'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579'
        ),
        new Coin(
          XRP,
          'Ripple',
          1,
          7.17426,
          647.18,
          'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579'
        )
      ])
    )

    clearSearchBarFocus = jest.fn()

    wrapper = shallowMount(MarketView, {
      propsData: {
        currency: USD
      },
      methods: {
        clearSearchBarFocus
      }
    })

    await flushPromises()
    fetchCoinsMarket.mockClear()
  })

  it('displays index starting to 1', () => {
    expect(wrapper.findDataTest('index').attributes().text).toEqual('1')
  })

  it('clears search focus', () => {
    expect(clearSearchBarFocus).toHaveBeenCalled()
  })

  it('displays all coins', () => {
    expect(wrapper.findAllDataTests('coin').length).toEqual(2)
  })

  it('displays coins name', () => {
    expect(wrapper.findDataTest('name').attributes().text).toEqual('Bitcoin')
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

    expect(fetchCoinsMarket).toHaveBeenCalled()
  })

  it('displays spinner when is fetching coins market', () => {
    wrapper.vm.fetchCoinsMarket()

    expect(wrapper.find('ActivityIndicator-stub').exists()).toBe(true)
    expect(fetchCoinsMarket).toHaveBeenCalled()
  })

  it('displays error message when fetching wallet has a problem', async () => {
    fetchCoinsMarket.mockImplementation(() => Promise.reject('fail'))

    await wrapper.vm.fetchCoinsMarket()

    expect(wrapper.find('ErrorMessage-stub').isVisible()).toBe(true)
  })

  it('does not display spinner when fetching coins market is finished', async () => {
    await wrapper.vm.fetchCoinsMarket()

    expect(wrapper.find('ActivityIndicator-stub').exists()).toBe(false)
  })

  it('refreshes coins market when user pulls to refresh the list', () => {
    wrapper.find('PullToRefresh-stub').vm.$emit('refresh', { object: {} })
    expect(fetchCoinsMarket).toHaveBeenCalled()
  })
})
