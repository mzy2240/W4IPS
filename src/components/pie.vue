<template>
	<div id="pie" class="chartdiv"></div>
</template>
<style>
.chartdiv {
	z-index: 0;
	height: 300px;
	width: 100%;
}
/* .echarts {
	width: 100%;
    height: 300px;
} */
</style>

<script>
import echarts from 'echarts';
import Material from 'vuetify/es5/util/colors';

export default {
	props: {
		areatotal: Number
	},
	data() {
		return {
			chart: '',
			anchor: 0,
			genDataLength: 0,
			color: Material
		};
	},
	methods: {
		preProcess() {
			let anchor = 0;
			var arrlength;
			var keyarr;

			for (let ele in this.$store.state.fieldstore) {
				arrlength = this.$store.state.fieldstore[ele].length;
				keyarr = Object.keys(this.$store.state.casedetail.content[ele]);
				if (ele != 'Gen') {
					anchor += arrlength * keyarr.length;
				} else {
					break;
				}
			}
			this.anchor = anchor;
			this.genDataLength = arrlength;
		},
		initdraw() {
			this.chart = echarts.init(document.getElementById('pie'));
			this.chart.setOption({
				legend: {bottom: '0'},
				color: [this.color.lightBlue.base, this.color.indigo.base, this.color.pink.base],
				series: [
					{
						id: 'pie',
						type: 'pie',
						// radius: '65%',
						center: ['50%', '50%'],
						radius: ['30%', '60%'],
						selectedMode: 'single',
						label: {
							position: 'outside',
							formatter: '{a|{b}}\n{hr|}\n{c|{c} MW}\n{hr|}\n{per|{d}%}{abg|}',
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
								abg: {
                                    backgroundColor: '#333',
                                    width: '100%',
                                    align: 'right',
                                    height: 15,
                                    borderRadius: [0, 0, 4, 4]
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
									color: '#999',
									lineHeight: 20,
									align: 'center'
								},
								per: {
									color: '#eee',
									// backgroundColor: '#334455',
									// padding: [2, 4],
									// borderRadius: 2,
									align: 'center',
									// width: '100%'
								}
							}
						},
						labelLine: {
							show: true
						},
						data: [
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
		},
		updateData() {
			try {
				const temp = JSON.parse(this.$store.state.rawdata).Data;
				var status;
				let offlineCapacity = 0;
				let index = 0;
				for (let [key, val] of Object.entries(
					this.$store.state.casedetail.content.Gen
				)) {
					status = temp[this.anchor + 5 + index * this.genDataLength];
					index += 1;
					if (status == 0) {
						// console.log(val);
						offlineCapacity += val[
							'Single.MW Max Limit'
						];
					}
				}
				// console.log(this.areatotal);
				this.chart.setOption({
					series: {
						id: 'pie',
						data: [
							{
								value: Math.round(this.areatotal),
								name: 'Current Generation'
							},
							{
								value: Math.round(this.$store.state.totalCapacity-offlineCapacity-this.areatotal),
								name: 'Online Capacity'
							},
							{
								value: Math.round(offlineCapacity),
								name: 'Offline Capacity'
							}
						]
					}
				});
			} catch (e) {
				console.log(e);
			}
		},
		resizeChart() {
			window.onresize = () => {
				if(this.chart) {
					this.chart.resize();
				}
			}
		}
	},
	mounted() {
		this.initdraw();
		this.preProcess();
		this.resizeChart();
		setInterval(() => {
			this.updateData();
		}, 1000);
	}
};
</script>
