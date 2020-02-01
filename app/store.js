import Vue from 'nativescript-vue'
import Vuex from 'vuex'
import { walletsDb } from './stores/walletsDb'
import { appDb } from './stores/appDb'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    walletsDb: walletsDb,
    appDb: appDb
  }
})

store.dispatch('walletsDb/init')
store.dispatch('appDb/init')

Vue.prototype.$store = store
