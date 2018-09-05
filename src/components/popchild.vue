<template>
	<v-card lazy>
		<el-tabs :tab-position="'left'" style="height: 500px;">
			<el-tab-pane v-for="item in tabs" :key=item :label=item lazy>
				<li>{{name}}</li>
				<li>{{detail}}</li>
			</el-tab-pane>
		</el-tabs>
	</v-card>

</template>

<style>
</style>

<script>
export default {
	props: {
		name: {},
		detail: {}
	},
	data() {
		return {};
	},
	computed: {
		tabs: function() {
			const controllable = ['Gen', 'Load', 'Shunt'];
			let temp = ['Bus'];
			for (let ele in this.detail) {
				if (controllable.includes(ele)) {
					temp.push(ele);
				}
			}
			return temp;
		}
	},
	watch: {}
};
</script>
