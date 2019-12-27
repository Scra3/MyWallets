import Vue from 'nativescript-vue'
import App from './App'
import store from './store'
import VueDevtools from 'nativescript-vue-devtools'

/* global TNS_ENV */
if (TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = TNS_ENV === 'production'

Vue.registerElement(
  'BarcodeScanner',
  () => require('nativescript-barcodescanner').BarcodeScannerView
)
Vue.registerElement(
  'PullToRefresh',
  () => require('@nstudio/nativescript-pulltorefresh').PullToRefresh
)
Vue.registerElement(
  'Fab',
  () => require('@nstudio/nativescript-floatingactionbutton').Fab
)

new Vue({
  store,
  render: h => h('frame', [h(App)])
}).$start()
