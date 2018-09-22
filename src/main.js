import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import './registerServiceWorker'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'
import ECharts from 'vue-echarts'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueIziToast from 'vue-izitoast';
import 'izitoast/dist/css/iziToast.css';
import './assets/default.styl'

Vue.use(ElementUI);
Vue.use(Vuetify);
Vue.use(VueIziToast);

Vue.component('chart', ECharts)
Vue.config.productionTip = false
require('echarts/extension/bmap/bmap');

new Vue({
    router,
    store,
    render: h => h(App),
    components: { App },
    template: '<App/>'
}).$mount('#app')
