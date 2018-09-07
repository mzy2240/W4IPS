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
					<v-form>
						<v-container>
							<v-layout row wrap align-baseline>
								<v-flex xs4 v-show="showInput">
									<v-text-field :disabled="InputDisabled" label="Value" solo clearable v-model="value"></v-text-field>
								</v-flex>
								<v-flex xs8 v-if="showInput">
									<v-overflow-btn @change="cmddetection" dense :items="dropdown" label="Commands" segmented target="#dropdown-example"></v-overflow-btn>
								</v-flex>
								<v-flex xs12 v-else>
									<v-overflow-btn dense :items="dropdown" label="Commands" segmented target="#dropdown-example"></v-overflow-btn>
								</v-flex>
							</v-layout>
						</v-container>
					</v-form>
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
			dropdown: [],
			showInput: false,
			InputDisabled: true,
			value: null
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
		getInput(e) {
			console.log(e);
		},
		cmddetection(ele) {
			if (this.showInput == true) {
				if (ele != 'OPEN') {
					this.InputDisabled = false;
				} else {
					this.value = null;
					this.InputDisabled = true;
				}
			} else {
				this.value = null;
				this.InputDisabled = true;
			}
		},
		tabclick(ele) {
			let temp = [];
			if (ele.label == 'Gen') {
				this.showInput = true;
			}
			for (var j in this.$store.state.tcmcommands[ele.label]) {
				let jj = j;
				temp.push({
					text: this.$store.state.tcmcommands[ele.label][j],
					callback: () => {
						const temp = this.$store.state.casedetail.content[ele.label][
							this.name.split(' ')[1]
						];
						var command = this.$store.state.tcmcommands[ele.label][jj];
						if (!this.InputDisabled) {
							if (this.value == null) {
								this.value = 0;
							}
							command =
								command.split('xxx')[0] + this.value + command.split('xxx')[1];
						}
						this.$store.commit('setMessage', [
							ele.label,
							temp['Int.Bus Number'].toString() + ',' + temp['String.ID'],
							this.subname + ' ' + this.name + ' ' + '#' + temp['String.ID'],
							command
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
