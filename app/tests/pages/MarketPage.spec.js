import { shallowMount } from '@vue/test-utils'
import MarketPage from '@/pages/MarketPage'
import { USD } from '@/constants.js'
import flushPromises from 'flush-promises'
import * as httpModule from 'tns-core-modules/http'

describe('MarketPage.vue', () => {
  let wrapper
  beforeEach(async () => {
    httpModule.getJSON.mockImplementationOnce(() =>
      Promise.resolve([
        {
          id: 'bitcoin',
          symbol: 'btc',
          name: 'Bitcoin',
          image:
            'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
          current_price: 9668.09,
          market_cap: 174138329047,
          market_cap_rank: 1,
          total_volume: 37724532035,
          high_24h: 9699.48,
          low_24h: 9020.9,
          price_change_24h: 647.18,
          price_change_percentage_24h: 7.17426,
          market_cap_change_24h: 11628273395,
          market_cap_change_percentage_24h: 7.15542,
          circulating_supply: 18016125,
          total_supply: 21000000,
          ath: 19665.39,
          ath_change_percentage: -50.9156,
          ath_date: '2017-12-16T00:00:00.000Z',
          roi: null,
          last_updated: '2019-10-27T20:35:48.744Z'
        }
      ])
    )

    wrapper = shallowMount(MarketPage, {
      propsData: {
        currency: USD
      }
    })
    await flushPromises()
  })

  it('displays index starting to 1', () => {
    expect(wrapper.find("[data-test='index']").attributes().text).toEqual(
      '1'
    )
  })

  it('displays coins name', () => {
    expect(wrapper.find("[data-test='name']").attributes().text).toEqual(
      'Bitcoin'
    )
  })

  it('displays price change percentage of 24h', () => {
    expect(wrapper.find('ChangePercentageLabel-stub').props().value).toEqual(
      7.17426
    )
  })

  it('displays image', () => {
    expect(wrapper.find("[data-test='image']").attributes().src).toEqual(
      'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579'
    )
  })

  it('displays current price', () => {
    expect(
      wrapper.find("[data-test='current-price']").attributes().text
    ).toEqual('9668.09')
  })

  it('Calls api url with selected currency', () => {
    expect(httpModule.getJSON).toHaveBeenCalledWith(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
    )
  })
})
