<template>
</template>

<script>
import { mapGetters } from 'vuex';
import * as math from 'mathjs';

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
			busdetail: [],
			area_index: 0,
			genArray: [],
			busArray: [],
			areaBus: {},
			branchArray: []
		};
	},
	methods: {
		before_init() {
			const temp = this.$store.state.casedetail;
			let count = 0;
			let count_b = 0;
			let otherSub = [];
			let otherBranch = [];
			let longList = [];
			let latList = [];
			// console.log(this.$store.state.area)
			this.area_index = Object.keys(
				this.$store.state.casedetail.content.Area
			).indexOf(this.$store.state.area.toString());
			if (temp.content.type == 'dsmDictionary') {
				for (let ele in temp.content.Substation) {
					if (
						temp.content.Substation[ele]['Int.Area Number'] ==
						+this.$store.state.area
					) {
						longList.push(temp.content.Substation[ele]['Double.Longitude']);
						latList.push(temp.content.Substation[ele]['Double.Latitude']);
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
					} else {
						otherSub.push({
							name: temp.content.Substation[ele]['String.Name'],
							value: [
								temp.content.Substation[ele]['Double.Longitude'],
								temp.content.Substation[ele]['Double.Latitude']
							]
						});
					}
				}
				this.$store.commit('setCenter', [
					math.median(longList),
					math.median(latList)
				]);
				for (let ele in temp.content.Branch) {
					const fromid = ele.split(',')[0];
					const toid = ele.split(',')[1];
					const coords = [
						[
							temp.content.Substation[
								temp.content.Bus[fromid]['Int.Sub Number'].toString()
							]['Double.Longitude'],
							temp.content.Substation[
								temp.content.Bus[fromid]['Int.Sub Number'].toString()
							]['Double.Latitude']
						],
						[
							temp.content.Substation[
								temp.content.Bus[toid]['Int.Sub Number'].toString()
							]['Double.Longitude'],
							temp.content.Substation[
								temp.content.Bus[toid]['Int.Sub Number'].toString()
							]['Double.Latitude']
						]
					];
					if (
						[
							temp.content.Branch[ele]['FromArea'],
							temp.content.Branch[ele]['ToArea']
						].includes(+this.$store.state.area)
					) {
						this.branchArray.push(count_b);
						this.linedata.push({
							id: ele,
							name:
								temp.content.Substation[
									temp.content.Bus[fromid]['Int.Sub Number'].toString()
								]['String.Name'].split('_')[0] +
								'-' +
								temp.content.Substation[
									temp.content.Bus[toid]['Int.Sub Number'].toString()
								]['String.Name'].split('_')[0],
							coords: coords,
							count: 1,
							attributes: {
								MVALimit: temp.content.Branch[ele]['Single.MVA Limit'],
								volt: temp.content.Bus[fromid]['Single.Nominal kV']
							}
						});
					} else {
						if (temp.content.Branch[ele]['Byte.Type'] == 0) {
							otherBranch.push({
								name:
									temp.content.Substation[
										temp.content.Bus[fromid]['Int.Sub Number'].toString()
									]['String.Name'].split('_')[0] +
									'-' +
									temp.content.Substation[
										temp.content.Bus[toid]['Int.Sub Number'].toString()
									]['String.Name'].split('_')[0],
								coords: coords
							});
						}
					}
					count_b++;
				}
				for (let i in this.$store.state.areadetail.content.Bus) {
					if (
						this.$store.state.areadetail.content.Bus[i]['Int.Area Number'] ==
						+this.$store.state.area
					) {
						this.busArray.push(count);
						this.areaBus[i] = this.$store.state.areadetail.content.Bus[i];
					}
					count++;
				}
				this.subdetail = temp.content.Substation;
				this.busdetail = temp.content.Bus;
				for (let ele in this.subdetail) {
					this.subdetail[ele].Bus = [];
				}
				for (let ele in temp.content.Gen) {
					this.busdetail[ele.split(',')[0]].Gen = temp.content.Gen[ele];
				}
				for (let ele in temp.content.Load) {
					this.busdetail[ele.split(',')[0]].Load = temp.content.Load[ele];
				}
				for (let ele in temp.content.Shunt) {
					this.busdetail[ele.split(',')[0]].Shunt = temp.content.Shunt[ele];
				}
				for (let ele in temp.content.Bus) {
					this.subdetail[temp.content.Bus[ele]['Int.Sub Number']].Bus.push(
						this.busdetail[ele]
					);
				}
				this.$store.commit('setSubData', this.subdata);
				this.$store.commit('setLineData', this.linedata);
				this.$store.commit('setOtherArea', {
					Substation: otherSub,
					Branch: otherBranch
				});
				this.$store.commit('updateSubDetail', this.subdetail);
			}
		},
		initRiskBus() {
			var arrlength;
			var keyCaseArr;
			var valueFieldArr;

			for (let ele in this.$store.state.fieldstore) {
				arrlength = this.$store.state.fieldstore[ele].length;
				keyCaseArr = Object.keys(this.$store.state.areadetail.content[ele]);
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
			for (let [key, val] of Object.entries(this.areaBus)) {
				if (
					this.busData[this.busArray[i] * this.busArrLength] <=
						val['Single.Max Limit'] ||
					this.busData[this.busArray[i] * this.busArrLength] >=
						val['Single.Min Limit']
				) {
					// this.highRiskLines[key] = val;
					this.violateBuses[key] = {};
					this.violateBuses[key][
						'name'
					] = this.$store.state.areadetail.content.Bus[key]['String.Name'];
					this.violateBuses[key]['Vpu'] = this.busData[
						this.busArray[i] * this.busArrLength
					];
					this.violateBuses[key]['Max'] = val['Single.Min Limit'];
					this.violateBuses[key]['Min'] = val['Single.Max Limit'];
					this.violateBuses[key]['SubID'] = val['Int.Sub Number'];
					this.violateBuses[key]['value'] = [
						this.$store.state.areadetail.content.Substation[
							val['Int.Sub Number'].toString()
						]['Double.Longitude'],
						this.$store.state.areadetail.content.Substation[
							val['Int.Sub Number'].toString()
						]['Double.Latitude']
					];
				} else if (key in this.violateBuses) {
					delete this.violateBuses[key];
				}
				i++;
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
				keyCaseArr = Object.keys(this.$store.state.areadetail.content[ele]);
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
					this.branchData[index * this.branchArrLength + 3] >=
					0.85 * this.linedata[index].attributes.MVALimit
				) {
					this.highRiskLines[key] = {};
					this.highRiskLines[key]['name'] =
						this.$store.state.casedetail.content.Bus[key.split(',')[0]][
							'String.Name'
						] +
						'-' +
						this.$store.state.casedetail.content.Bus[key.split(',')[1]][
							'String.Name'
						];
					this.highRiskLines[key]['MVA'] = this.branchData[
						index * this.branchArrLength + 3
					];
					this.highRiskLines[key]['Ratio'] = (
						(this.branchData[index * this.branchArrLength + 3] /
							this.linedata[index].attributes.MVALimit) *
						100
					).toFixed(2);
					this.highRiskLines[key]['MVALimit'] = this.linedata[
						index
					].attributes.MVALimit;
					this.highRiskLines[key]['coords'] = this.linedata[index].coords;
				} else if (key in this.highRiskLines) {
					delete this.highRiskLines[key];
				}
				i++;
			}
			this.formatRiskLines = Object.values(this.highRiskLines);
			this.$store.commit('setRiskBranches', this.formatRiskLines);
		},
		initData() {
			let temp = [];
			let subID;
			let count = 0;
			// console.log(this.$store.state.casedetail.content.Gen)
			for (let i in this.$store.state.areadetail.content.Gen) {
				// if (
				// 	this.$store.state.areadetail.content.Gen[i]['Int.Area Number'] ==
				// 	+this.$store.state.area && this.$store.state.areadetail.content.Gen[i]['Single.MW Max Limit'] != 0
				// ) {
				if (
					this.$store.state.areadetail.content.Gen[i]['Int.Area Number'] ==
					+this.$store.state.area
				) {
					this.genArray.push(count);
					subID = this.$store.state.areadetail.content.Bus[i.split(',')[0]][
						'Int.Sub Number'
					];
					temp.push({
						value: [
							this.$store.state.areadetail.content.Substation[subID.toString()][
								'Double.Longitude'
							],
							this.$store.state.areadetail.content.Substation[subID.toString()][
								'Double.Latitude'
							]
						],
						key: i,
						name: this.$store.state.areadetail.content.Bus[i.split(',')[0]][
							'String.Name'
						], //i,
						Status: 1,
						MWMax: this.$store.state.areadetail.content.Gen[i][
							'Single.MW Max Limit'
						],
						MWMin: this.$store.state.areadetail.content.Gen[i][
							'Single.MW Min Limit'
						],
						MW: 0,
						Mvar: 0,
						MWSetpoint: 0,
						VpuSetpoint: 1,
						OperationCost: this.$store.state.areadetail.content.Gen[i][
							'OperationCost'
						],
						MarginalCostCoefficients: this.$store.state.areadetail.content.Gen[
							i
						]['MarginalCostCoefficients'],
						MarginalCost: 0,
						id: this.$store.state.areadetail.content.Gen[i]['String.ID'],
						AGC: false
					});
				}
				count++;
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
				keyarr = Object.keys(this.$store.state.areadetail.content[ele]);
				if (ele != 'Gen') {
					anchor += arrlength * keyarr.length;
				} else {
					break;
				}
			}
			this.anchor = anchor;
			this.genDataLength = arrlength;
		},
		regularLoop() {
			const message = JSON.parse(this.$store.state.rawdata);
			this.$store.commit('setCurrentTime', +message['SOC']);
			this.$store.commit('setCurrentStatus', message['Status']);
			const temp = message.Data;
			// console.log(temp)
			this.$store.commit('setParsedData', temp);
			this.areaData = temp.slice(
				this.area_index * this.areaDataLength,
				this.area_index * this.areaDataLength + this.areaDataLength
			);
			// this.areaData = temp.slice(0, this.areaDataLength);
			this.busData = temp.slice(
				this.busAnchor,
				this.busAnchor + this.busDataLength
			);
			this.branchData = temp.slice(
				this.branchAnchor,
				this.branchAnchor + this.branchDataLength
			);
			this.$store.commit('setBranchData', this.branchData);
			this.$store.commit('setData', temp);
			this.$store.commit('setAreaData', this.areaData);
			for (let i in this.gens) {
				this.gens[i].MW =
					temp[this.anchor + 6 + this.genArray[i] * this.genDataLength]; // MW is the 6th in the gen data
				this.gens[i].Mvar =
					temp[this.anchor + 7 + this.genArray[i] * this.genDataLength];
				this.gens[i].MWSetpoint =
					temp[this.anchor + 10 + this.genArray[i] * this.genDataLength];
				this.gens[i].VpuSetpoint =
					temp[this.anchor + 9 + this.genArray[i] * this.genDataLength];
				this.gens[i].Status =
					temp[this.anchor + 5 + this.genArray[i] * this.genDataLength];
			}
			this.$store.commit('updateGenData', this.gens);
		},
		updateMC() {
			for (let i in this.gens) {
				this.gens[i].MarginalCost = (
					this.gens[i].MarginalCostCoefficients[0] +
					this.gens[i].MarginalCostCoefficients[1] * 2 * this.gens[i].MW
				).toFixed(2);
			}
			this.$store.commit('updateGenData', this.gens);
		},
		updateTotalCost() {
			setInterval(() => {
				let deltaScheduleCost = 0;
				if (this.$store.state.schedule) {
					deltaScheduleCost =
						+this.$store.state.schedule.split('@')[0] *
						+this.$store.state.schedule.split('@')[1];
					this.$store.commit(
						'setACE',
						-(
							+this.$store.state.schedule.split('@')[0] +
							this.$store.state.areaData[6]
						)
					);
				} else {
					this.$store.commit('setACE', -this.$store.state.areaData[6]);
				}
				if (this.$store.state.status === 'running') {
					let deltaCost = 0;
					// let temp = 0;
					let deltaMWh = this.$store.state.areaData[2];
					// let deltaMWh = 0;
					// console.log(this.gens);
					for (let i in this.gens) {
						deltaCost +=
							this.gens[i].MarginalCostCoefficients[0] * this.gens[i].MW * 1 +
							this.gens[i].MarginalCostCoefficients[1] *
								this.gens[i].MW *
								this.gens[i].MW;
						// temp += this.gens[i].MW;
						// deltaMWh += this.gens[i].MW;
						// console.log(this.gens[i].MarginalCostCoefficients[0]+this.gens[i].MarginalCostCoefficients[1] *this.gens[i].MW);
					}
					// deltaCost = 0;
					// console.log([temp, this.$store.state.areaData[0]])
					// console.log(deltaCost/this.$store.state.areaData[0])
					deltaCost +=
						math.max(this.$store.state.ACE, 0) * this.$store.state.aceCost +
						deltaScheduleCost;
					// console.log(deltaScheduleCost);
					this.$store.commit('updateUnitTimeCost', +deltaCost.toFixed(0));
					deltaCost = deltaCost / 120;
					deltaMWh = (deltaMWh * 1) / 120;
					this.$store.commit('addCost', +deltaCost.toFixed(0));
					this.$store.commit('addMWh', +deltaMWh.toFixed(2));
					// console.log(deltaCost.toFixed(2));
				}
			}, 500);
		},
		addAreaHelper() {
			const areaHelper = {
				Bus: {
					anchor: this.busAnchor,
					length: this.busArrLength, //For a single bus object, not for the whole bus list
					list: this.busArray
				},
				Gen: {
					anchor: this.anchor,
					length: this.genDataLength,
					list: this.genArray
				},
				Branch: {
					anchor: this.branchAnchor,
					length: this.branchArrLength,
					list: this.branchArray
				}
			};
			this.$store.commit('setAreaHelper', areaHelper);
		}
	},
	created() {
		this.before_init();
		this.preProcess();
		this.initData();
		this.initRiskBus();
		this.initRiskBranch();
		this.addAreaHelper();
		this.updateTotalCost();
		setInterval(() => {
			if (this.$store.state.status === 'running') {
				this.$store.commit('addReportData', {
					time: this.$store.state.currentTime,
					areaData: this.areaData
				});
			}
			var status, mwmax;
			let offlineCapacity = 0;
			let index = 0;
			// console.log(this.$store.state.genData)
			for (let i in this.$store.state.genData) {
				status = this.$store.state.genData[i].Status;
				mwmax = this.$store.state.genData[i].MWMax;

				// index += 1;
				if (status == 0 && mwmax != 0) {
					// console.log(val);
					offlineCapacity += this.$store.state.genData[i].MWMax;
				}
			}
			const onlineCapacity = Math.abs(
				Math.round(
					this.$store.state.totalCapacity - offlineCapacity - this.$store.state.areaData[0]
				)
			);
			this.$store.commit('setGenStat', [onlineCapacity, offlineCapacity]);
		}, 1000);
		setInterval(() => {
			if (this.$store.state.status === 'running') {
				if (this.formatRiskBuses.length > 0) {
					this.$store.commit('addReportViolate', {
						time: this.$store.state.currentTime,
						Bus: this.formatRiskBuses
					});
				}
				if (this.formatRiskLines.length > 0) {
					this.$store.commit('addReportViolate', {
						time: this.$store.state.currentTime,
						Branch: this.formatRiskLines
					});
				}
			}
			this.updateMC();
		}, 5000);
		setInterval(()=>{
			const RIndex = Math.round(50*(Math.exp(-0.05*this.formatRiskBuses.length) + Math.exp(-0.1*this.formatRiskLines.length)))
			this.$store.commit('setRIndex', RIndex);
			this.$store.commit('addReportData', {time: this.$store.state.currentTime, RIndex: RIndex})
		}, 1000)
	},
	computed: {
		...mapGetters({
			dataflag: 'getDataUpdate'
		})
	},
	watch: {
		dataflag: function() {
			this.regularLoop();
			this.onMonitorRiskBus();
			this.onMonitorRiskBranch();
		}
	}
};
</script>

