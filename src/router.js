import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

var router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            redirect: "/system-index"
        },
        {
            path: '/',
            name: 'home',
            component: () => import("./views/Home.vue"),
            children: [{
                path: "/system-index",
                name: "system-index",
                component: () => import("@/views/system-index.vue")
            },{
                path:"/checkin-manage",
                name:"checkin-manage",
                component:() => import("@/views/checkin-manage.vue")
            }]
        }
    ]
})

export default router