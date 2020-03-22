import request from "@/api";
import localforage from "localforage";
import router from "@/router";
import app from "@/main";

// 获取用户信息
export const getUserInfo = async () => {
  return (await request.post('/api/user/getUserInfo')).data.data;
};

// 退出登录处理
export const logout = async () => {
  await localforage.removeItem('tags');
  localStorage.removeItem('ds_token');
  const route = app.$route;
  if (route !== '/login'){
    await router.replace('/login');
  }
};
