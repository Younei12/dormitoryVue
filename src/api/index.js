import axios from "axios";
import {Message, MessageBox} from "element-ui";
import router from "@/router";
import app from "@/main";
import {logout} from "@/utils/service";

let config = require('@/config.js');
// axios初始化
let request = axios.create({
  baseURL: config.baseUrl,
  timeout: 60000,
  headers: {}
});

// axios的二次封装
request.interceptors.request.use(config => {
  if (!config.headers.token) {
    config.headers.token = localStorage.getItem("ds_token")
  }
  return config
});

request.interceptors.response.use(response => response, async error => {
  const status = error.response && error.response.status;
  if (status === 401) {
    const route = app.$route;
    await logout();
    await MessageBox.alert('登录已过期，请重新登录', '提示', {type: "error"});
  } else if (status === 500) {
    Message.error('服务器错误 errcode:500');
  } else if (status === 403) {
    await MessageBox.alert('您没有权限！', '提示', {type: "error"});
  }

  return Promise.reject(error)
});
export default request;
