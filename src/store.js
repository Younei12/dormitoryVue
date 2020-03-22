import Vue from 'vue'
import Vuex from 'vuex'
import {getUserInfo} from "@/utils/service";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userInfo: {}
  },
  mutations: {
    getUserInfo(state, userInfo) {
      state.userInfo = userInfo
    }
  },
  actions: {
    async getUserInfo({commit}) {
      const userInfo = await getUserInfo();
      commit('getUserInfo', userInfo);
    }
  }
})
