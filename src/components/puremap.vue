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
					<mini-statistic :name="'GenMW'" icon="fa fa-facebook" title="Total Generation (MW)" :sub-title="$store.state.areaData[0]" color="indigo" :img="require('../assets/icons8-factory-64.png')" id="step5">
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
				<v-flex lg8 sm8 xs12>
					<m-widget title="Interactive Site Map" content-bg="white" @clicked="restore">
						<!-- <v-flex d-flex xs8 style="height: auto;"> -->
						<div slot="widget-content">
							<div id="main" class="chart"></div>
						</div>
					</m-widget>
				</v-flex>
				<v-flex lg4 sm4 xs12>
					<v-layout row wrap>
						<!-- <v-flex lg12 sm12 xs12>
							<chartStatistic id="TC" min="dataMin" max="dataMax" title="Total Cost" icon="attach_money" card-color="indigo" :chart-color="[color.indigo.lighten1]" :costData='$store.state.totalCost.toFixed(2)' type="line"></chartStatistic>
						</v-flex>
						<v-flex lg12 sm12 xs12>
							<v-widget title="Area Generation Overview" content-bg="white">
								<div slot="widget-content">
									<pie :areatotal="$store.state.areaData[0]"></pie>
								</div>
							</v-widget>
						</v-flex> -->
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
// import echarts from 'echarts';
// import 'echarts-gl/dist/echarts-gl';
// import 'echarts-leaflet';
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
// import L from 'leaflet';
// import {tiledMapLayer} from '@supermap/iclient-leaflet';
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
			formatRiskLines: [],
			mapCenter: [29.4241, -98.4936],
			Interval: null,
			map: null
		};
	},
	methods: {
		initdraw(id) {
			const url = 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
			const options = {
				// redirect: true,
				// time: '',
				// maxZoom: 8,
				// tilematrixset: 'GoogleMapsCompatible_Level',
				// format: 'jpg',
				attribution:
					'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
			};
			this.map = L.map('main', {
				// crs: L.CRS.EPSG4326,
				center: this.mapCenter, //this.$store.state.center, //this.mapCenter,
				maxZoom: 18,
				zoom: 8
			});
			L.tileLayer(url, options).addTo(this.map);
			// L.supermap.tiledMapLayer(url, option).addTo(map);
			var option = {
				series: [
					{
						id: 'sub',
						type: 'effectScatter',
						name: 'sub',
						coordinateSystem: 'leaflet',
						// coordinateSystem: 'bmap',
						symbol: 'circle',
						symbolSize: function(value, params) {
							if (params.data.attributes.Gen) {
								return 12;
							} else if (params.data.attributes.Shunt) {
								return 10;
							} else {
								return 8;
							}
						},
						showEffectOn: 'emphasis',
						zlevel: 5,
						// progressive: 40,
						// progressiveThreshold: 200,
						// zindex: 2,
						data: [],
						tooltip: {
							confine: true,
							formatter: function(params) {
								return 'Substation: ' + params.name;
							}
						},
						itemStyle: {
							color: function(params) {
								if (
									params.data.attributes.Gen &&
									params.data.attributes.Shunt
								) {
									console.log('wow you are lucky!')
									return {
										type: 'radial',
										x: 0.5,
										y: 0.5,
										r: 0.5,
										colorStops: [
											{
												offset: 0,
												color: '#ff5722'
											},
											{
												offset: 1,
												color: '#8d6e63'
											}
										],
										globalCoord: false
									};
								} else if (params.data.attributes.Gen) {
									return '#ff5722'
								} else if (params.data.attributes.Shunt) {
									return '#8d6e63'
								} else {
									return '#283593';
								}
							}
						}
					},
					{
						id: 'lines',
						name: 'lines',
						type: 'lines',
						coordinateSystem: 'leaflet',
						animation: false,
						// progressive: 100,
						// progressiveThreshold: 200,
						symbol: ['none', 'arrow'],
						symbolSize: 10,
						zlevel: 1,
						// coordinateSystem: 'bmap',
						silent: false,
						// effect: {
						// 	show: true,
						// 	constantSpeed: 20,
						// 	symbol: 'arrow',
						// 	symbolSize: 7,
						// 	trailWidth: 2,
						// 	trailLength: 0,
						// 	trailOpacity: 1,
						// 	spotIntensity: 10
						// },
						label: {
							normal: {
								show: true,
								position: 'middle',
								// formatter: 'YES',
								formatter: params => {
									const limit = params.data.attributes.MVALimit;
									const value = params.data.attributes.MVA;
									const percentage = ((value * 100) / limit).toFixed(0);
									var richText;
									if (percentage >= 100) {
										richText = '{overload|' + percentage.toString() + '%}';
									} else if (percentage >= 90) {
										if (this.map.getZoom() >= 10) {
											richText =
												'{zoomInDanger|' + percentage.toString() + '%}';
										} else {
											richText = '{indanger|' + percentage.toString() + '%}';
										}
									} else {
										if (this.map.getZoom() >= 10) {
											richText = '{zoomInSafe|' + percentage.toString() + '%}';
										} else {
											richText = '{safe|' + percentage.toString() + '%}';
										}
									}
									return richText;
								},
								rich: {
									overload: {
										fontSize: 18,
										color: '#ba000d'
									},
									indanger: {
										fontSize: 15,
										color: '#ffd600'
									},
									safe: {
										fontSize: 8,
										color: '#1b5e20'
									},
									zoomInSafe: {
										fontSize: 16,
										color: '#1b5e20'
									},
									zoomInDanger: {
										fontSize: 16,
										color: '#ffd600'
									}
								}
							}
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
									case 115:
										temp = '#1565c0';
										break;
									case 13.8:
										temp = '#7c4dff';
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
						zlevel: 1,
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
						silent: true,
						zlevel: 2,
						z: 2,
						// symbol: 'pin',
						// symbolSize: 30,
						lineStyle: {
							width: 10,
							color: '#f44336',
							// type: 'dotted',
							shadowColor: '#ffcdd2',
							shadowBlur: 20,
							opacity: 0.5
						},
						label: {
							show: false,
							position: 'middle',
							color: 'black',
							// fontWeight: 'bold',
							formatter: function(params) {
								return 'Branch#' + params.name;
							}
						},
						data: []
					},
					{
						id: 'otherSub',
						type: 'scatter',
						coordinateSystem: 'leaflet',
						silent: true,
						large: true,
						largeThreshold: 1,
						blendMode: 'lighter',
						// progressive: 100,
						// progressiveThreshold: 500,
						symbolSize: 5,
						itemStyle: {
							color: '#616161'
						},
						data: this.$store.state.otherArea.Substation
					},
					{
						id: 'otherBranch',
						type: 'lines',
						coordinateSystem: 'leaflet',
						silent: true,
						large: true,
						largeThreshold: 1,
						blendMode: 'lighter',
						// progressive: 100,
						// progressiveThreshold: 500,
						// zindex: 5,
						lineStyle: {
							color: '#757575'
						},
						data: this.$store.state.otherArea.Branch
					}
				]
			};
			this.chart = L.supermap.echartsLayer(option); // _ec is the echartsInstance
			var EL = this.chart.addTo(this.map);
			// this.chart = echarts.init(document.getElementById(id));
			// this.chart.setOption({
			// 	animation: false,
			// 	tooltip: {
			// 		show: true,
			// 		trigger: 'item'
			// 	},
			// 	// BMAP
			// 	// bmap: {
			// 	// 	center: [-86.84, 36.44],
			// 	// 	zoom: 8,
			// 	// 	roam: true,
			// 	// 	mapStyle: {
			// 	// 		// style: 'grayscale',
			// 	// 		styleJson: [
			// 	// 			{
			// 	// 				featureType: 'administrative',
			// 	// 				elementType: 'all',
			// 	// 				stylers: {
			// 	// 					color: '#ffffff',
			// 	// 					visibility: 'off'
			// 	// 				}
			// 	// 			},
			// 	// 			{
			// 	// 				featureType: 'boundary',
			// 	// 				elementType: 'all',
			// 	// 				stylers: {
			// 	// 					color: '#fefefe'
			// 	// 				}
			// 	// 			}
			// 	// 		]
			// 	// 	}
			// 	// },
			// 	// Leaflet
			// 	leaflet: {
			// 		center: this.$store.state.center, //this.mapCenter,
			// 		zoom: 7,
			// 		roam: true,
			// 		tiles: [
			// 			{
			// 				label: 'OpenStreetMap',
			// 				urlTemplate:
			// 					//'https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}',
			// 					//'https://{s}.tile.thunderforest.com/spinal-map/{z}/{x}/{y}.png',
			// 					'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
			// 				options: {
			// 					time: '',
			// 					// maxZoom: 8,
			// 					// tilematrixset: 'GoogleMapsCompatible_Level',
			// 					// format: 'jpg',
			// 					attribution:
			// 						'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
			// 				}
			// 			}
			// 		]
			// 	},
			// 	// mapbox: {
			// 	//   center: [-86.84, 36.44],
			// 	//   zoom: 6.5,
			// 	//   // pitch: 50,
			// 	//   // bearing: -50,
			// 	//   altitudeScale: 100000000,
			// 	//   silent: true,
			// 	//   style: "mapbox://styles/mapbox/dark-v9",
			// 	//   postEffect: {
			// 	//     enable: true,
			// 	//     FXAA: {
			// 	//       enable: true
			// 	//     }
			// 	//   },
			// 	//   light: {
			// 	//     main: {
			// 	//       intensity: 1,
			// 	//       shadow: true,
			// 	//       shadowQuality: "high"
			// 	//     },
			// 	//     ambient: {
			// 	//       intensity: 0
			// 	//     }
			// 	//   }
			// 	// },
			// 	series: [
			// 		{
			// 			id: 'sub',
			// 			type: 'effectScatter',
			// 			name: 'sub',
			// 			coordinateSystem: 'leaflet',
			// 			// coordinateSystem: 'bmap',
			// 			symbol: 'circle',
			// 			symbolSize: 8,
			// 			showEffectOn: 'emphasis',
			// 			progressive: 40,
			// 			progressiveThreshold: 200,
			// 			// zindex: 2,
			// 			data: [],
			// 			tooltip: {
			// 				confine: true,
			// 				formatter: function(params) {
			// 					return 'Substation: ' + params.name;
			// 				}
			// 			},
			// 			itemStyle: {
			// 				color: 'rgb(200, 40, 0)'
			// 			}
			// 		},
			// 		{
			// 			id: 'lines',
			// 			name: 'lines',
			// 			type: 'lines',
			// 			coordinateSystem: 'leaflet',
			// 			animation: false,
			// 			progressive: 100,
			// 			progressiveThreshold: 200,
			// 			zlevel: 1,
			// 			// coordinateSystem: 'bmap',
			// 			silent: false,
			// 			// effect: {
			// 			// 	show: true,
			// 			// 	constantSpeed: 20,
			// 			// 	symbol: 'arrow',
			// 			// 	symbolSize: 7,
			// 			// 	trailWidth: 2,
			// 			// 	trailLength: 0,
			// 			// 	trailOpacity: 1,
			// 			// 	spotIntensity: 10
			// 			// },
			// 			label: {
			// 				normal: {
			// 					show: true,
			// 					position: 'middle',
			// 					// formatter: 'YES',
			// 					formatter: function(params) {
			// 						const limit = params.data.attributes.MVALimit;
			// 						const value = params.data.attributes.MVA;
			// 						const percentage = ((value * 100) / limit).toFixed(0);
			// 						var richText;
			// 						if (percentage >= 100) {
			// 							richText = '{overload|' + percentage.toString() + '%}';
			// 						} else if (percentage >= 90) {
			// 							richText = '{indanger|' + percentage.toString() + '%}';
			// 						} else {
			// 							richText = '{safe|' + percentage.toString() + '%}';
			// 						}
			// 						return richText;
			// 					},
			// 					rich: {
			// 						overload: {
			// 							fontSize: 18,
			// 							color: '#ba000d'
			// 						},
			// 						indanger: {
			// 							fontSize: 15,
			// 							color: '#ffd600'
			// 						},
			// 						safe: {
			// 							fontSize: 8,
			// 							color: '#1b5e20'
			// 						}
			// 					}
			// 				}
			// 			},
			// 			// blendMode: 'lighter',
			// 			// polyline: true,
			// 			lineStyle: {
			// 				width: 1,
			// 				// color: 'rgb(200, 40, 0)',
			// 				color: function(params) {
			// 					let temp;
			// 					// console.log(params.data.attributes.volt)
			// 					switch (params.data.attributes.volt) {
			// 						case 230:
			// 							temp = '#3949ab';
			// 							break;
			// 						case 500:
			// 							temp = '#e53935';
			// 							break;
			// 						case 115:
			// 							temp = '#40c4ff';
			// 							break;
			// 						case 13.8:
			// 							temp = '#7c4dff';
			// 							break;
			// 					}
			// 					// console.log(params.data.attributes.volt);
			// 					return temp;
			// 				},
			// 				opacity: 1
			// 			},
			// 			tooltip: {
			// 				// position: [10, 10],
			// 				confine: true,
			// 				formatter: function(params) {
			// 					return 'Branch: ' + params.name;
			// 				}
			// 			},
			// 			emphasis: {
			// 				lineStyle: {
			// 					width: 2,
			// 					shadowColor: 'rgba(144, 144, 255, 0.5)',
			// 					shadowBlur: 10
			// 				}
			// 			},
			// 			data: []
			// 		},
			// 		{
			// 			id: 'openLines',
			// 			name: 'openLines',
			// 			type: 'lines',
			// 			coordinateSystem: 'leaflet',
			// 			zlevel: 1,
			// 			// coordinateSystem: 'bmap',
			// 			silent: false,
			// 			// blendMode: 'lighter',
			// 			// polyline: true,
			// 			lineStyle: {
			// 				width: 1,
			// 				color: 'rgb(200, 40, 0)',
			// 				type: 'dashed',
			// 				opacity: 1
			// 			},
			// 			tooltip: {
			// 				formatter: function(params) {
			// 					return 'Branch: ' + params.name;
			// 				}
			// 			},
			// 			emphasis: {
			// 				lineStyle: {
			// 					width: 2,
			// 					shadowColor: 'rgba(144, 144, 255, 0.5)',
			// 					shadowBlur: 10
			// 				}
			// 			},
			// 			data: []
			// 		},
			// 		{
			// 			id: 'violatedLines',
			// 			name: 'violatedLines',
			// 			type: 'lines',
			// 			coordinateSystem: 'leaflet',
			// 			silent: false,
			// 			zlevel: 2,
			// 			z: 2,
			// 			symbol: 'pin',
			// 			symbolSize: 30,
			// 			lineStyle: {
			// 				width: 10,
			// 				color: '#bef67a',
			// 				// type: 'dotted',
			// 				shadowColor: '#ccff90',
			// 				shadowBlur: 20,
			// 				opacity: 1
			// 			},
			// 			label: {
			// 				show: true,
			// 				position: 'middle',
			// 				color: 'black',
			// 				// fontWeight: 'bold',
			// 				formatter: function(params) {
			// 					return 'Branch#' + params.name;
			// 				}
			// 			},
			// 			data: []
			// 		},
			// 		{
			// 			id: 'otherSub',
			// 			type: 'scatter',
			// 			coordinateSystem: 'leaflet',
			// 			silent: true,
			// 			large: true,
			// 			largeThreshold: 1,
			// 			blendMode: 'lighter',
			// 			progressive: 100,
			// 			progressiveThreshold: 500,
			// 			symbolSize: 5,
			// 			itemStyle: {
			// 				color: '#616161'
			// 			},
			// 			data: this.$store.state.otherArea.Substation
			// 		},
			// 		{
			// 			id: 'otherBranch',
			// 			type: 'lines',
			// 			coordinateSystem: 'leaflet',
			// 			silent: true,
			// 			large: true,
			// 			largeThreshold: 1,
			// 			blendMode: 'lighter',
			// 			progressive: 100,
			// 			progressiveThreshold: 500,
			// 			// zindex: 5,
			// 			lineStyle: {
			// 				color: '#757575'
			// 			},
			// 			data: this.$store.state.otherArea.Branch
			// 		}
			// 	]
			// });
		},
		getData() {
			this.subdata = this.$store.state.subData;
			this.linedata = _.cloneDeep(this.$store.state.lineData);
			this.subdetail = this.$store.state.subDetail;
		},
		onDrawSub() {
			// console.log(L.supermap.echartsLayer);
			// console.log(this.chart)
			let temp = this.chart._echartsOptions;
			temp.series[0].data = this.subdata;
			temp.series[1].data = this.linedata;
			this.chart.setOption(temp);
			// console.log(temp);
			// this.chart.setOption({
			// 	series: [
			// 		{
			// 			id: 'sub',
			// 			data: this.subdata
			// 		}
			// 	]
			// });
			// this.chart.setOption({
			// 	series: [
			// 		{
			// 			id: 'sub',
			// 			data: this.subdata
			// 		}
			// 	]
			// });
			var self = this;
			// this.map.events.on({
			// 	"click": function(params) {
			// 		console.log(params);
			// 	}
			// })
			this.chart._ec.on('click', function(params) {
				// console.log(params);
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
			this.anchor = this.$store.state.areaHelper.Branch.anchor;
			this.branchArrLength = this.$store.state.areaHelper.Branch.length;
			this.dataLength =
				Object.keys(this.$store.state.areadetail.content['Branch']).length *
				this.branchArrLength;
			this.statusArray = Array(
				this.$store.state.areaHelper.Branch.list.length
			).fill(1);
		},
		updateLinesCycle: function() {
			// setTimeout(() => {
			// 	this.updateLines();
			// }, 1000);
			this.Interval = setInterval(() => {
				// this.updateLines();
				if (this.$store.state.status === 'running') {
					this.updateLines();
				}
				// console.log(this.$store.state.totalCost);
			}, 1500);
		},
		updateLines() {
			// const temp = this.$store.state.parsedData;
			// const branchData = temp.slice(this.anchor, this.anchor + this.dataLength);
			const branchData = this.$store.state.branchData;
			// let branchIndex;
			let statusTemp = [];
			let branchChanged = false;
			let i = 0;
			const branchArray = this.$store.state.areaHelper.Branch.list;
			const branchArrLength = this.$store.state.areaHelper.Branch.length;
			var key;
			let fromID, toID, coords;
			for (let index in this.linedata) {
				// statusTemp.push(branchData[i]);
				statusTemp.push(branchData[index * branchArrLength]);
				this.linedata[index].attributes.MVA =
					branchData[index * branchArrLength + 3];
				// branchIndex = i / this.branchArrLength;
				fromID = this.linedata[index].id.split(',')[0];
				toID = this.linedata[index].id.split(',')[1];
				if(this.linedata[index].attributes.MVA>=0){
					this.linedata[index].coords = [
						[
							this.$store.state.casedetail.content.Substation[
								this.$store.state.casedetail.content.Bus[fromID]['Int.Sub Number'].toString()
							]['Double.Longitude'],
							this.$store.state.casedetail.content.Substation[
								this.$store.state.casedetail.content.Bus[fromID]['Int.Sub Number'].toString()
							]['Double.Latitude']
						],
						[
							this.$store.state.casedetail.content.Substation[
								this.$store.state.casedetail.content.Bus[toID]['Int.Sub Number'].toString()
							]['Double.Longitude'],
							this.$store.state.casedetail.content.Substation[
								this.$store.state.casedetail.content.Bus[toID]['Int.Sub Number'].toString()
							]['Double.Latitude']
						]
					];
				} else {
					this.linedata[index].coords = [
						[
							this.$store.state.casedetail.content.Substation[
								this.$store.state.casedetail.content.Bus[toID]['Int.Sub Number'].toString()
							]['Double.Longitude'],
							this.$store.state.casedetail.content.Substation[
								this.$store.state.casedetail.content.Bus[toID]['Int.Sub Number'].toString()
							]['Double.Latitude']
						],
						[
							this.$store.state.casedetail.content.Substation[
								this.$store.state.casedetail.content.Bus[fromID]['Int.Sub Number'].toString()
							]['Double.Longitude'],
							this.$store.state.casedetail.content.Substation[
								this.$store.state.casedetail.content.Bus[fromID]['Int.Sub Number'].toString()
							]['Double.Latitude']
						]
					];

				}
				// if ([0, 2, 3].includes(branchData[index * branchArrLength]))
				// {
				if (
					this.statusArray[index] == 1 &&
					[0, 2, 3].includes(branchData[index * branchArrLength])
				) {
					// Branch opened
					this.updateLineOpen(index);
					branchChanged = true;
					// } else if (branchData[index * branchArrLength] == 1) {
				} else if (
					[0, 2, 3].includes(this.statusArray[index]) &&
					branchData[index * branchArrLength] == 1
				) {
					// Branch closed
					this.updateLineClose(index);
					branchChanged = true;
				}
				key = this.linedata[index].id;
				// console.log(key);
				if (
					branchData[index * branchArrLength + 3] >=
					0.85 * this.linedata[index].attributes.MVALimit
				) {
					// this.highRiskLines[key] = val;
					this.highRiskLines[key] = {};
					this.highRiskLines[key]['name'] = key;
					this.highRiskLines[key]['MVA'] =
						branchData[index * branchArrLength + 3];
					this.highRiskLines[key]['Ratio'] = (
						(branchData[index * branchArrLength + 3] /
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
				i += this.branchArrLength;
			}
			this.formatRiskLines = Object.values(this.highRiskLines);
			// console.log(this.chart.getOption().series[1].data);
			// console.log(this.linedata);
			// if (this.chart.getOption().series[1].data != this.linedata) {
			//branchChanged
			// console.log("TEST")
			let tempOption = this.chart._echartsOptions;
			tempOption.series[1].data = this.linedata;
			tempOption.series[2].data = this.openLineData;
			// console.log(tempOption)
			this.chart.setOption(tempOption);
			// this.chart.setOption(
			// 	{
			// 		series: [
			// 			{
			// 				id: 'lines',
			// 				data: this.linedata
			// 			},
			// 			{
			// 				id: 'openLines',
			// 				type: 'lines',
			// 				data: this.openLineData
			// 			}
			// 		]
			// 	},
			// 	false
			// );
			this.statusArray = statusTemp;
			// }
		},
		updateLineOpen(branchIndex) {
			const temp = _.cloneDeep(this.linedata[branchIndex]);
			// this.branchToOpenBranch[
			// 	branchIndex.toString()
			// ] = this.openLineData.length;
			this.openLineData.push(temp);
			// console.log(this.openLineData);
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
			var temp = this.chart._echartsOptions;
			temp.leaflet[0].center = this.mapCenter;
			temp.leaflet[0].zoom = 8;
			this.chart.setOption(temp);
		}
	},
	created() {},
	mounted() {
		this.initUpdateLines();
		this.getData();
		this.initdraw('main');
		this.onDrawSub();
		// // this.onDrawLines();
		// this.updateLines();
		this.updateLinesCycle();
		if (this.$store.state.showTour) {
			var intro = introJs();
			intro.setOptions({
				showStepNumbers: false,
				// overlayOpacity: 0.1,
				steps: [
					{
						intro: 'Welcome to the final lab! For better performance, please use Chrome or Firefox.'
					}
				]
			});
			this.$store.commit('disableTour');
			intro.start();
		}
	},
	beforeDestroy() {
		clearInterval(this.Interval);
		try {
			this.chart.clear();
		} catch (err) {
			console.log('The chart instance cannot be cleared');
		}
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
			let temp = this.chart._echartsOptions;
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

