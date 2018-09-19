import Vue from 'vue';
import Vuex from 'vuex';
import datafield from './assets/datafield.json'
import tcmcommands from './assets/tcmcommands.json'
import casedetail from './assets/150.json'
// import casedetail from './assets/150.json'

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		toPublish: 0,
		message: '',
		UUID: '',
		fieldstore: datafield,
		tcmcommands: tcmcommands,
		casedetail: casedetail,
		rawdata: {},
		newsubscribe: [],
		newpublish: [],
		startsim: 0
	},
	getters: {
		getPubStatus(state) {
			return state.toPublish;
		},
		getMessage(state) {
			return state.message;
		},
		getDataUpdate(state) {
			return state.rawdata;
		},
		getNewSubscribe(state) {
			return state.newsubscribe;
		},
		getNewPublish(state) {
			return state.newpublish;
		},
		startsimtrigger(state) {
			return state.startsim;
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
		},
		updateRawData(state, payload) {
			state.rawdata = payload;
		},
		setnewsubscribe(state, payload) {
			state.newsubscribe = payload;
		},
		setnewpublish(state, payload) {
			state.newpublish = payload;
		},
		trigstartsim(state) {
			state.startsim ++;
		}
	},
	actions: {
		updatemessage({ commit }, payload) {
			commit('setMessage', payload);
		}
	}
});
