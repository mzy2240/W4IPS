<template>
	<v-card lazy>
		<el-tabs :tab-position="'left'" @tab-click="tabclick">
			<el-tab-pane v-for="item in tabs" :key=item :label=item lazy>
				<v-card>
					<v-card-title class='headline'>
						Data
					</v-card-title>
					<v-data-table :headers=$store.state.fieldstore[item] :items="data" disable-initial-sort hide-actions class="elevation-1">
					</v-data-table>
				</v-card>
				<v-card v-if="item != 'Bus'">
					<v-card-title class='headline'>
						Control
					</v-card-title>
					<v-overflow-btn dense :items="dropdown" label="Commands" segmented target="#dropdown-example"></v-overflow-btn>
				</v-card>
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
		detail: {},
		subname: {
			type: String
		},
		data: {
			default: function() {
				return [];
			}
		}
	},
	data() {
		return {
			dropdown: []
		};
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
	methods: {
		tabclick(ele) {
			let temp = [];
			for (var j in this.$store.state.tcmcommands[ele.label]) {
				let jj = j;
				temp.push({
					text: this.$store.state.tcmcommands[ele.label][j],
					callback: () => {
						const temp = this.$store.state.casedetail.content[ele.label][this.name.split(" ")[1]];
						this.$store.commit('setMessage', [
							ele.label,
							temp["Int.Bus Number"].toString() + "," + temp["String.ID"],
							this.subname + " " + this.name + " " + "#" + temp["String.ID"],
							this.$store.state.tcmcommands[ele.label][jj]
						]);
						this.$store.commit('setPublish');
					}
				});
			}
			this.dropdown = temp;
		}
	}
};
</script>
