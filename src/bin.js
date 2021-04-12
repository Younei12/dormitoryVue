import Vue from "vue";
import moment from "moment";
import {convertUrl} from "@/utils/utils";

// 全局自定义指令
Vue.directive('no-autofill', {
  inserted(el) {
    console.log(el)
  }
});

// 全局过滤器，设置时间显示的格式
Vue.filter("convertToDate", function (value, type = "date") {
  if (value) {
    if (type === 'date') {
      return moment(value).format('YYYY-MM-DD');
    }
    if (type === 'datetime') {
      return moment(value).format('YYYY-MM-DD HH:mm:ss');
    }
  } else {
    return ""
  }
});

// 如果值为空，就给他赋值为 “无”
Vue.filter("setEmpty", function (value, text = "无") {
  if (value === "" || value === undefined || value === null) {
    return text;
  } else {
    return value;
  }
});

Vue.filter("convertUrl",convertUrl);
