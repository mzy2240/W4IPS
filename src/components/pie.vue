<template>
	<div id="pie" class="chartdiv"></div>
</template>
<style>
.chartdiv {
	/* z-index: 0; */
	height: 100%;
	width: 100%;
}
</style>

<script>
import echarts from 'echarts';

export default {
	props: {},
	data() {
		return {
			chart: ''
		};
	},
	methods: {
		initdraw() {
			this.chart = echarts.init(document.getElementById('pie'));
			this.chart.setOption({
				series: [
					{
						type: 'pie',
						radius: '65%',
						center: ['50%', '50%'],
						selectedMode: 'single',
						data: [
							{
								value: 10000,
								name: 'Current Generation'
							},
							{
								value: 10000,
								name: 'Online Capacity'
							},
							{
								value: 10000,
								name: 'Offline Capacity'
							}
						],
						itemStyle: {
							emphasis: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						}
					}
				]
			});
		}
	},
	mounted() {
		this.initdraw();
	}
};
</script>
