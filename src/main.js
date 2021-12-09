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

library.add(faHome, faUser, faUserPlus, faSignInAlt, faSignOutAlt);


Vue.config.productionTip = false;
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(VueParticles);
Vue.use(Vuex);
Vue.use(VeeValidate);

setupInterceptors(store);

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
