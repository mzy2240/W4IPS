/* eslint-disable */
<template>
	<div>
		<v-layout row class="align-center layout px-4 pt-4 app--page-header">
			<div class="page-header-left">
				<h3 class="pr-3">Overview</h3>
			</div>
			<v-breadcrumbs divider="-">
				<v-breadcrumbs-item>
					<v-icon larg>home</v-icon>
				</v-breadcrumbs-item>
			</v-breadcrumbs>
			<v-spacer></v-spacer>
			<div class="page-header-right">
				<h4 class="pr-1">
					Hi {{$store.state.username}}
					<status-indicator :negative="$store.state.alarm" :positive="!$store.state.alarm" pulse></status-indicator>
				</h4>
			</div>
		</v-layout>
		<!-- <v-container grid-list-xs text-xs-center> -->
		<v-container grid-list-xl text-xs-center fluid>
			<v-layout row wrap>
				<!-- mini statistic start -->
				<v-flex lg3 sm6 xs12>
					<mini-statistic :name="'GenMW'" icon="fa fa-facebook" title="Total Generation (MW)" :sub-title="$store.state.areaData[0]" color="indigo" :img="require('../assets/icons8-factory-64.png')">
					</mini-statistic>
				</v-flex>
				<v-flex lg3 sm6 xs12>
					<mini-statistic :name="'LoadMW'" icon="fa fa-google" title="Total Load (MW)" :sub-title="$store.state.areaData[2]" color="red" :img="require('../assets/kitchen-set.png')">
					</mini-statistic>
				</v-flex>
				<v-flex lg3 sm6 xs12>
					<mini-statistic :name="'Freq'" icon="fa fa-twitter" title="Average Frequency (Hz)" :sub-title="$store.state.areaData[8]" color="light-blue" :img="require('../assets/icons8-frequency-64.png')">
					</mini-statistic>
				</v-flex>
				<v-flex lg3 sm6 xs12>
					<mini-statistic :name="'ExportMW'" icon="fa fa-instagram" title="Export Power (MW)" :sub-title="$store.state.areaData[6]" color="purple" :img="require('../assets/export.png')">
					</mini-statistic>
				</v-flex>
				<v-flex lg8 sm12 xs12>
					<m-widget title="Interactive Site Map" content-bg="white" @clicked="restore">
						<!-- <v-flex d-flex xs8 style="height: auto;"> -->
						<div slot="widget-content">
							<div id="main" class="chart"></div>
						</div>
					</m-widget>
				</v-flex>
				<v-flex lg4 sm12 xs12>
					<v-layout row wrap>
						<v-flex lg12 sm12 xs12>
							<chartStatistic id="TC" min="dataMin" max="dataMax" title="Total Cost" icon="attach_money" card-color="indigo" :chart-color="[color.indigo.lighten1]" :costData='$store.state.totalCost.toFixed(2)' type="line"></chartStatistic>
						</v-flex>
						<v-flex lg12 sm12 xs12>
							<v-widget title="Area Generation Overview" content-bg="white">
								<div slot="widget-content">
									<pie :areatotal="$store.state.areaData[0]"></pie>
									<!-- <v-card dark color="light-blue">

										<v-card-text class="px-0">Title</v-card-text>
									</v-card> -->
								</div>
							</v-widget>
						</v-flex>
						<v-flex lg12 sm12 xs12>
							<branchTable title="High-load Branches" :tabledata="$store.state.riskBranches"></branchTable>
						</v-flex>
					</v-layout>
				</v-flex>
			</v-layout>
		</v-container>
		<linepop v-if="lineshowDialog" :visible='lineshowDialog' :type='type' :id='id' :name='name' :volt='volt' @close="lineshowDialog=false" />
		<subpop v-if="subshowDialog" :visible='subshowDialog' :children='children' :type='type' :id='id' :name='name' :volt='volt' @close="subshowDialog=false" />

	</div>
</template>
<style scoped>
.chart {
	z-index: 0;
	height: 700px;
	width: 100%;
}
.cardiv {
	height: 300px;
	width: 100%;
}
</style>

<script>
import echarts from 'echarts';
// import 'echarts-gl/dist/echarts-gl';
import 'echarts-leaflet';
// import linepop from './linepop';
// import subpop from './subpop';
import _ from 'lodash';
import { mapGetters } from 'vuex';
import MWidget from '@/components/MWidget';
import VWidget from '@/components/VWidget';
import MiniStatistic from '@/components/MiniStat';
import pie from '@/components/pie';
import branchTable from '@/components/RiskBranchTable';
import chartStatistic from '@/components/chartStatistic';
import Material from 'vuetify/es5/util/colors';
// import _ from 'lodash';
// mapboxgl.accessToken =
// 	'pk.eyJ1IjoibXp5MjI0MCIsImEiOiJjamttc3VsODYyZmI4M2ttbGxmbzFudGM2In0.0dy22s32n9eth_63nlX1UA';

