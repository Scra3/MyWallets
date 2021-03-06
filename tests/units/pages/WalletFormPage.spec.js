import { shallowMount, createLocalVue } from '@vue/test-utils'
import WalletFormPage from '@/pages/WalletFormPage'
import { Coin } from '@/models/Coin'
import { Wallet } from '@/models/Wallet'
import flushPromises from 'flush-promises'
import { USD, BTC } from '@/constants'
import App from '@/App'
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

describe('WalletFormPage.vue', () => {
  let wrapper
  let store
  let actions
  let $_navigateTo

  beforeEach(async () => {
    actions = {
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }
    store = new Vuex.Store({
      modules: {
        walletManager: {
          namespaced: true,
          actions
        }
      }
    })

    $_navigateTo = jest.fn()

    wrapper = shallowMount(WalletFormPage, {
      localVue,
      store,
      propsData: { wallet, currency: USD },
      mocks: {
        $navigateBack: jest.fn()
      },
      methods: {
        $_preloadInterstitialAd: jest.fn(),
        $_showInterstitialAd: jest.fn(() => Promise.resolve(true)),
        $_checkAddressValidity: jest.fn(() => Promise.resolve(true)),
        $_navigateTo
      }
    })
  })

  it('goes to back page when back button is clicked', () => {
    wrapper.findDataTest('back-button').vm.$emit('tap')

    expect(wrapper.vm.$navigateBack).toHaveBeenCalled()
  })

  it('goes to home page when delete button is clicked when it is updating wallet', async () => {
    wrapper.setProps({ isUpdating: true })

    wrapper.findDataTest('delete-wallet').vm.$emit('tap')

    await flushPromises()

    expect($_navigateTo).toHaveBeenCalledWith(App)
  })

  it('does not go to home page when user clicks on save wallet and did not provide any information', () => {
    wrapper.findDataTest('save-button').vm.$emit('tap')

    expect($_navigateTo).not.toHaveBeenCalled()
  })

  it('sends firebase analytics screen name', () => {
    expect(firebase.analytics.setScreenName).toHaveBeenCalledWith({
      screenName: 'wallet_form_page'
    })
  })

  describe('when it is in connected mode', () => {
    beforeEach(() => {
      wrapper
        .find('WalletSwitch-stub')
        .vm.$emit('is-balance-mode-did-tap', false)
    })

    it('displays input wallet address', () => {
      expect(wrapper.find('WalletAddressInput-stub').isVisible()).toBe(true)
    })

    it('does not display input the wallet balance', () => {
      expect(wrapper.find('WalletBalanceInput-stub').exists()).toBe(false)
    })

    it('displays the wallet price', () => {
      expect(wrapper.findDataTest('wallet-price').exists()).toBe(false)
    })

    it('goes to home page when the save button is tapped and the address is valid', async () => {
      wrapper
        .find('WalletAddressInput-stub')
        .vm.$emit('address-did-change', 'goodAddress')

      wrapper.findDataTest('save-button').vm.$emit('tap')

      await flushPromises()

      expect($_navigateTo).toHaveBeenCalledWith(App)
    })

    it('sends firebase analytics log event when user saves wallet', async () => {
      wrapper
        .find('WalletAddressInput-stub')
        .vm.$emit('address-did-change', 'goodAddress')

      wrapper.findDataTest('save-button').vm.$emit('tap')

      await flushPromises()

      expect(firebase.analytics.logEvent).toHaveBeenCalledWith({
        key: 'save_wallet',
        parameters: [
          {
            key: 'wallet_coin_id',
            value: wallet.coin.id
          },
          {
            key: 'track_address',
            value: (!wallet.isUsingLocalBalance).toString()
          }
        ]
      })
    })

    it('does not go to home page when save button is tapped and address is not valid', async () => {
      wrapper.vm.$_checkAddressValidity = jest.fn(() => Promise.resolve(false))

      wrapper
        .find('WalletAddressInput-stub')
        .vm.$emit('address-did-change', 'badAddress')

      wrapper.findDataTest('save-button').vm.$emit('tap')

      await flushPromises()

      expect($_navigateTo).not.toHaveBeenCalledWith(App)
    })

    it('does not go to home page when save button is tapped and address is empty', () => {
      wrapper.find('WalletAddressInput-stub').vm.$emit('address-did-change', '')

      wrapper.findDataTest('save-button').vm.$emit('tap')

      expect($_navigateTo).not.toHaveBeenCalledWith(App)
    })
  })

  describe('when it is in manual balance mode', () => {
    beforeEach(() => {
      wrapper
        .find('WalletSwitch-stub')
        .vm.$emit('is-balance-mode-did-tap', true)
    })

    it('inserts wallet in db when save button is tapped and inputs are valid', async () => {
      wrapper.vm.$_showInterstitialAd = jest.fn(() => Promise.resolve(true))

      wrapper.findDataTest('save-button').vm.$emit('tap')
      await flushPromises()

      expect(actions.insert).toHaveBeenCalled()
    })

    it('updates wallet in db when save button is tapped and inputs are valid', async () => {
      wrapper.setProps({ isUpdating: true })

      wrapper.findDataTest('save-button').vm.$emit('tap')
      await flushPromises()

      expect(actions.update).toHaveBeenCalled()
    })

    it('displays input wallet balance', () => {
      expect(wrapper.find('WalletBalanceInput-stub').isVisible()).toBe(true)
    })

    it('does not display input wallet address', () => {
      expect(wrapper.find('WalletAddressInput-stub').exists()).toBe(false)
    })

    it('goes to home page when the save button is tapped and the balance is valid', async () => {
      wrapper.find('WalletBalanceInput-stub').vm.$emit('balance-did-change', 5)

      wrapper.findDataTest('save-button').vm.$emit('tap')
      await flushPromises()

      expect($_navigateTo).toHaveBeenCalledWith(App)
    })

    it('does not go to home page when save button is tapped and balance is not valid', () => {
      wrapper
        .find('WalletBalanceInput-stub')
        .vm.$emit('is-balance-valid', false)
      wrapper.findDataTest('save-button').vm.$emit('tap')

      expect($_navigateTo).not.toHaveBeenCalled()
    })

    it('display ad when save button is clicked', async () => {
      wrapper.vm.$_showInterstitialAd = jest.fn(() => Promise.resolve(true))

      wrapper.findDataTest('save-button').vm.$emit('tap')
      await flushPromises()

      expect(wrapper.vm.$_showInterstitialAd).toHaveBeenCalled()
    })
  })
})
