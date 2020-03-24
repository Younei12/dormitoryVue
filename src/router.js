import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

var router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: "/login",
      name: "login",
      component: () => import("./views/login"),
      meta: {
        title: "登录 - 学生宿舍管理系统",
        background: "#293344"
      }
    },
    {
      path: '/main',
      name: 'main',
      redirect: "/main/system-index",
      component: () => import("./views/Home.vue"),
      children: [{
        path: "system-index",
        name: "system-index",
        component: () => import("@/views/system-index.vue"),
        meta: {
          title: "系统首页"
        }
      }, {
        path: "comein-manage",
        name: "comein-manage",
        component: () => import("@/views/comein-manage.vue"),
        meta: {
          title: "分配宿舍"
        }
      }, {
        path: "leave-apply",
        name: "leave-apply",
        component: () => import("@/views/leave-apply.vue"),
        meta: {
          title: "退寝申请"
        }
      }, {
        path: "leave-approve",
        name: "leave-approve",
        component: () => import("@/views/leave-approve.vue"),
        meta: {
          title: "退寝审批"
        }
      }, {
        path: "leave-set",
        name: "leave-set",
        component: () => import("@/views/leave-set.vue"),
        meta: {
          title: "办理退寝"
        }
      }, {
        path: "dorm-manage",
        name: "dorm-manage",
        component: () => import("@/views/dorm-manage.vue"),
        meta: {
          title: "宿舍管理"
        }
      }, {
        path: "building-manage",
        name: "building-manage",
        component: () => import("@/views/building-manage.vue"),
        meta: {
          title: "楼栋管理"
        }
      }, {
        path: "student-manage",
        name: "student-manage",
        component: () => import("@/views/student-manage.vue"),
        meta: {
          title: "学生管理"
        }
      }, {
        path: "equ-submit",
        name: "equ-submit",
        component: () => import("@/views/equ-submit.vue"),
        meta: {
          title: "提交设备报修单"
        }
      }, {
        path: "equ-resolve",
        name: "equ-resolve",
        component: () => import("@/views/equ-resolve.vue"),
        meta: {
          title: "设备报修单"
        }
      }, {
        path: "school-leave-reg",
        name: "school-leave-reg",
        component: () => import("@/views/school-leave-reg.vue"),
        meta: {
          title: "离校信息登记"
        }
      }, {
        path: "school-leave-search",
        name: "school-leave-search",
        component: () => import("@/views/school-leave-search.vue"),
        meta: {
          title: "离校登记查询"
        }
      }, {
        path: "adjust-dorm-apply",
        name: "adjust-dorm-apply",
        component: () => import("@/views/adjust-dorm-apply.vue"),
        meta: {
          title: "调整宿舍申请"
        }
      }, {
        path: "adjust-dorm-approve",
        name: "adjust-dorm-approve",
        component: () => import("@/views/adjust-dorm-approve.vue"),
        meta: {
          title: "调整宿舍申请"
        }
      }, {
        path: "admin-manage",
        name: "admin-manage",
        component: () => import("@/views/admin-manage.vue"),
        meta: {
          title: "管理员管理"
        }
      }, {
        path: "repairmen-manage",
        name: "repairmen-manage",
        component: () => import("@/views/repairmen-manage.vue"),
        meta: {
          title: "维修员管理"
        }
      }]
    }
  ]
})

router.beforeEach((to, from, next) => {
  next();
  document.title = to.meta.title ? to.meta.title : "学生宿舍管理系统";
  document.documentElement.style.background = to.meta.background ? to.meta.background : ""
  // if (to.matched.every(item => item.meta.noLogin)) {
  //   next();
  // } else {
  //   let token = localStorage.getItem('ds_token');
  //   if (!token) {
  //     next("/login");
  //   } else {
  //     next();
  //   }
  // }
});

export default router
