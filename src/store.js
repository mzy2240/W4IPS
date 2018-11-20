import Vue from 'vue';
import Vuex from 'vuex';
import datafield from './assets/datafield.json';
import tcmcommands from './assets/tcmcommands.json';
// import casedetail from './assets/150G.json';
import casedetail from './assets/460labGA.json';
// import casedetail from './assets/test.json';
import areadetail from './assets/460labGAR.json';
import notificationSystem from './assets/notificationsettings';
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
		areadetail: areadetail,
		rawdata: {},
		newsubscribe: [],
		newpublish: [],
		startsim: 0,
		pausesim: 0,
		continuesim: 0,
		abortsim: 0,
		ready4start: false,
		page: 'Home',
		notificationSystem,
		badge: 0,
		badgelist: [],
		badgeShow: false,
		subDetail: {},
		busDetail: {},
		totalCapacity: (function() {
			var temp = 0;
			for (let ele in areadetail.content.Gen) {
				if (casedetail.content.Gen[ele]['Single.MW Max Limit'] != 0) {
					temp += casedetail.content.Gen[ele]['Single.MW Max Limit'];
				}
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
		simtime: null,
		slider: 150,
		startTime: null,
		currentTime: null,
		lapse: null,
		status: 'offline',
		report: {
			name: null,
			user: [],
			data: [],
			violate: [],
			comment: null
		},
		areaData: [],
		data: [],
		riskBuses: [],
		riskBranches: [],
		notMuted: true,
		area: null,
		subData: null,
		lineData: null,
		areaHelper: null,
		otherArea: null,
		parsedData: null,
		center: null,
		showTour: true,
		simID: null,
		branchData: null,
		aceCost: 100,
		schedule: null,
		genStat: [],
		rIndex: 100
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
		pausesimtrigger(state) {
			return state.pausesim;
		},
		continuesimtrigger(state) {
			return state.continuesim;
		},
		abortsimtrigger(state) {
			return state.abortsim;
		},
		page(state) {
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
		},
		getCurrentTime(state) {
			return state.currentTime;
		},
		getLapse(state) {
			return state.lapse;
		},
		getStatus(state) {
			return state.status;
		},
		getSchedule(state) {
			return state.schedule;
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
		updateConfig(state, payload) {
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
			state.startsim++;
		},
		trigcontinuesim(state) {
			state.continuesim++;
		},
		trigsimtoseconds(state, payload) {
			state.simtime = payload;
			state.startsim++;
		},
		trigpausesim(state) {
			state.pausesim++;
		},
		trigabortsim(state) {
			state.abortsim++;
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
			state.badge++;
			state.badgeShow = true;
		},
		resetbadge(state) {
			state.badge = 0;
			state.badgeShow = false;
		},
		updatebadgelist(state, payload) {
			state.badgelist.unshift(payload);
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
			state.violatedLines.push(payload);
		},
		removeLine(state, payload) {
			state.violatedLines.pop(payload);
		},
		updateSelectedBranches(state, payload) {
			state.violatedLines = payload;
		},
		updateVBuses(state, payload) {
			state.violatedBuses = payload;
		},
		updateSelectedShunts(state, payload) {
			state.selectedShunts = payload;
		},
		updateSelectedGens(state, payload) {
			state.selectedGens = payload;
		},
		triggerAlarm(state, payload) {
			if (!(payload in state.alarm)) {
				state.alarm.push(payload);
			}
		},
		dismissAlarm(state, payload) {
			if (payload in state.alarm) {
				state.alarm.pop(payload);
			}
		},
		updateGenData(state, payload) {
			state.genData = payload;
		},
		addCost(state, payload) {
			state.totalCost = state.totalCost + payload;
		},
		resetTotalCost(state) {
			state.totalCost = 0;
		},
		addMWh(state, payload) {
			state.totalMWh = state.totalMWh + payload;
		},
		updateUnitTimeCost(state, payload) {
			state.unitTimeCost = payload;
		},
		toggleALL(state, payload) {
			for (let i in state.genData) {
				if (state.genData[i].Status) {
					state.genData[i].AGC = payload;
				}
			}
		},
		onAdmin(state) {
			state.isAdmin = true;
		},
		setStartTime(state, payload) {
			state.startTime = payload;
		},
		setCurrentTime(state, payload) {
			state.currentTime = payload;
			if (state.startTime) {
				state.lapse = +(state.currentTime - state.startTime);
			}
		},
		setCurrentStatus(state, payload) {
			state.status = payload;
		},
		setReportName(state, payload) {
			state.report.name = payload;
		},
		addReportData(state, payload) {
			state.report.data.push(payload);
		},
		addReportUser(state, payload) {
			state.report.user.push(payload);
		},
		addReportViolate(state, payload) {
			state.report.violate.push(payload);
		},
		setReportComment(state, payload) {
			state.report.comment = payload;
		},
		resetReport(state) {
			state.report = {
				name: null,
				user: [],
				data: [],
				violate: [],
				comment: null
			};
		},
		setAreaData(state, payload) {
			state.areaData = payload;
		},
		setData(state, payload) {
			state.data = payload;
		},
		setRiskBuses(state, payload) {
			state.riskBuses = payload;
		},
		setRiskBranches(state, payload) {
			state.riskBranches = payload;
		},
		toggleMute(state) {
			state.notMuted = !state.notMuted;
		},
		setArea(state, payload) {
			state.area = payload;
		},
		setSubData(state, payload) {
			state.subData = payload;
		},
		setLineData(state, payload) {
			state.lineData = payload;
		},
		setAreaHelper(state, payload) {
			state.areaHelper = payload;
		},
		setOtherArea(state, payload) {
			state.otherArea = payload;
		},
		setParsedData(state, payload) {
			state.parsedData = payload;
		},
		setCenter(state, payload) {
			state.center = payload;
		},
		disableTour(state) {
			state.showTour = false;
		},
		setSimID(state, payload) {
			state.simID = payload;
		},
		setBranchData(state, payload) {
			state.branchData = payload;
		},
		setSchedule(state, payload) {
			state.schedule = payload;
		},
		setACE(state, payload) {
			state.ACE = payload;
		},
		setGenStat(state, payload) {
			state.genStat = payload;
		},
		setRIndex(state, payload) {
			state.rIndex = payload;
		}
	},
	actions: {
		updatemessage({ commit }, payload) {
			commit('setMessage', payload);
		}
	}
});
