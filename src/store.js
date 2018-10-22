import Vue from 'vue';
import Vuex from 'vuex';
import datafield from './assets/datafield.json'
import tcmcommands from './assets/tcmcommands.json'
import casedetail from './assets/150G.json'
// import casedetail from './assets/2000.json'
import notificationSystem from './assets/notificationsettings'
// import casedetail from './assets/150.json'

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		username: '',
		toPublish: 0,
		message: '',
		UUID: '',
		fieldstore: datafield,
		tcmcommands: tcmcommands,
		casedetail: casedetail,
		rawdata: {},
		newsubscribe: [],
		newpublish: [],
		startsim: 0,
		ready4start: false,
		page: 'Home',
		notificationSystem,
		badge: 0,
		badgelist: [],
		badgeShow: false,
		subDetail: {},
		busDetail: {},
		totalCapacity: (function(){
			var temp = 0;
			for (let ele in casedetail.content.Gen) {
				temp += casedetail.content.Gen[ele]["Single.MW Max Limit"]
			}
			return temp;
		})(),
		violatedLines: [],
		violatedBuses: [],
		selectedShunts: [],
		selectedGens: [],
		alarm: [],
		totalCost: 0,
		genData: [],
		totalMWh: 0,
		unitTimeCost: null,
		ACE: 30, // for test,
		isAdmin: false,
		simtime: null
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
		},
		page (state) {
			return state.page;
		},
		getBadge(state) {
			return state.badge;
		},
		getViolatedLines(state) {
			return state.violatedLines;
		},
		getViolatedBuses(state) {
			return state.violatedBuses;
		},
		getSelectedShunts(state) {
			return state.selectedShunts;
		},
		getSelectedGens(state) {
			return state.selectedGens;
		}
	},
	mutations: {
		setUsername(state, payload) {
			state.username = payload;
		},
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
		},
		trigsimtoseconds(state, payload) {
			state.simtime = payload;
			state.startsim ++;
		},
		clearsimtime(state) {
			state.simtime = null;
		},
		setstartready(state) {
			state.ready4start = true;
		},
		setstartdisable(state) {
			state.ready4start = false;
		},
		setpage(state, payload) {
			state.page = payload;
		},
		updatebadge(state) {
			state.badge ++;
			state.badgeShow = true;
		},
		resetbadge(state) {
			state.badge = 0;
			state.badgeShow = false;
		},
		updatebadgelist(state, payload) {
			state.badgelist.unshift(payload)
		},
		resetbadgelist(state) {
			state.badgelist = [];
		},
		updateSubDetail(state, payload) {
			state.subDetail = payload;
		},
		updateBusDetail(state, payload) {
			state.busDetail = payload;
		},
		addLine(state, payload) {
			state.violatedLines.push(payload)
		},
		removeLine(state, payload) {
			state.violatedLines.pop(payload)
		},
		updateSelectedBranches(state, payload) {
			state.violatedLines = payload;
		},
		updateVBuses(state, payload) {
			state.violatedBuses = payload
		},
		updateSelectedShunts(state, payload) {
			state.selectedShunts = payload
		},
		updateSelectedGens(state, payload) {
			state.selectedGens = payload
		},
		triggerAlarm(state, payload) {
			if(!(payload in state.alarm)) {
				state.alarm.push(payload);
			}
		},
		dismissAlarm(state, payload) {
			if(payload in state.alarm) {
				state.alarm.pop(payload);
			}
		},
		updateGenData(state, payload) {
			state.genData = payload;
		},
		addCost(state, payload) {
			state.totalCost = state.totalCost+payload;
		},
		addMWh(state, payload) {
			state.totalMWh = state.totalMWh + payload;
		},
		updateUnitTimeCost(state, payload) {
			state.unitTimeCost = payload;
		},
		toggleALL(state, payload) {
			for(let i in state.genData) {
				state.genData[i].AGC = payload;
			}
		},
		onAdmin(state) {
			state.isAdmin = true;
		}
	},
	actions: {
		updatemessage({ commit }, payload) {
			commit('setMessage', payload);
		}
	}
});
