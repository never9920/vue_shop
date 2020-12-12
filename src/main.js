import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
//import './assets/fonts/icon.css
import TreeTable from 'vue-table-with-tree-grid'

import axios from 'axios'

axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'

axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
        //console.log(config)
    return config
})

Vue.config.productionTip = false

Vue.prototype.$http = axios

Vue.component('tree-table', TreeTable)

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')