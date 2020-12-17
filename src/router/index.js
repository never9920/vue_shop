import Vue from 'vue'
import VueRouter from 'vue-router'


const login = () =>
    import ('../views/login')
const home = () =>
    import ('../views/home')
const welcome = () =>
    import ('../views/welcome')
const users = () =>
    import ('../views/users/users')
const power = () =>
    import ('../views/power/power')
const roles = () =>
    import ('../views/power/roles')
const goods = () =>
    import ('../views/shop/goods')
const params = () =>
    import ('../views/shop/params')
const categories = () =>
    import ('../views/shop/categories')
const add = () =>
    import ('../views/shop/add')
const orders = () =>
    import ('../views/orders/orders')
const reports = () =>
    import ('../views/reports/reports')

Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: login
    },
    {
        path: '/home',
        component: home,
        children: [{
                path: '/',
                redirect: '/welcome'
            },
            {
                path: '/welcome',
                component: welcome
            },
            {
                path: '/users',
                component: users
            },
            {
                path: '/rights',
                component: power
            },
            {
                path: '/roles',
                component: roles
            },
            {
                path: '/goods',
                component: goods
            },
            {
                path: '/goods/add',
                component: add
            },
            {
                path: '/params',
                component: params
            },
            {
                path: '/categories',
                component: categories
            },
            {
                path: '/orders',
                component: orders
            },
            {
                path: '/reports',
                component: reports
            }
        ]
    }
]

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    //to 将要访问的路径
    //from 代表从哪个路径跳转来的
    //next()表示放行 next('./login')表示强制返回login
    if (to.path === '/login') return next();
    const manager = window.sessionStorage.getItem('token')
    if (!manager) return next('/login');
    next()
})

export default router