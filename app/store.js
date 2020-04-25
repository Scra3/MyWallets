import Vue from 'nativescript-vue'
import Vuex from 'vuex'
import { WalletManager } from '@/stores/WalletManager'
import { AppManager } from '@/stores/AppManager'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    walletManager: WalletManager,
    appManager: AppManager
  }
})

store.dispatch('walletManager/init')
store.dispatch('appManager/init')

export default store
