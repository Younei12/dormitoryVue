import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from "element-ui"

import "./assets/styles/base.scss"
import "./assets/styles/mixin.scss"
import "element-ui/lib/theme-chalk/index.css"
import "@/assets/styles/normalize.css"
import 'element-ui/lib/theme-chalk/display.css';
import "@/assets/iconfont/iconfont.css"
import extend from "@/utils/extend";
import request from "@/api";
import * as service from "@/utils/service"
import "./bin.js";

const config = require("./config.js");

Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.prototype.ex = extend;
Vue.prototype.request = request;
Vue.prototype.service = service;
Vue.prototype.config = config;

const app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

export default app;
