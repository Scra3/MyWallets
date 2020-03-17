import Vue from 'nativescript-vue'
import Vuex from 'vuex'
import { WalletManager } from '@/stores/WalletManager'
import { AppManager } from '@/stores/AppManager'
import { AlertManager } from '@/stores/AlertManager'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    walletManager: WalletManager,
    alertManager: AlertManager,
    appManager: AppManager
  }
})

store.dispatch('walletManager/init')
store.dispatch('appManager/init')
store.dispatch('alertManager/init')

export default store
