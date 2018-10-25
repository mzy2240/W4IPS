<template>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	data() {
		return {
			anchor: null,
			genDataLength: null,
			show: false,
			marginalcost: [],
			gens: null,
			areaData: [],
			areaDataLength: this.$store.state.fieldstore['Area'].length,
			busAnchor: 0,
			busDataLength: 0,
			busArrLength: 0,
			formatRiskBuses: [],
			busData: [],
			violateBuses: [],
			branchData: [],
			branchAnchor: 0,
			branchDataLength: 0,
			branchArrLength: 0,
			highRiskLines: {},
			formatRiskLines: [],
			subdata: [],
			linedata: [],
			subdetail: [],
			busdetail: []
		};
	},
	methods: {
		before_init() {
			const temp = this.$store.state.casedetail;
			if (temp.content.type == 'dsmDictionary') {
				for (let ele in temp.content.Substation) {
					this.subdata.push({
						id: ele,
						name: temp.content.Substation[ele]['String.Name'],
						value: [
							temp.content.Substation[ele]['Double.Longitude'],
							temp.content.Substation[ele]['Double.Latitude']
						],
						attributes: {},
						bus: []
					});
				}
				for (let ele in temp.content.Branch) {
					const fromid = ele.split(',')[0];
					const toid = ele.split(',')[1];
					const coords = [
						this.subdata[temp.content.Bus[fromid]['Int.Sub Number'] - 1].value,
						this.subdata[temp.content.Bus[toid]['Int.Sub Number'] - 1].value
					];
					this.linedata.push({
						id: ele,
						name:
							this.subdata[
								temp.content.Bus[fromid]['Int.Sub Number'] - 1
							].name.split('_')[0] +
							'-' +
							this.subdata[
								temp.content.Bus[toid]['Int.Sub Number'] - 1
							].name.split('_')[0],
						coords: coords,
						count: 1,
						attributes: {
							MVALimit: temp.content.Branch[ele]['Single.MVA Limit'],
							volt: temp.content.Bus[fromid]['Single.Nominal kV']
						}
					});
				}
				this.subdetail = temp.content.Substation;
				this.busdetail = temp.content.Bus;
				for (let ele in this.subdetail) {
					this.subdetail[ele].Bus = [];
				}
				for (let ele in temp.content.Gen) {
					this.busdetail[ele].Gen = temp.content.Gen[ele];
				}
				for (let ele in temp.content.Load) {
					this.busdetail[ele].Load = temp.content.Load[ele];
				}
				for (let ele in temp.content.Shunt) {
					this.busdetail[ele].Shunt = temp.content.Shunt[ele];
				}
				for (let ele in temp.content.Bus) {
					this.subdetail[temp.content.Bus[ele]['Int.Sub Number']].Bus.push(
						this.busdetail[ele]
					);
				}
				this.$store.commit('updateSubDetail', this.subdetail);
			}
		},
		initRiskBus() {
			var arrlength;
			var keyCaseArr;
			var valueFieldArr;

			for (let ele in this.$store.state.fieldstore) {
				arrlength = this.$store.state.fieldstore[ele].length;
				keyCaseArr = Object.keys(this.$store.state.casedetail.content[ele]);
				valueFieldArr = Object.values(this.$store.state.fieldstore[ele]);
				if (ele != 'Bus') {
					this.busAnchor += arrlength * keyCaseArr.length;
				} else {
					this.busDataLength = arrlength * keyCaseArr.length;
					this.busArrLength = arrlength;
					break;
				}
			}
			// this.statusArray = Array(keyCaseArr.length).fill(1);
		},
		onMonitorRiskBus() {
			let i = 0;
			var key;
			for (let [key, val] of Object.entries(
				this.$store.state.casedetail.content.Bus
			)) {
				if (
					this.busData[i] <= val['Single.Max Limit'] ||
					this.busData[i] >= val['Single.Min Limit']
				) {
					// this.highRiskLines[key] = val;
					this.violateBuses[key] = {};
					this.violateBuses[key]['name'] = key;
					this.violateBuses[key]['Vpu'] = this.busData[i];
					this.violateBuses[key]['Max'] = val['Single.Min Limit'];
					this.violateBuses[key]['Min'] = val['Single.Max Limit'];
					this.violateBuses[key]['SubID'] = val['Int.Sub Number'];
					this.violateBuses[key]['value'] = [
						this.$store.state.casedetail.content.Substation[
							val['Int.Sub Number'].toString()
						]['Double.Longitude'],
						this.$store.state.casedetail.content.Substation[
							val['Int.Sub Number'].toString()
						]['Double.Latitude']
					];
				} else if (key in this.violateBuses) {
					delete this.violateBuses[key];
				}
				i += this.busArrLength;
			}
			this.formatRiskBuses = Object.values(this.violateBuses);
			this.$store.commit('setRiskBuses', this.formatRiskBuses);
		},
		initRiskBranch() {
			var arrlength;
			var keyCaseArr;
			var valueFieldArr;

			for (let ele in this.$store.state.fieldstore) {
				arrlength = this.$store.state.fieldstore[ele].length;
				keyCaseArr = Object.keys(this.$store.state.casedetail.content[ele]);
				valueFieldArr = Object.values(this.$store.state.fieldstore[ele]);
				if (ele != 'Branch') {
					this.branchAnchor += arrlength * keyCaseArr.length;
				} else {
					this.branchDataLength = arrlength * keyCaseArr.length;
					this.branchArrLength = arrlength;
					break;
				}
			}
		},
		onMonitorRiskBranch() {
			let i = 0;
			var key;
			for (let index in this.linedata) {
				key = this.linedata[index].id;
				if (
					this.branchData[i + 3] >=
					0.85 * this.linedata[index].attributes.MVALimit
				) {
					this.highRiskLines[key] = {};
					this.highRiskLines[key]['name'] = key;
					this.highRiskLines[key]['MVA'] = this.branchData[i + 3];
					this.highRiskLines[key]['Ratio'] = (
						(this.branchData[i + 3] / this.linedata[index].attributes.MVALimit) *
						100
					).toFixed(2);
					this.highRiskLines[key]['MVALimit'] = this.linedata[
						index
					].attributes.MVALimit;
					this.highRiskLines[key]['coords'] = this.linedata[index].coords;
				} else if (key in this.highRiskLines) {
					delete this.highRiskLines[key];
				}
				i += this.branchArrLength;
			}
			this.formatRiskLines = Object.values(this.highRiskLines);
			this.$store.commit('setRiskBranches', this.formatRiskLines);
		},
		initData() {
			let temp = [];
			let subID;
			for (let i in this.$store.state.casedetail.content.Gen) {
				subID = this.$store.state.casedetail.content.Bus[i]["Int.Sub Number"];
				temp.push({
					value: [this.$store.state.casedetail.content.Substation[subID.toString()]["Double.Longitude"], this.$store.state.casedetail.content.Substation[subID.toString()]["Double.Latitude"]],
					name: i,
					Status: 1,
					MWMax: this.$store.state.casedetail.content.Gen[i][
						'Single.MW Max Limit'
					],
					MWMin: this.$store.state.casedetail.content.Gen[i][
						'Single.MW Min Limit'
					],
					MW: 0,
					Mvar: 0,
					MWSetpoint: 0,
					VpuSetpoint: 1,
					OperationCost: this.$store.state.casedetail.content.Gen[i][
						'OperationCost'
					],
					MarginalCostCoefficients: this.$store.state.casedetail.content.Gen[i][
						'MarginalCostCoefficients'
					],
					MarginalCost: 0,
					id: this.$store.state.casedetail.content.Gen[i]['String.ID'],
					AGC: false
				});
			}
			this.gens = temp;
			if (this.gens.length > 1) {
				return Promise.resolve('Table initialized properly');
			} else {
				return Promise.reject('Error in initialization');
			}
		},
		preProcess() {
			let anchor = 0;
			var arrlength;
			var keyarr;

			for (let ele in this.$store.state.fieldstore) {
				arrlength = this.$store.state.fieldstore[ele].length;
				keyarr = Object.keys(this.$store.state.casedetail.content[ele]);
				if (ele != 'Gen') {
					anchor += arrlength * keyarr.length;
				} else {
					break;
				}
			}
			this.anchor = anchor;
			this.genDataLength = arrlength;
		},
		getMP() {
			const message = JSON.parse(this.$store.state.rawdata)
			this.$store.commit('setCurrentTime', +message['SOC']);
			this.$store.commit('setCurrentStatus', message['Status']);
			const temp = message.Data;
			this.areaData = temp.slice(0, this.areaDataLength);
			this.busData = temp.slice(this.busAnchor, this.busAnchor + this.busDataLength);
			this.branchData = temp.slice(this.branchAnchor, this.branchAnchor + this.branchDataLength);
			this.$store.commit('setData', temp);
			this.$store.commit('setAreaData', areaData);
			for (let i in this.gens) {
				this.gens[i].MW = temp[this.anchor + 6 + i * this.genDataLength]; // MW is the 6th in the gen data
				this.gens[i].Mvar = temp[this.anchor + 7 + i * this.genDataLength];
				this.gens[i].MWSetpoint =
					temp[this.anchor + 10 + i * this.genDataLength];
				this.gens[i].VpuSetpoint =
					temp[this.anchor + 9 + i * this.genDataLength];
				this.gens[i].Status = temp[this.anchor + 5 + i * this.genDataLength];
				this.gens[i].MarginalCost = (
					this.gens[i].MarginalCostCoefficients[0] +
					this.gens[i].MarginalCostCoefficients[1] * 2 * this.gens[i].MW
				).toFixed(2);
			}
			this.$store.commit('updateGenData', this.gens);
		},
		updateTotalCost() {
			setInterval(() => {
				let deltaCost = 0;
				let deltaMWh = 0;
				for (let i in this.gens) {
					deltaCost +=
						this.gens[i].MarginalCostCoefficients[0]*this.gens[i].MW*1+
						this.gens[i].MarginalCostCoefficients[1]*this.gens[i].MW*this.gens[i].MW;
					deltaMWh += this.gens[i].MW;
                }
                this.$store.commit('updateUnitTimeCost',+deltaCost.toFixed(0));
				deltaCost = deltaCost / 120;
                deltaMWh = deltaMWh*1/ 120;
				this.$store.commit('addCost', +deltaCost.toFixed(0));
				this.$store.commit('addMWh', +deltaMWh.toFixed(2));
				// console.log(deltaCost.toFixed(2));
			}, 500);
		}
	},
	created() {
		this.before_init();
		this.preProcess();
		this.initData();
		this.initRiskBus();
		this.initRiskBranch();
		this.updateTotalCost();
		setInterval(()=> {
			if(this.$store.state.status === 'running') {
				this.$store.commit('addReportData', {
					time: this.$store.state.currentTime,
					areaData: this.areaData
			});
			}
		}, 1000);
		setInterval(() => {
			if(this.$store.state.status === 'running') {
				if(this.formatRiskBuses.length>0) {
				this.$store.commit('addReportViolate', {
					time: this.$store.state.currentTime,
					Bus: this.formatRiskBuses
					})
				};
				if(this.formatRiskLines.length>0) {
					this.$store.commit('addReportViolate', {
						time: this.$store.state.currentTime,
						Branch: this.formatRiskLines
					})
				};
			}
		}, 5000);
	},
	computed: {
		...mapGetters({
			dataflag: 'getDataUpdate'
		})
	},
	watch: {
		dataflag: function() {
			this.getMP();
			this.onMonitorRiskBus();
			this.onMonitorRiskBranch();
		}
	}
};
</script>

