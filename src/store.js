import Vue from 'vue';
import Vuex from 'vuex';
import datafield from './assets/datafield.json'
import tcmcommands from './assets/tcmcommands.json'
import casedetail from './assets/150.json'

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		toPublish: 0,
		message: '',
		UUID: '',
		fieldstore: datafield,
		tcmcommands: tcmcommands,
		casedetail: casedetail
	},
	getters: {
		getPubStatus(state) {
			return state.toPublish;
		},
		getMessage(state) {
			return state.message;
		}
	},
	mutations: {
		setPublish(state) {
			state.toPublish++;
		},
		reset(state) {
			state.toPublish = 0;
		},
		setMessage(state, payload) {
			state.message = payload;
		},
		setUUID(state, payload) {
			state.UUID = payload;
		},
		updateConfig(state, payload){
			state.casedetail = payload;
		}
	},
	actions: {
		updatemessage({ commit }, payload) {
			commit('setMessage', payload);
		}
	}
});
