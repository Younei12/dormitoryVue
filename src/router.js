import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

var router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
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
    }, {
      path: "/comein-manage",
      name: "comein-manage",
      component: () => import("@/views/comein-manage.vue")
    }, {
      path: "/leave-apply",
      name: "leave-apply",
      component: () => import("@/views/leave-apply.vue")
    }, {
      path: "/leave-approve",
      name: "leave-approve",
      component: () => import("@/views/leave-approve.vue")
    }, {
      path: "/leave-set",
      name: "/leave-set",
      component: () => import("@/views/leave-set.vue")
    }, {
      path: "/dorm-manage",
      name: "/dorm-manage",
      component: () => import("@/views/dorm-manage.vue")
    }, {
      path: "/student-manage",
      name: "/student-manage",
      component: () => import("@/views/student-manage.vue")
    }, {
      path: "/equ-submit",
      name: "/equ-submit",
      component: () => import("@/views/equ-submit.vue")
    }, {
      path: "/equ-resolve",
      name: "/equ-resolve",
      component: () => import("@/views/equ-resolve.vue")
    }, {
      path: "/school-leave-reg",
      name: "/school-leave-reg",
      component: () => import("@/views/school-leave-reg.vue")
    }, {
      path: "/school-leave-search",
      name: "/school-leave-search",
      component: () => import("@/views/school-leave-search.vue")
    }]
  }
  ]
})

export default router