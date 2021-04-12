import request from "@/api";
import localforage from "localforage";
// localForage 是一个 JavaScript 库，通过简单类似 localStorage API 的异步存储来改进你的 Web 应用程序的离线体验。
// 它能存储多种类型的数据，而不仅仅是字符串。
// localForage 有一个优雅降级策略，若浏览器不支持 IndexedDB 或 WebSQL，则使用 localStorage。
import router from "@/router";
import app from "@/main";

// 获取用户信息
export const getUserInfo = async () => {
  return (await request.post('/api/user/getUserInfo')).data.data;
};

// 退出登录处理
export const logout = async () => {
  await localforage.removeItem('tags');
  // 移除 localstorage 里面的 token
  localStorage.removeItem('ds_token');
  // 获取当前的路由
  const route = app.$route;
  // 如果当前路由不是在登陆页面，则跳转到登陆页面
  if (route !== '/login'){
    await router.replace('/login');
  }
};
