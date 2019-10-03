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
        component: () => import("@/views/system-index.vue"),
        meta: {
          title: "系统首页"
        }
      }, {
        path: "/comein-manage",
        name: "comein-manage",
        component: () => import("@/views/comein-manage.vue"),
        meta: {
          title: "入住管理"
        }
      }, {
        path: "/leave-apply",
        name: "leave-apply",
        component: () => import("@/views/leave-apply.vue"),
        meta: {
          title: "退寝申请"
        }
      }, {
        path: "/leave-approve",
        name: "leave-approve",
        component: () => import("@/views/leave-approve.vue"),
        meta: {
          title: "退寝审批"
        }
      }, {
        path: "/leave-set",
        name: "/leave-set",
        component: () => import("@/views/leave-set.vue"),
        meta: {
          title: "手动退寝"
        }
      }, {
        path: "/dorm-manage",
        name: "/dorm-manage",
        component: () => import("@/views/dorm-manage.vue"),
        meta: {
          title: "宿舍管理"
        }
      }, {
        path: "/student-manage",
        name: "/student-manage",
        component: () => import("@/views/student-manage.vue"),
        meta: {
          title: "学生管理"
        }
      }, {
        path: "/equ-submit",
        name: "/equ-submit",
        component: () => import("@/views/equ-submit.vue"),
        meta: {
          title: "提交设备报修"
        }
      }, {
        path: "/equ-resolve",
        name: "/equ-resolve",
        component: () => import("@/views/equ-resolve.vue"),
        meta: {
          title: "处理设备报修"
        }
      }, {
        path: "/school-leave-reg",
        name: "/school-leave-reg",
        component: () => import("@/views/school-leave-reg.vue"),
        meta: {
          title: "离校信息登记"
        }
      }, {
        path: "/school-leave-search",
        name: "/school-leave-search",
        component: () => import("@/views/school-leave-search.vue"),
        meta: {
          title: "离校信息查看"
        }
      }]
    }
  ]
})

export default router
