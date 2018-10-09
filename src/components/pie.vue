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
	props: {
		areatotal: Number
	},
	data() {
		return {
			chart: ''
		};
	},
	methods: {
		initdraw() {
			console.log(this.$store.state.totalCapacity);
			console.log(this.$store.state.totalCapacity);
			console.log(this.$store.state.totalCapacity);
			this.chart = echarts.init(document.getElementById('pie'));
			this.chart.setOption({
				series: [
					{
						type: 'pie',
						radius: '65%',
						center: ['50%', '50%'],
						radius: ['30%', '60%'],
						selectedMode: 'single',
						label: {
							position: 'outside',
							formatter: '{a|{b}}\n{hr|}\n {c|{c} MW}  {per|{d}%}',
							backgroundColor: '#eee',
							borderColor: '#aaa',
							borderWidth: 1,
							borderRadius: 4,
							rich: {
								a: {
									// color: '#999',
									lineHeight: 22,
									align: 'center'
								},
								hr: {
									borderColor: '#aaa',
									width: '100%',
									borderWidth: 0.5,
									height: 0
								},
								b: {
									fontSize: 16,
									lineHeight: 33
								},
								c: {
									color: '#999'
								},
								per: {
									color: '#eee',
									backgroundColor: '#334455',
									padding: [2, 4],
									borderRadius: 2
								}
							}
						},
						labelLine: {
							show: true
						},
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
