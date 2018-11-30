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
			data: [Math.random() * 300],
			date: []
		};
	},
	methods: {
		initChart() {
			var base = +new Date(2018, 11, 29, 9, 50, 0);
			var halfmin = 600 * 1000;
			for (var i = 1; i < 61; i++) {
				var now = new Date((base += halfmin));
				this.date.push(
					[now.getHours(), now.getMinutes(), now.getSeconds()].join(':')
				);
			}
			this.data = [2600,2678.5,2756.9,2834.9,2912.6,2989.6,3065.9,3141.3,3215.6,3288.8,3360.7,3431.1,3500,3567.1,3632.4,3695.8,3757,3816.1,3872.8,3927.1,3978.9,4028,4074.5,4118.1,4158.8,4196.6,4231.4,4263,4291.4,4316.7,4338.7,4357.3,4372.7,4384.6,4393.2,4398.3,4400,4398.3,4393.2,4384.6,4372.7,4357.3,4338.7,4316.7,4291.4,4263,4231.4,4196.6,4158.8,4118.1,4074.5,4028,3978.9,3927.1,3872.8,3816.1,3757,3695.8,3632.4,3567.1]
			this.chart = echarts.init(document.getElementById('chart'));
			var self = this;
			this.chart.setOption({
				tooltip: {
					trigger: 'axis',
					position: function(pt) {
						return [pt[0], '10%'];
					},
					confine: true
				},
				xAxis: {
					type: 'category',
					boundaryGap: false,
					// minInterval:600*1000,
					data: this.date
				},
				yAxis: {
					type: 'value',
					boundaryGap: [0, '100%']
				},
				series: [
					{
						type: 'line',
						id: 'line',
						name: 'Load Forecast',
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
						data: this.data
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
	},
	beforeDestroy() {
		// clearInterval(this.Process);
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
