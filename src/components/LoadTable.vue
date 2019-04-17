<template>
	<v-card>
		<v-toolbar card dense color="transparent">
			<v-toolbar-title>
				<h4> {{title}} </h4>
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn icon>
				<v-icon>more_vert</v-icon>
			</v-btn>
		</v-toolbar>
		<v-divider></v-divider>
		<v-card-text class="pa-0">
			<template>
				<v-data-table :headers="headers" :items="loads" :rows-per-page-items="defaultRowItems" v-model="selected" select-all disable-initial-sort item-key="name">
					<template v-slot:items="props">
						<tr :active="props.selected" @click="props.selected = !props.selected">
							<td>
								<v-checkbox :input-value="props.selected" primary hide-details></v-checkbox>
							</td>
							<td class="text-xs-left">{{ props.item.name }}</td>
							<td class="text-xs-left">{{ props.item.vStatus }}</td>
							<td class="text-xs-center">{{ props.item.MW }}</td>
							<td class="text-xs-center">{{ props.item.Mvar }}</td>
							<td class="text-xs-center">{{ props.item.Vpu }}</td>
							<td class="text-xs-center">{{ props.item.FreqHz }}</td>
							<td class="justify-center layout px-0">
								<div class="my-2">
									<v-switch v-model="props.item.vStatus" @click.native="toggle(props.item)" :disabled='disable'></v-switch>
								</div>
							</td>
						</tr>
					</template>
					<!-- <template slot="expand" slot-scope="props">
				<v-card flat>
					<v-card-text>Peek-a-boo!</v-card-text>
				</v-card>
			</template> -->
				</v-data-table>
			</template>
			<v-divider></v-divider>
		</v-card-text>
	</v-card>
</template>

<style scoped>
table.v-table tbody td:first-child,
table.v-table tbody td:not(:first-child),
table.v-table tbody th:first-child,
table.v-table tbody th:not(:first-child),
table.v-table thead td:first-child,
table.v-table thead td:not(:first-child),
table.v-table thead th:first-child,
table.v-table thead th:not(:first-child) {
	padding: 0 10px;
}
</style>

<script>
export default {
	props: {
		title: String
	},
	data() {
		return {
			headers: [
				{
					text: 'Load',
					align: 'left',
					// sortable: false,
					value: 'name'
				},
				{ text: 'Status', value: 'Status' },
				{ text: 'MW', value: 'MW' },
				{ text: 'Mvar', value: 'Mvar' },
				{ text: 'Vpu', value: 'Vpu' },
				{ text: 'FreqHz', value: 'FreqHz' },
				// { text: 'MVA', value: 'MVA' },
				// { text: 'MW setpoint', value: 'MWSet', sortable: false },
				// { text: 'Vpu setpoint', value: 'VpuSet', sortable: false },
				{ text: 'Actions', value: 'Actions', sortable: false }
			],
			loads: [],
			selected: [],
			anchor: 0,
			loadDataLength: 0,
			defaultRowItems: [
				15,
				30,
				{ text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }
			],
			loadArray: []
		};
	},
	methods: {
		preProcess() {
			let anchor = 0;
			var arrlength;
			var keyarr;

			for (let ele in this.$store.state.fieldstore) {
				arrlength = this.$store.state.fieldstore[ele].length;
				keyarr = Object.keys(this.$store.state.areadetail.content[ele]);
				if (ele != 'Load') {
					anchor += arrlength * keyarr.length;
				} else {
					break;
				}
			}
			this.anchor = anchor;
			this.loadDataLength = arrlength;
		},
		initTable() {
			let temp = [];
			let count = 0;
			let subID;
			for (let i in this.$store.state.areadetail.content.Load) {
				if (
					this.$store.state.areadetail.content.Load[i]['Int.Area Number'] ==
					+this.$store.state.area
				) {
					this.loadArray.push(count);
					subID = this.$store.state.areadetail.content.Bus[i.split(',')[0]][
						'Int.Sub Number'
					];
					temp.push({
						value: [
							this.$store.state.areadetail.content.Substation[subID.toString()][
								'Double.Longitude'
							],
							this.$store.state.areadetail.content.Substation[subID.toString()][
								'Double.Latitude'
							]
						],
						key: i,
						name: this.$store.state.areadetail.content.Bus[i.split(',')[0]][
							'String.Name'
						]+' '+i.split(',')[1],
						Status: 1,
						vStatus: 1,
						MW: 0,
						Mvar: 0,
						Vpu: 1,
						FreqHz: 60,
						id: this.$store.state.areadetail.content.Load[i]['String.ID']
					});
				}
				count++;
			}
			this.loads = temp;
			if (this.loads.length > 1) {
				return Promise.resolve('Table initialized properly');
			} else {
				return Promise.reject('Error in initialization');
			}
		},
		updateTable() {
			setInterval(() => {
				try {
					const temp = this.$store.state.parsedData;
					for (let i in this.loads) {
						this.loads[i].MW =
							temp[this.anchor + 6 + this.loadArray[i] * this.loadDataLength]; // MW is the 6th in the load data
						this.loads[i].Mvar =
							temp[this.anchor + 7 + this.loadArray[i] * this.loadDataLength];
						this.loads[i].Vpu =
							temp[this.anchor + this.loadArray[i] * this.loadDataLength];
						this.loads[i].FreqHz =
							temp[this.anchor + 3 + this.loadArray[i] * this.loadDataLength];
						this.loads[i].Status =
							temp[this.anchor + 5 + this.loadArray[i] * this.loadDataLength];
						if (
							this.$store.state.genAction['Load'][this.loads[i].key] !=
							undefined
						) {
							if (
								this.$store.state.currentTime >=
								Math.max(
									this.$store.state.genAction['Load'][this.loads[i].key]
								) +
									3
							) {
								this.loads[i].vStatus = this.loads[i].Status;
							}
						} else {
							this.loads[i].vStatus = this.loads[i].Status;
						}
					}
				} catch (e) {
					console.log('The raw data are not ready');
				}
			}, 500);
		},
		toggle(item) {
			var command;
			if (item.vStatus) {
				item.vStatus = 1;
				command = 'CLOSE';
			} else {
				item.vStatus = 0;
				command = 'OPEN';
			}
			this.$store.commit('setMessage', [
				'Load',
				item.key + ',' + item.id,
				item.key + '#' + item.id,
				command
			]);
			this.$store.commit('recordAction', ['Load', item.key]);
			this.$store.commit('setPublish');
		}
	},
	created() {
		this.preProcess();
		// this.initTable();
	},
	mounted() {
		this.initTable().then(() => this.updateTable());
	},
	computed: {
		disable() {
			if (this.$store.state.status == 'running') {
				return false;
			} else {
				return true;
			}
		}
	},
	watch: {
		selected: function(newval, oldval) {
			this.$store.commit('updateSelectedLoads', newval);
		}
	}
};
</script>
