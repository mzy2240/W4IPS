<template>
  <div id="chart" class="loadChart" pa-0 ma-0></div>
</template>

<script>
import echarts from 'echarts';

export default {
	props: {},
	data() {
		return {
			chart: null,
			data: null,
			formatData: [],
			date0: [],
			date1: [],
			Interval: null,
			busList: [
				4195,
				4196,
				4181,
				4183,
				4192,
				4151,
				4146,
				4140,
				4080,
				4073,
				4070,
				4056,
				4041,
				4004
			],
			indexList: [],
			anchor: null,
			busDataLength: null,
			vpuIndex: this.$store.state.fieldstore['Bus'].findIndex(
				x => x.text === 'Vpu'
			),
			source: [[], [], [], [], [], [], [], [], [], [], [], [], [], []]
		};
	},
	methods: {
		prepocess() {
			const keyList = Object.keys(this.$store.state.areadetail.content.Bus);
			this.indexList = this.busList.map(x => keyList.indexOf(x.toString()));
			// console.log(indexList)
			let anchor = 0;
			var arrlength;
			var keyarr;

			for (let ele in this.$store.state.fieldstore) {
				arrlength = this.$store.state.fieldstore[ele].length;
				keyarr = Object.keys(this.$store.state.areadetail.content[ele]);
				if (ele != 'Bus') {
					anchor += arrlength * keyarr.length;
				} else {
					break;
				}
			}
			this.anchor = anchor;
			this.busDataLength = arrlength;
		},
		initChart() {
			let chart = echarts.init(document.getElementById('chart'), 'dark', {
				renderer: 'canvas'
			});
			// let chart = echarts.init(document.getElementById('chart'), 'dark', {renderer: 'svg'});
			chart.setOption({
				animation: false,
				xAxis: {
					// show: false,
					type: 'category',
                    data: [...Array(121).keys()],
                    axisLabel:{
                        interval: 9,
                        showMaxLabel: true,
                        formatter: (value)=>{
                            return value/2 | 0
                        }
                    }
				},
				yAxis: {
					type: 'value',
					min: 0.92,
					max: 1.1
                },
                grid: { top: '5%', left: '12%', bottom: '10%', right: '5%' },
				series: [
					{
						id: '4195',
						type: 'line',
						smooth: false,
						showSymbol: false,
						hoverAnimation: false,
						// sampling: 'average',
						silent: true,
						data: this.source[0]
					},
					{
						id: '4196',
						type: 'line',
						smooth: false,
						showSymbol: false,
						hoverAnimation: false,
						// sampling: 'average',
						silent: true,
						data: this.source[1]
					},
					{
						id: '4181',
						type: 'line',
						smooth: false,
						showSymbol: false,
						hoverAnimation: false,
						// sampling: 'average',
						silent: true,
						data: this.source[2]
					},
					{
						id: '4183',
						type: 'line',
						smooth: false,
						showSymbol: false,
						hoverAnimation: false,
						// sampling: 'average',
						silent: true,
						data: this.source[3]
					},
					{
						id: '4192',
						type: 'line',
						smooth: false,
						showSymbol: false,
						hoverAnimation: false,
						// sampling: 'average',
						silent: true,
						data: this.source[4]
					},
					{
						id: '4151',
						type: 'line',
						smooth: false,
						showSymbol: false,
						hoverAnimation: false,
						// sampling: 'average',
						silent: true,
						data: this.source[5]
					},
					{
						id: '4146',
						type: 'line',
						smooth: false,
						showSymbol: false,
						hoverAnimation: false,
						// sampling: 'average',
						silent: true,
						data: this.source[6]
					},
					{
						id: '4140',
						type: 'line',
						smooth: false,
						showSymbol: false,
						hoverAnimation: false,
						// sampling: 'average',
						silent: true,
						data: this.source[7]
					},
					{
						id: '4180',
						type: 'line',
						smooth: false,
						showSymbol: false,
						hoverAnimation: false,
						// sampling: 'average',
						silent: true,
						data: this.source[8]
					},
					{
						id: '4173',
						type: 'line',
						smooth: false,
						showSymbol: false,
						hoverAnimation: false,
						// sampling: 'average',
						silent: true,
						data: this.source[9]
					},
					{
						id: '4170',
						type: 'line',
						smooth: false,
						showSymbol: false,
						hoverAnimation: false,
						// sampling: 'average',
						silent: true,
						data: this.source[10]
					},
					{
						id: '4156',
						type: 'line',
						smooth: false,
						showSymbol: false,
						hoverAnimation: false,
						// sampling: 'average',
						silent: true,
						data: this.source[11]
					},
					{
						id: '4141',
						type: 'line',
						smooth: false,
						showSymbol: false,
						hoverAnimation: false,
						// sampling: 'average',
						silent: true,
						data: this.source[12]
					},
					{
						id: '4104',
						type: 'line',
						smooth: false,
						showSymbol: false,
						hoverAnimation: false,
						// sampling: 'average',
						silent: true,
						data: this.source[13]
					}
				]
			});
		},
		updateChart() {
			// var t0 = performance.now();
			if (this.$store.state.status === 'running') {
				const temp = this.$store.state.parsedData;
				if (this.source[0].length == 120) {
					this.source = [
						[],
						[],
						[],
						[],
						[],
						[],
						[],
						[],
						[],
						[],
						[],
						[],
						[],
						[]
					];
				}
				for (let i in this.busList) {
					// if (
					// 	this.source[i] === undefined ||
					// 	this.source[i].length == 0
					// ) {
					// 	this.source[i] = [];
					// }
					this.source[i].push(
						temp[
							this.anchor +
								this.vpuIndex +
								this.indexList[i] * this.busDataLength
						]
					);
				}
				// var t1 = performance.now();
				// console.log(t1 - t0);
				let chart = echarts.getInstanceByDom(document.getElementById('chart'));
				// console.log(this.source[1])
				chart.setOption({
					series: [
						{
							id: '4195',
							data: this.source[0]
						},
						{
							id: '4196',
							data: this.source[1]
						},
						{
							id: '4181',
							data: this.source[2]
						},
						{
							id: '4183',
							data: this.source[3]
						},
						{
							id: '4192',
							data: this.source[4]
						},
						{
							id: '4151',
							data: this.source[5]
						},
						{
							id: '4146',
							data: this.source[6]
						},
						{
							id: '4140',
							data: this.source[7]
						},
						{
							id: '4180',
							data: this.source[8]
						},
						{
							id: '4173',
							data: this.source[9]
						},
						{
							id: '4170',
							data: this.source[10]
						},
						{
							id: '4156',
							data: this.source[11]
						},
						{
							id: '4141',
							data: this.source[12]
						},
						{
							id: '4104',
							data: this.source[13]
						}
					]
				});
				// t1 = performance.now();
				// console.log(t1 - t0);
			} else {
				this.source = [[], [], [], [], [], [], [], [], [], [], [], [], [], []];
			}
			// this.chart.setOption({
			// 	series: [
			// 		{
			// 			id: 'lines',
			// 			data: []
			// 		}
			// 	]
			// });
		},
		resizeChart() {
			window.addEventListener('resize', () => {
                let chart = echarts.getInstanceByDom(document.getElementById('chart'));
				chart.resize();
			});
		}
	},
	mounted() {
		this.prepocess();
		this.initChart();
		this.resizeChart();
		this.Interval = setInterval(() => {
			this.updateChart();
		}, 500);
	},
	beforeDestroy() {
        clearInterval(this.Interval);
        // let chart = echarts.getInstanceByDom(document.getElementById('chart'));
		// chart.clear();
	}
};
</script>

<style scoped>
.loadChart {
	height: 200px;
	width: 100%;
}
</style>
