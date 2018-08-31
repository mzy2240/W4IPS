import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    toPublish: 0,
    message: ''
  },
  getters: {
    getPubStatus(state) {
      return state.toPublish
    },
    getMessage(state) {
      return state.message
    }
  },
  mutations: {
    setPublish (state) {
      state.toPublish++
    },
    reset(state) {
      state.toPublish = 0
    },
    setMessage (state, payload) {
      state.message = payload
    }
  },
  actions: {
    updatemessage({commit}, payload) {
      commit('setMessage', payload)
    }
  }
});