export default {
	name: 'TEST',
	data() {
		return {
			color: Material,
			chart: '',
			linedata: [],
			subdata: [],
			subdetail: [],
			busdetail: [],
			subshowDialog: false,
			lineshowDialog: false,
			children: {},
			type: '',
			id: '',
			name: '',
			volt: '',
			config: null,
			commands: [],
			anchor: 0,
			dataLength: 0,
			statusIndex: null,
			mwfromIndex: null,
			branchArrLength: null,
			statusArray: [],
			mwfromArray: [],
			openLineData: [],
			branchToOpenBranch: {},
			highRiskLines: {},
			formatRiskLines: []
		};
	},
	methods: {
		initdraw(id) {
			this.chart = echarts.init(document.getElementById(id));
			this.chart.setOption({
				animation: false,
				tooltip: {
					show: true,
					trigger: 'item'
				},
				// BMAP
				// bmap: {
				// 	center: [-86.84, 36.44],
				// 	zoom: 8,
				// 	roam: true,
				// 	mapStyle: {
				// 		// style: 'grayscale',
				// 		styleJson: [
				// 			{
				// 				featureType: 'administrative',
				// 				elementType: 'all',
				// 				stylers: {
				// 					color: '#ffffff',
				// 					visibility: 'off'
				// 				}
				// 			},
				// 			{
				// 				featureType: 'boundary',
				// 				elementType: 'all',
				// 				stylers: {
				// 					color: '#fefefe'
				// 				}
				// 			}
				// 		]
				// 	}
				// },
				// Leaflet
				leaflet: {
					center: [-86.0, 36.44],
					zoom: 8,
					roam: true,
					tiles: [
						{
							label: 'OpenStreetMap',
							urlTemplate:
								'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
							options: {
								attribution:
									'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
							}
						}
					]
				},
				// mapbox: {
				//   center: [-86.84, 36.44],
				//   zoom: 6.5,
				//   // pitch: 50,
				//   // bearing: -50,
				//   altitudeScale: 100000000,
				//   silent: true,
				//   style: "mapbox://styles/mapbox/dark-v9",
				//   postEffect: {
				//     enable: true,
				//     FXAA: {
				//       enable: true
				//     }
				//   },
				//   light: {
				//     main: {
				//       intensity: 1,
				//       shadow: true,
				//       shadowQuality: "high"
				//     },
				//     ambient: {
				//       intensity: 0
				//     }
				//   }
				// },
				series: [
					{
						id: 'sub',
						type: 'effectScatter',
						name: 'sub',
						coordinateSystem: 'leaflet',
						// coordinateSystem: 'bmap',
						symbol: 'circle',
						showEffectOn: 'emphasis',
						// zindex: 2,
						data: [],
						tooltip: {
							confine: true,
							formatter: function(params) {
								return 'Substation: ' + params.name;
							}
						},
						itemStyle: {
							color: 'rgb(200, 40, 0)'
						}
					},
					{
						id: 'lines',
						name: 'lines',
						type: 'lines',
						coordinateSystem: 'leaflet',
						// coordinateSystem: 'bmap',
						silent: false,
						effect: {
							show: true,
							constantSpeed: 20,
							symbol: 'arrow',
							symbolSize: 7,
							trailWidth: 2,
							trailLength: 0,
							trailOpacity: 1,
							spotIntensity: 10
						},
						// blendMode: 'lighter',
						// polyline: true,
						lineStyle: {
							width: 1,
							// color: 'rgb(200, 40, 0)',
							color: function(params) {
								let temp;
								// console.log(params.data.attributes.volt)
								switch (params.data.attributes.volt) {
									case 230:
										temp = '#3949ab';
										break;
									case 500:
										temp = '#e53935';
										break;
								}
								// console.log(params.data.attributes.volt);
								return temp;
							},
							opacity: 1
						},
						tooltip: {
							// position: [10, 10],
							confine: true,
							formatter: function(params) {
								return 'Branch: ' + params.name;
							}
						},
						emphasis: {
							lineStyle: {
								width: 2,
								shadowColor: 'rgba(144, 144, 255, 0.5)',
								shadowBlur: 10
							}
						},
						data: []
					},
					{
						id: 'openLines',
						name: 'openLines',
						type: 'lines',
						coordinateSystem: 'leaflet',
						// coordinateSystem: 'bmap',
						silent: false,
						// blendMode: 'lighter',
						// polyline: true,
						lineStyle: {
							width: 1,
							color: 'rgb(200, 40, 0)',
							type: 'dashed',
							opacity: 1
						},
						tooltip: {
							formatter: function(params) {
								return 'Branch: ' + params.name;
							}
						},
						emphasis: {
							lineStyle: {
								width: 2,
								shadowColor: 'rgba(144, 144, 255, 0.5)',
								shadowBlur: 10
							}
						},
						data: []
					},
					{
						id: 'violatedLines',
						name: 'violatedLines',
						type: 'lines',
						coordinateSystem: 'leaflet',
						silent: false,
						zlevel: 10,
						z: 10,
						symbol: 'pin',
						symbolSize: 30,
						lineStyle: {
							width: 10,
							color: '#bef67a',
							// type: 'dotted',
							shadowColor: '#ccff90',
							shadowBlur: 20,
							opacity: 1
						},
						label: {
							show: true,
							position: 'middle',
							color: 'black',
							// fontWeight: 'bold',
							formatter: function(params) {
								return 'Branch#' + params.name;
							}
						},
						data: []
					}
				]
			});
		},
		getData() {
			const temp = this.$store.state.casedetail;
			// const temp = require('../assets/150.json');
			// console.log(temp.content);
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
				// console.log(this.busdetail);
				// this.$store.commit('updateBusDetail', this.busdetail);
				this.$store.commit('updateSubDetail', this.subdetail);
			}
		},
		onDrawSub() {
			this.chart.setOption({
				series: [
					{
						id: 'sub',
						data: this.subdata
					}
				]
			});
			var self = this;
			this.chart.on('click', function(params) {
				if (params.seriesName == 'sub') {
					self.type = 'Substation';
					self.name = params.name;
					self.id = params.data.id;
					self.volt = '';
					self.children = self.subdetail[+params.data.id].Bus;
					self.subshowDialog = true;
				} else if (params.seriesName == 'lines') {
					self.type = 'Branch';
					self.name = params.name;
					self.id = params.data.id;
					self.volt = params.data.attributes.volt.toString() + 'kV';
					self.lineshowDialog = true;
				} else if (params.seriesName == 'openLines') {
					self.type = 'Branch';
					self.name = params.name;
					self.id = params.data.id;
					self.volt = params.data.attributes.volt.toString() + 'kV';
					self.lineshowDialog = true;
				}
			});
		},
		onDrawLines() {
			this.chart.setOption({
				series: [
					{
						id: 'lines',
						data: this.linedata
					}
				]
			});
		},
		initUpdateLines() {
			var arrlength;
			var keyCaseArr;
			var valueFieldArr;

			for (let ele in this.$store.state.fieldstore) {
				arrlength = this.$store.state.fieldstore[ele].length;
				keyCaseArr = Object.keys(this.$store.state.casedetail.content[ele]);
				valueFieldArr = Object.values(this.$store.state.fieldstore[ele]);
				if (ele != 'Branch') {
					this.anchor += arrlength * keyCaseArr.length;
				} else {
					this.dataLength = arrlength * keyCaseArr.length;
					this.statusIndex = valueFieldArr.indexOf('Status');
					this.mwfromIndex = valueFieldArr.indexOf('MWFrom');
					this.branchArrLength = arrlength;
					break;
				}
			}
			this.statusArray = Array(keyCaseArr.length).fill(1);
		},
		updateLinesCycle: function() {
			// setTimeout(() => {
			// 	this.updateLines();
			// }, 1000);
			setInterval(() => {
				this.updateLines();
				// console.log(this.$store.state.totalCost);
			}, 1500);
		},
		updateLines() {
			const temp = JSON.parse(this.$store.state.rawdata).Data;
			const branchData = temp.slice(this.anchor, this.anchor + this.dataLength);
			let branchIndex;
			let statusTemp = [];
			let branchChanged = false;
			let i = 0;
			var key;
			// for (let [key, val] of Object.entries(
			// 	this.$store.state.casedetail.content.Branch
			// )) {
			for (let index in this.linedata) {
				statusTemp.push(branchData[i]);
				branchIndex = i / this.branchArrLength;
				if (
					this.statusArray[branchIndex] == 1 &&
					[0, 2, 3].includes(branchData[i])
				) {
					// Branch opened
					this.updateLineOpen(branchIndex);
					branchChanged = true;
				} else if (
					[0, 2, 3].includes(this.statusArray[branchIndex]) &&
					branchData[i] == 1
				) {
					// Branch closed
					this.updateLineClose(branchIndex);
					branchChanged = true;
				}
				key = this.linedata[index].id;
				// console.log(key);
				if (
					branchData[i + 3] >=
					0.85 * this.linedata[index].attributes.MVALimit
				) {
					// this.highRiskLines[key] = val;
					this.highRiskLines[key] = {};
					this.highRiskLines[key]['name'] = key;
					this.highRiskLines[key]['MVA'] = branchData[i + 3];
					this.highRiskLines[key]['Ratio'] = (
						(branchData[i + 3] / this.linedata[index].attributes.MVALimit) *
						100
					).toFixed(2);
					this.highRiskLines[key]['MVALimit'] = this.linedata[
						index
					].attributes.MVALimit;
					this.highRiskLines[key]['coords'] = this.linedata[index].coords;
				} else if (key in this.highRiskLines) {
					delete this.highRiskLines[key];
				}
				// if (branchData[i + 3] >= 0.85 * val['Single.MVA Limit']) {
				// 	this.highRiskLines[key] = val;
				// 	this.highRiskLines[key]['name'] = key;
				// 	this.highRiskLines[key]['MVA'] = branchData[i + 3];
				// 	this.highRiskLines[key]['Ratio'] =
				// 		((branchData[i + 3] / val['Single.MVA Limit']) * 100)
				// 			.toFixed(2);
				// } else if (key in this.highRiskLines) {
				// 	delete this.highRiskLines[key];
				// }
				i += this.branchArrLength;
			}
			this.formatRiskLines = Object.values(this.highRiskLines);
			// console.log(this.formatRiskLines);
			// console.log(this.highRiskLines);
			if (branchChanged) {
				// console.log(this.openLineData);
				this.chart.setOption({
					series: [
						{
							id: 'lines',
							data: this.linedata
						},
						{
							id: 'openLines',
							data: this.openLineData
						}
					]
				});
				this.statusArray = statusTemp;
			}
		},
		updateLineOpen(branchIndex) {
			const temp = _.cloneDeep(this.linedata[branchIndex]);
			// this.branchToOpenBranch[
			// 	branchIndex.toString()
			// ] = this.openLineData.length;
			this.openLineData.push(temp);
			// this.linedata[branchIndex]['coords'] = [[], []];
			this.linedata[branchIndex]['coords'] = [temp.coords[0], temp.coords[0]];
		},
		updateLineClose(branchIndex) {
			for (let i in this.openLineData) {
				if (this.openLineData[i].id == this.linedata[branchIndex].id) {
					this.linedata[branchIndex].coords = this.openLineData[i].coords;
					this.openLineData.splice(i, 1);
					break;
				}
			}
			// const target = this.branchToOpenBranch[branchIndex.toString()];
			// this.linedata[branchIndex] = _.cloneDeep(this.openLineData[target]);
			// if (this.openLineData.length > 1) {
			// 	this.openLineData.splice(target, 1);
			// } else {
			// 	this.openLineData = [];
			// }
			// delete this.branchToOpenBranch[branchIndex.toString()];
		},
		restore() {
			var temp = this.chart.getOption();
			temp.leaflet[0].center = [-86.0, 36.44];
			temp.leaflet[0].zoom = 8;
			this.chart.setOption(temp);
		}
	},
	created() {
		this.initUpdateLines();
	},
	mounted() {
		this.getData();
		this.initdraw('main');
		this.onDrawSub();
		this.onDrawLines();
		this.updateLinesCycle();
	},
	beforeDestroy() {
		this.chart.clear();
	},
	// watch: {
	// 	highRiskLines: function() {
	// 		console.log(this.highRiskLines);
	// 	}
	// },
	computed: {
		...mapGetters({
			ViolatedLines: 'getViolatedLines'
		})
	},
	watch: {
		ViolatedLines: function() {
			// console.log(this.$store.state.violatedLines);
			let temp = this.chart.getOption();
			temp.series[3].data = this.$store.state.violatedLines;
			this.chart.setOption(temp);
		}
	},
	components: {
		linepop: () => import('./linepop'),
		subpop: () => import('./subpop'),
		VWidget,
		MWidget,
		MiniStatistic,
		pie,
		branchTable,
		chartStatistic
	}
};
</script>

