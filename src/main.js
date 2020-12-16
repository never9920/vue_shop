import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
//import './assets/fonts/icon.css
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import axios from 'axios'

//axios.defaults.baseURL = 'http://119.23.53.78:8888/api/private/v1/'
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
    //axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/'

axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
        //console.log(config)
    NProgress.start()
    return config
})

axios.interceptors.response.use(config => {
    NProgress.done()
    return config
})

Vue.config.productionTip = false

Vue.use(VueQuillEditor, /* { default global options } */ )

Vue.prototype.$http = axios

Vue.component('tree-table', TreeTable)

Vue.filter('dataform', function(origin) {
    const dt = new Date(origin)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')
    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')