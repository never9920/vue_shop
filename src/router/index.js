import Vue from 'vue'
import VueRouter from 'vue-router'


const login = () =>
    import ('../components/login')
const home = () =>
    import ('../components/home')
const welcome = () =>
    import ('../components/welcome')
const users = () =>
    import ('../components/users/users')
const power = () =>
    import ('../components/power/power')
const roles = () =>
    import ('../components/power/roles')
const goods = () =>
    import ('../components/shop/goods')
const params = () =>
    import ('../components/shop/params')
const categories = () =>
    import ('../components/shop/categories')
const orders = () =>
    import ('../components/orders/orders')
const reports = () =>
    import ('../components/reports/reports')

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