<template>
  <div
    id='chart'
    class='loadChart'
    pa-0
    ma-0
  ></div>
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
			Interval: null
		};
	},
	methods: {
		initChart() {
			this.data = [
				2600,
				2678.5,
				2756.9,
				2834.9,
				2912.6,
				2989.6,
				3065.9,
				3141.3,
				3215.6,
				3288.8,
				3360.7,
				3431.1,
				3500,
				3567.1,
				3632.4,
				3695.8,
				3757,
				3816.1,
				3872.8,
				3927.1,
				3978.9,
				4028,
				4074.5,
				4118.1,
				4158.8,
				4196.6,
				4231.4,
				4263,
				4291.4,
				4316.7,
				4338.7,
				4357.3,
				4372.7,
				4384.6,
				4393.2,
				4398.3,
				4400,
				4398.3,
				4393.2,
				4384.6,
				4372.7,
				4357.3,
				4338.7,
				4316.7,
				4291.4,
				4263,
				4231.4,
				4196.6,
				4158.8,
				4118.1,
				4074.5,
				4028,
				3978.9,
				3927.1,
				3872.8,
				3816.1,
				3757,
				3695.8,
				3632.4,
				3567.1,
				3500.0
			];
			var base = +new Date(2018, 11, 29, 9, 50, 0);
			var halfmin = 600 * 1000;
			for (var i = 1; i < 62; i++) {
				var now = new Date((base += halfmin));
				var dateString =
					'2018/11/29 ' +
					[
						('0' + now.getHours()).slice(-2),
						('0' + now.getMinutes()).slice(-2),
						('0' + now.getSeconds()).slice(-2)
					].join(':');
				this.formatData.push([dateString, this.data[i - 1]]);
			}
			this.chart = echarts.init(document.getElementById('chart'), 'dark');
			var self = this;
			this.chart.setOption({
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross',
						lineStyle: {
							type: 'dashed'
						},
						crossStyle: {
							color: 'silver'
						}
					},
					position: function(pt) {
						return [pt[0], '10%'];
					},
					confine: true
				},
				legend: {
					show: true,
					padding: [10, 0, 0, 0]
				},
				grid: {
					show: false,
					top: '15%',
					bottom: '15%',
					right: '5%'
				},
				xAxis: [
					{
						type: 'time',
						boundaryGap: false,
						axisLabel: {
							formatter: function(value, index) {
								var date = new Date(value);
								var texts = [
									('0' + date.getHours()).slice(-2),
									('0' + date.getMinutes()).slice(-2)
								].join(':');
								return texts;
							}
						}
					}
				],
				yAxis: {
					type: 'value',
					boundaryGap: false
				},
				series: [
					{
						type: 'line',
						id: 'forecast',
						name: 'Load Forecast',
						symbol: 'none',
						smooth: true,
						sampling: 'average',
						itemStyle: {
							color: 'rgb(255, 70, 131)'
						},
						areaStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{
									offset: 1,
									color: 'rgb(255, 158, 68)'
								},
								{
									offset: 0,
									color: 'rgb(255, 70, 131)'
								}
							])
						},
						data: this.formatData
					},
					{
						type: 'line',
						id: 'real',
						name: 'Actual Load',
						symbol: 'none',
						// smooth: true,
						sampling: 'average',
						itemStyle: {
							color: 'rgb(131, 70, 255)'
						},
						areaStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{
									offset: 1,
									color: 'rgb(68, 158, 255)'
								},
								{
									offset: 0,
									color: 'rgb(131, 70, 255)'
								}
							])
						},
						data: []
					}
				]
			});
		},
		updateChart() {
			this.chart.setOption({
				series: [
					{
						id: 'real',
						data: this.$store.state.areaLoad
					}
				]
			});
		},
		resizeChart() {
			window.addEventListener('resize', () => {
				this.chart.resize();
			});
		}
	},
	mounted() {
		this.initChart();
		this.resizeChart();
		this.Interval = setInterval(() => {
			this.updateChart();
		}, 1000);
	},
	beforeDestroy() {
		clearInterval(this.Interval);
		this.chart.clear();
	}
};
</script>

<style scoped>
.loadChart {
	height: 200px;
	width: 100%;
}
</style>
