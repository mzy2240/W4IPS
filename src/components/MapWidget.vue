<template>
	<div id="v-widget">
		<v-card>
			<v-toolbar color="transparent" flat dense card v-if="enableHeader">
				<v-toolbar-title>
					<h4>{{ title }}</h4>
				</v-toolbar-title>
				<v-spacer></v-spacer>
				<slot name="widget-header-action"></slot>
				<v-btn icon @click="restore">
					<v-icon>restore</v-icon>
				</v-btn>
			</v-toolbar>
			<v-divider v-if="enableHeader"></v-divider>
			<slot name="widget-content"></slot>
			<div id="map" class="chart"></div>
		</v-card>
	</div>
</template>

<style scoped>
.chart {
	z-index: 0;
}
</style>


<script>
import echarts from 'echarts';
import 'echarts-leaflet';
import { mapGetters } from 'vuex';
import Math from 'mathjs';

export default {
	props: {
		title: {
			type: String
		},
		enableHeader: {
			type: Boolean,
			default: true
		},
		contentBg: {
			type: String,
			default: 'white'
		},
		focus: {
			type: String
		},
		height: {
			type: String,
			default: '300px'
		}
	},
	data() {
		return {
			chart: {},
			subdata: [],
			linedata: [],
			subdetail: [],
			busdetail: [],
			mapCenter: [27.4241, -98.4936],
			map: null,
			mapStyle: {
				width: '100%',
				height: this.height
			}
		};
	},
	methods: {
		initdraw() {
			let heatmapData = [];
			for (let ele in this.$store.state.transformerDict) {
				heatmapData.push([
					this.$store.state.transformerDict[ele].coords[0][0],
					this.$store.state.transformerDict[ele].coords[0][1],
					100
				]);
			}
			// console.log(this.$store.state.transformerDict)
			const url = 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
			const options = {
				// redirect: true,
				// time: '',
				// maxZoom: 8,
				// tilematrixset: 'GoogleMapsCompatible_Level',
				// format: 'jpg',
				// attribution:
				// 	'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
			};
			this.map = L.map('map', {
				// crs: L.CRS.EPSG4326,
				center: this.mapCenter, //this.$store.state.center, //this.mapCenter,
				maxZoom: 18,
				zoom: 7
			});
			L.tileLayer(url, options).addTo(this.map);
			// this.chart = echarts.init(document.getElementById('map'));
			var echartsOptions = {
				animation: false,
				tooltip: {
					show: true,
					trigger: 'item'
				},
				visualMap: {
					show: false,
					top: 'top',
					min: 50,
					max: 300,
					seriesIndex: 7,
					calculable: true,
					inRange: {
						color: ['#000080', 'blue', 'green', 'yellow', 'red']
					}
				},
				series: [
					{
						id: 'sub',
						type: 'scatter',
						name: 'sub',
						coordinateSystem: 'leaflet',
						symbol: 'circle',
						symbolSize: (value, params) => {
							if (params.data.attributes.Gen && this.focus == 'Gen') {
								return 10;
							} else if (
								params.data.attributes.Shunt &&
								this.focus == 'Shunt'
							) {
								return 10;
							} else if (this.focus == 'Load') {
								return 7;
							} else {
								return 0;
							}
						},
						// showEffectOn: 'emphasis',
						// zindex: 2,
						zlevel: 3,
						progressive: 100,
						progressiveThreshold: 200,
						data: this.$store.state.subData,
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
						progressive: 100,
						progressiveThreshold: 200,
						// symbol: ['none', 'arrow'],
						// symbolSize: 6,
						silent: false,
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
						zlevel: 3,
						data: this.$store.state.lineData
					},
					{
						id: 'vbus',
						name: 'vbus',
						type: 'scatter',
						coordinateSystem: 'leaflet',
						silent: false,
						symbol: 'pin',
						symbolSize: 50,
						zlevel: 1,
						itemStyle: {
							color: '#ff6d00'
						},
						label: {
							show: true,
							position: 'top',
							color: 'black',
							// fontWeight: 'bold',
							formatter: function(params) {
								if (params.user != undefined) {
									return params.user + ': Bus#' + params.name;
								} else {
									return 'Bus#' + params.name;
								}
							}
						},
						data: []
					},
					{
						id: 'shunt',
						name: 'shunt',
						type: 'scatter',
						coordinateSystem: 'leaflet',
						silent: false,
						symbol: 'pin',
						symbolSize: 50,
						zlevel: 2,
						itemStyle: {
							color: '#4caf50'
						},
						label: {
							show: true,
							position: 'top',
							color: 'black',
							// fontWeight: 'bold',
							formatter: function(params) {
								return 'Shunt#' + params.name;
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
						// symbol: 'pin',
						// symbolSize: 30,
						lineStyle: {
							width: 10,
							color: '#f44336',
							// type: 'dotted',
							shadowColor: '#ccff90',
							shadowBlur: 20,
							opacity: 0.5
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
					},
					{
						id: 'gen',
						name: 'gen',
						type: 'scatter',
						coordinateSystem: 'leaflet',
						silent: false,
						symbol: 'pin',
						symbolSize: 50,
						zlevel: 2,
						itemStyle: {
							color: '#1565c0'
						},
						label: {
							show: true,
							position: 'top',
							color: 'black',
							// fontWeight: 'bold',
							formatter: function(params) {
								return 'Gen#' + params.name;
							}
						},
						data: []
					},
					{
						id: 'load',
						name: 'load',
						type: 'scatter',
						coordinateSystem: 'leaflet',
						silent: false,
						symbol: 'pin',
						symbolSize: 50,
						zlevel: 2,
						itemStyle: {
							color: '#303f9f'
						},
						label: {
							show: true,
							position: 'top',
							color: 'black',
							// fontWeight: 'bold',
							formatter: function(params) {
								return 'Gen#' + params.name;
							}
						},
						data: []
					},
					{
						id: 'heatmap',
						type: 'heatmap',
						coordinateSystem: 'leaflet',
						data: [], //heatmapData, //[[-98.4, 27.6, 5]],
						pointSize: 10,
						blurSize: 20
					}
				]
			};
			var layerOptions = {
				loadWhileAnimating: false,
				attribution: ''
			};
			this.chart = L.supermap.echartsLayer(echartsOptions, layerOptions); // _ec is the echartsInstance
			var EL = this.chart.addTo(this.map);

			// var ramdompts_ipl = turf.randomPoint(25, {
			// 	bbox: [-98, 28.0, -94, 31.0]
			// });

			// turf.featureEach(ramdompts_ipl, function(point) {
			// 	point.properties.obs = Math.random() * 25;
			// });
			// // var tin = turf.tin(ramdompts_ipl, 'obs');
			// var contours_pts = turf.interpolate(ramdompts_ipl, 2, {
			// 	gridType: 'points',
			// 	property: 'obs',
			// 	units: 'kilometers'
			// });
			// var contours = turf.isobands(contours_pts, [0, 5, 10, 15, 20, 25, 30], {
			// 	zProperty: 'obs'
			// });
			// function getColor(x) {
			// 	return x < 5
			// 		? '#bd0026'
			// 		: x < 10
			// 		? '#f03b20'
			// 		: x < 15
			// 		? '#fd8d3c'
			// 		: x < 20
			// 		? '#fecc5c'
			// 		: '#ffffb2';
			// }
			// var contoursLayer = L.geoJson(contours, {
			// 	// onEachFeature: function(feature, layer) {
			// 	// 	layer.bindPopup(feature.properties.obs);
			// 	// },
			// 	style: function(feature) {
			// 		return {
			// 			interactive: false,
			// 			fillColor: getColor(parseInt(feature.properties.obs.split('-')[0])),
			// 			weight: 0.5,
			// 			color: '#bd0026',
			// 			opacity: 1
			// 		};
			// 	}
			// }).addTo(this.map);
			// console.log(tin);
			// var ecModel = this.chart._model;
			// var leafletMap;
			// ecModel.eachComponent('leaflet', function(leafletModel) {
			// 	if (leafletMap == null) {
			// 		// console.log(leafletModel)
			// 		leafletMap = leafletModel.__map;
			// 	}
			// });
			// leafletMap.zoomControl.remove();
		},
		getData() {
			const temp = this.$store.state.casedetail;
			if (temp.content.type == 'dsmDictionary') {
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
			}
		},
		onDrawSub() {
			this.chart.setOption({
				series: [
					{
						id: 'sub',
						data: this.$store.state.subData
					}
				]
			});
		},
		onDrawLines() {
			this.chart.setOption({
				series: [
					{
						id: 'lines',
						data: this.$store.state.lineData
					}
				]
			});
		},
		onDrawTransformers() {
			console.log(this.$store.state.areaDetail);
			this.chart.setOption({
				series: [
					{
						id: 'heatmap',
						data: []
					}
				]
			});
		},
		restore() {
			this.map.flyTo(this.mapCenter, 6, {
				animate: true,
				duration: 1.5
			});
		}
	},
	mounted() {
		this.initdraw();
		// this.onDrawTransformers();
		// this.getData();
		// this.onDrawSub();
		// this.onDrawLines();
	},
	beforeDestroy() {
		try {
			this.chart.clear();
		} catch (err) {
			console.log('The chart instance cannot be cleared');
		}
	},
	computed: {
		...mapGetters({
			ViolatedBuses: 'getViolatedBuses',
			SelectedShunts: 'getSelectedShunts',
			ViolatedLines: 'getViolatedLines',
			SelectedGens: 'getSelectedGens',
			SelectedLoads: 'getSelectedLoads'
		})
	},
	watch: {
		ViolatedBuses: function() {
			let temp = this.chart._echartsOptions;
			temp.series[2].data = this.$store.state.violatedBuses;
			this.chart.setOption(temp);
			// this.chart.setOption({series: [{
			// 	id: 'vbus',
			// 	name: 'vbus',
			// 	data: this.$store.state.violatedBuses
			// }]})
		},
		SelectedShunts: function() {
			// this.chart.setOption({series: [{
			// 	id: 'shunt',
			// 	name: 'shunt',
			// 	data: this.$store.state.selectedShunts
			// }]})
			let temp = this.chart._echartsOptions;
			temp.series[3].data = this.$store.state.selectedShunts;
			this.chart.setOption(temp);
		},
		ViolatedLines: function() {
			// console.log(this.$store.state.violatedLines);
			let temp = this.chart._echartsOptions;
			temp.series[4].data = this.$store.state.violatedLines;
			this.chart.setOption(temp);
		},
		SelectedGens: function() {
			let temp = this.chart._echartsOptions;
			temp.series[5].data = this.$store.state.selectedGens;
			this.chart.setOption(temp);
		},
		SelectedLoads: function() {
			let temp = this.chart._echartsOptions;
			temp.series[6].data = this.$store.state.selectedLoads;
			this.chart.setOption(temp);
		}
	}
};
</script>
