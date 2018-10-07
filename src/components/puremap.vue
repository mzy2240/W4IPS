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
		</v-layout>
		<!-- <v-container grid-list-xs text-xs-center> -->
		<v-container grid-list-xl text-xs-center fluid>
			<v-layout row wrap>
				<!-- mini statistic start -->
        <v-flex lg3 sm6 xs12>
          <mini-statistic
            icon="fa fa-facebook"
            title="Total Generation"
            :sub-title="areaData[0]"
            color="indigo"      
          >
          </mini-statistic>  
        </v-flex>
        <v-flex lg3 sm6 xs12>
          <mini-statistic
            icon="fa fa-google"
            title="Total Load"
            :sub-title="areaData[2]"
            color="red"      
          >
          </mini-statistic>           
        </v-flex>          
        <v-flex lg3 sm6 xs12>
          <mini-statistic
            icon="fa fa-twitter"
            title="Average Frequency"
            :sub-title="areaData[8]"
            color="light-blue"      
          >
          </mini-statistic>            
        </v-flex>        
        <v-flex lg3 sm6 xs12>
          <mini-statistic
            icon="fa fa-instagram"
            title="Export Power"
            :sub-title="areaData[6]"
            color="purple"      
          >
          </mini-statistic>             
        </v-flex> 
				<v-flex lg8 sm12 xs12>
					<v-widget title="Site Map" content-bg="white">
						<!-- <v-flex d-flex xs8 style="height: auto;"> -->
						<div slot="widget-content">
							<div id="main" class="chart"></div>
						</div>
					</v-widget>
				</v-flex>
				<v-flex lg4 sm12 xs12>
					<v-layout row wrap>
						<v-flex lg12 sm12 xs12>
							<v-widget title="Tool1" content-bg="white">
								<div slot="widget-content" class='cardiv'>
									<v-card dark color="light-blue">
										<v-card-text class="px-0">Tool1</v-card-text>
									</v-card>
								</div>
							</v-widget>
						</v-flex>
						<v-flex lg12 sm12 xs12>
							<v-widget title="Tool2" content-bg="white">
								<div slot="widget-content" class='cardiv'>
									<v-card dark color="light-blue">
										<v-card-text class="px-0">Tool2</v-card-text>
									</v-card>
								</div>
							</v-widget>
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
import VWidget from '@/components/VWidget';
import MiniStatistic from '@/components/MiniStatistic';
// import _ from 'lodash';
// mapboxgl.accessToken =
// 	'pk.eyJ1IjoibXp5MjI0MCIsImEiOiJjamttc3VsODYyZmI4M2ttbGxmbzFudGM2In0.0dy22s32n9eth_63nlX1UA';

export default {
	name: 'TEST',
	data() {
		return {
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
			areaData: [],
			areaDataLength: this.$store.state.fieldstore['Area'].length
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
					center: [-86.84, 36.44],
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
							color: 'rgb(200, 40, 0)',
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
			}, 1500);
		},
		updateLines() {
			const temp = JSON.parse(this.$store.state.rawdata).Data;
			this.areaData = temp.slice(0, this.areaDataLength);
			const branchData = temp.slice(this.anchor, this.anchor + this.dataLength);
			let branchIndex;
			let statusTemp = [];
			let branchChanged = false;
			for (let i = 0; i < branchData.length; i = i + this.branchArrLength) {
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
			}
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
	// computed: {
	// 	...mapGetters({
	// 		updateBadge: 'getBadge'
	// 	})
	// },
	// watch: {
	// 	updateBadge: function() {
	// 		setTimeout(() => {
	// 			this.updateLines();
	// 		}, 1000);
	// 	}
	// },
	components: {
		linepop: () => import('./linepop'),
		subpop: () => import('./subpop'),
		VWidget,
		MiniStatistic
	}
};
</script>

