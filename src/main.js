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
import extend from "@/components/common/extend";

Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.prototype.ex = extend;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
