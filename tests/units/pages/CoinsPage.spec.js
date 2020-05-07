import { shallowMount } from '@vue/test-utils'
import CoinsPage from '@/pages/CoinsPage'
import { USD, BTC, XRP } from '@/constants'
import { Coin } from '@/models/Coin'
import { fetchCoinsMarket } from '@/Api'
import { Wallet } from '@/models/Wallet'
import WalletFormPage from '@/pages/WalletFormPage'

jest.mock('@/Api')

const bitcoinCoin = new Coin(
  BTC,
  'Bitcoin',
  9668.09,
  7.17426,
  647.18,
  'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
  'btc'
)

describe('CoinsPage.vue', () => {
  let wrapper
  let clearSearchBarFocus
  let $_navigateTo

  beforeEach(() => {
    fetchCoinsMarket.mockImplementation(() =>
      Promise.resolve([
        bitcoinCoin,
        new Coin(
          XRP,
          'Ripple',
          1,
          7.17426,
          647.18,
          'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
          'xrp'
        )
      ])
    )
    clearSearchBarFocus = jest.fn()
    $_navigateTo = jest.fn()

    wrapper = shallowMount(CoinsPage, {
      propsData: {
        currency: USD
      },
      methods: {
        clearSearchBarFocus,
        $_navigateTo
      },
      mocks: {
        $navigateBack: jest.fn()
      }
    })

    fetchCoinsMarket.mockClear()
  })

  it('goes to back when back button is tapped in the action bar', () => {
    wrapper.findDataTest('back-button').vm.$emit('tap')

    expect(wrapper.vm.$navigateBack).toHaveBeenCalled()
  })

  it('displays coin list with search bar and hides spinner after mounted', () => {
    expect(wrapper.find('ActivityIndicator-stub').exists()).toBe(false)
    expect(wrapper.find('ListView-stub').isVisible()).toBe(true)
    expect(wrapper.find('SearchBar-stub').isVisible()).toBe(true)
  })

  it('navigates to wallet page when coin is tapped', () => {
    wrapper.find('ListView-stub').vm.$emit('itemTap', { index: 0 })

    expect($_navigateTo).toHaveBeenCalledWith(WalletFormPage, {
      props: { wallet: new Wallet(bitcoinCoin), currency: USD }
    })
  })

  it('displays spinner and hides coin list when is loading data', () => {
    wrapper.vm.fetchCoinsMarket()
    wrapper.setData({ coins: [] })

    expect(wrapper.find('ActivityIndicator-stub').isVisible()).toBe(true)
    expect(wrapper.find('ListView-stub').exists()).toBe(false)
  })

  it('displays error message when fetching coin list has a problem', async () => {
    fetchCoinsMarket.mockImplementation(() => Promise.reject('fail'))

    await wrapper.vm.fetchCoinsMarket()

    expect(wrapper.find('ErrorMessage-stub').isVisible()).toBe(true)
  })

  it('displays only bitcoin in the coin list when searching bitcoin', () => {
    wrapper.find('SearchBar-stub').vm.$emit('input', BTC)

    expect(wrapper.findDataTest('name').attributes('text')).toEqual('Bitcoin')
    expect(wrapper.findAllDataTests('name').length).toEqual(1)
  })

  it('displays only bitcoin in the coin list when searching btc', () => {
    wrapper.find('SearchBar-stub').vm.$emit('input', 'btc')

    expect(wrapper.findDataTest('name').attributes('text')).toEqual('Bitcoin')
    expect(wrapper.findAllDataTests('name').length).toEqual(1)
  })

  it('displays message when there is no coins', () => {
    wrapper.find('SearchBar-stub').vm.$emit('input', 'noCoin')

    expect(wrapper.find('ListView-stub').exists()).toBe(false)
    expect(wrapper.findDataTest('no-coins-message').isVisible()).toBe(true)
  })

  it('does not display message when there coins', () => {
    wrapper.find('SearchBar-stub').vm.$emit('input', 'btc')

    expect(wrapper.findDataTest('no-coins-message').exists()).toBe(false)
  })

  it('displays "connectable" info when it is a connectable coin address', () => {
    expect(wrapper.findDataTest('connectable').isVisible()).toBe(true)
  })

  it('displays "connectable" info when it is a connectable coin address', () => {
    wrapper.setData({
      coins: [
        new Coin(
          'notTrackableId',
          'NotTrackable',
          1,
          7.17426,
          647.18,
          'https://assets..com/coins/images/1/large/bitcoin.png?1547033579'
        )
      ]
    })
    expect(wrapper.findDataTest('connectable').exists()).toBe(false)
  })
})
