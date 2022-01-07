import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { router } from './router'
import VueParticles from 'vue-particles'
// import 'bootstrap/dist/css/bootstrap.css'
import 'leaflet/dist/leaflet.css';
import store from './store';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import VeeValidate from 'vee-validate';
import Vuex from 'vuex';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faHome,
  faUser,
  faUserPlus,
  faSignInAlt,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

import setupInterceptors from './services/setupInterceptors';
import VueHtmlToPaper from 'vue-html-to-paper';

const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: [
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
    'https://unpkg.com/kidlat-css/css/kidlat.css'
  ],
  timeout: 1000, // default timeout before the print window appears
  autoClose: false, // if false, the window will not close after printing
  windowTitle: window.document.title, // override the window title
}



library.add(faHome, faUser, faUserPlus, faSignInAlt, faSignOutAlt);


Vue.config.productionTip = false;
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(VueParticles);
Vue.use(Vuex);
Vue.use(VeeValidate);
Vue.use(VueHtmlToPaper, options);

setupInterceptors(store);

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
