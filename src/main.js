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

Vue.use(ElementUI);
Vue.use(Vuetify);

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
