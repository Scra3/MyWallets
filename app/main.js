import Vue from "nativescript-vue";
import App from "./components/App";
import VueDevtools from "nativescript-vue-devtools";
import store from "./store";
import FontIcon from 'nativescript-vue-fonticon'

import "./style.scss";

Vue.use(FontIcon, {
  componentName: 'FIcon', // <-- Optional. Will be the name for component icon.
  debug: true, // <-- Optional. Will output the css mapping to console.
  paths: {
    fa: './assets/css/fontawesome.css',
    ion: './assets/css/ionicons.css'
  }
})

if (TNS_ENV !== "production") {
  Vue.use(VueDevtools);
}

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = TNS_ENV === "production";

new Vue({
  store,
  render: h => h("frame", [h(App)])
}).$start();
