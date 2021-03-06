<template>
	<div id="v-widget">
		<v-card>
			<v-toolbar color="transparent" flat dense card v-if="enableHeader">
				<v-toolbar-title>
					<h4>{{title}}</h4>
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
	height: 300px;
	width: 100%;
}
</style>


<script>
import echarts from 'echarts';
import 'echarts-leaflet';
import { mapGetters } from 'vuex';

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
		}
	},
	data() {
		return {
			chart: {},
			subdata: [],
			linedata: [],
			subdetail: [],
			busdetail: []
		};
	},
	methods: {
		initdraw() {
			this.chart = echarts.init(document.getElementById('map'));
			this.chart.setOption({
				animation: false,
				tooltip: {
					show: true,
					trigger: 'item'
				},
				leaflet: {
					center: [-86.0, 36.44],
					zoom: 6,
					roam: true,
					tiles: [
						{
							label: 'OpenStreetMap',
							urlTemplate:
								'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
							options: {
								attribution:
									'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
							}
						}
					]
				},
				series: [
					{
						id: 'sub',
						type: 'scatter',
						name: 'sub',
						coordinateSystem: 'leaflet',
						symbol: 'circle',
						symbolSize: 7,
						// showEffectOn: 'emphasis',
						// zindex: 2,
						zlevel: 3,
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
						data: []
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
								return 'Bus#' + params.name;
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
					}
				]
			});
			var ecModel = this.chart._model;
			var leafletMap;
			ecModel.eachComponent('leaflet', function(leafletModel) {
				if (leafletMap == null) {
					// console.log(leafletModel)
					leafletMap = leafletModel.__map;
				}
			});
			leafletMap.zoomControl.remove();
		},
		getData() {
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
		restore() {
			var temp = this.chart.getOption();
			temp.leaflet[0].center = [-86.0, 36.44];
			temp.leaflet[0].zoom = 6;
			this.chart.setOption(temp);
		}
	},
	mounted() {
		this.initdraw();
		this.getData();
		this.onDrawSub();
		this.onDrawLines();
	},
	beforeDestroy(){
		this.chart.clear();
	},
	computed: {
		...mapGetters({
			ViolatedBuses: 'getViolatedBuses',
			SelectedShunts: 'getSelectedShunts',
			ViolatedLines: 'getViolatedLines',
			SelectedGens: 'getSelectedGens'
		})
	},
	watch: {
		ViolatedBuses: function() {
			let temp = this.chart.getOption();
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
			let temp = this.chart.getOption();
			temp.series[3].data = this.$store.state.selectedShunts;
			this.chart.setOption(temp);
		},
		ViolatedLines: function() {
			// console.log(this.$store.state.violatedLines);
			let temp = this.chart.getOption();
			temp.series[4].data = this.$store.state.violatedLines;
			this.chart.setOption(temp);
		},
		SelectedGens: function() {
			let temp = this.chart.getOption();
			temp.series[5].data = this.$store.state.selectedGens;
			this.chart.setOption(temp);
		}
	}
};
</script>
