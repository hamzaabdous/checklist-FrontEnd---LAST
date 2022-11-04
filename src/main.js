import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import swal from 'sweetalert';
import Swal from 'sweetalert2';

import "@/scss/GlobalStyle.scss";

import VueChartsCSS from "vue.charts.css";
import 'charts.css';
Vue.config.productionTip = false;
Vue.use(VueChartsCSS); 

new Vue({
  router,
  store,
  vuetify,
  swal,
  render: (h) => h(App),
}).$mount("#app");
