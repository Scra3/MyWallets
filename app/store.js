import Vue from 'nativescript-vue'
import Vuex from 'vuex'
import { walletsManager } from './stores/WalletsManager'
import { appManager } from './stores/AppManager'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    walletsManager: walletsManager,
    appManager: appManager
  }
})

store.dispatch('walletsManager/init')
store.dispatch('appManager/init')

export default store
