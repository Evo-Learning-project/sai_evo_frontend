/* eslint-disable */
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';
import VueAxios from 'vue-axios';
import { i18n } from './i18n';
//import GAuth from './src/plugins/vue3-google-oauth2'; //'vue3-google-oauth2';
import GAuth from 'vue3-google-oauth2';
import './index.css';
import VueClipboard from 'vue3-clipboard';

const gAuthOptions = {
  clientId:
    '956826904172-mcsaj1bqcllv93bpad7dmd0e3oil4758.apps.googleusercontent.com',
  scope: 'profile',
  prompt: 'consent',
  fetch_basic_profile: true,
  //hosted_domain: ["studenti.unipi.it"]
};

const dev = process.env.NODE_ENV !== 'production';

axios.defaults.baseURL = dev
  ? 'http://127.0.0.1:8000'
  : process.env.VUE_APP_AXIOS_BASE;

createApp(App)
  .use(GAuth, gAuthOptions)
  .use(store)
  .use(router)
  .use(VueAxios, axios)
  .use(i18n)
  .use(VueClipboard, {
    autoSetContainer: true,
    appendToBody: true,
  })
  .mount('#app');
