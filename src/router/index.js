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