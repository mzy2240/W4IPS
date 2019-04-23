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
				<v-data-table :headers="headers" :items="shunts" :rows-per-page-items="defaultRowItems" v-model="selected" select-all disable-initial-sort item-key="name">
					<template slot="headerCell" slot-scope="props">
						<v-tooltip bottom>
							<span slot="activator">
								{{ props.header.text }}
							</span>
							<span style="color:white;">
								{{ props.header.text }}
							</span>
						</v-tooltip>
					</template>
					<template v-slot:items="props">
						<tr :active="props.selected" @click="props.selected = !props.selected">
							<td>
								<v-checkbox :input-value="props.selected" primary hide-details></v-checkbox>
							</td>
							<td class="text-xs-left">{{ props.item.name }}</td>
							<td class="text-xs-left">{{ props.item.vStatus }}</td>
							<td class="text-xs-left">{{ props.item.Vpu }}</td>
							<td class="text-xs-right">{{ props.item.Mvar }}</td>
							<!-- <td class="text-xs-right">{{ props.item.MvarNom }}</td> -->
							<td class="text-xs-right">{{ props.item.MvarNom }}</td>
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
td {
	width: auto;
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
					text: 'Shunt',
					align: 'left',
					// sortable: false,
					value: 'name'
				},
				{ text: 'Status', value: 'Status',align: 'left' },
				{ text: 'Vpu', value: 'Vpu',align: 'right' },
				// { text: 'MvarNom', value: 'MvarNom' },
				{ text: 'Mvar', value: 'Mvar',align: 'right' },
				{ text: 'MvarNom', value: 'Mvar',align: 'right' },
				// { text: 'MVA', value: 'MVA' },
				// { text: 'MW setpoint', value: 'MWSet', sortable: false },
				// { text: 'Vpu setpoint', value: 'VpuSet', sortable: false },
				{ text: 'Actions', value: 'Actions', sortable: false,align: 'right' }
			],
			shunts: [],
			selected: [],
			anchor: 0,
			shuntDataLength: 0,
			defaultRowItems: [
				15,
				30,
				{ text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }
			],
			shuntArray: [],
			shuntFieldIndex: {
				"Vpu": this.$store.state.fieldstore['Load'].findIndex(x => x.text ==="Vpu"),
				"Status": this.$store.state.fieldstore['Load'].findIndex(x => x.text ==="Status"),
				"Mvar": this.$store.state.fieldstore['Load'].findIndex(x => x.text ==="Mvar"),
				"MvarNom": this.$store.state.fieldstore['Load'].findIndex(x => x.text ==="MvarNom")
			}
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
				if (ele != 'Shunt') {
					anchor += arrlength * keyarr.length;
				} else {
					break;
				}
			}
			this.anchor = anchor;
			this.shuntDataLength = arrlength;
		},
		initTable() {
			let temp = [];
			let subID;
			let count = 0;
			for (let i in this.$store.state.areadetail.content.Shunt) {
				if (
					this.$store.state.areadetail.content.Shunt[i]['Int.Area Number'] ==
					+this.$store.state.area
				) {
					this.shuntArray.push(count);
					subID = this.$store.state.areadetail.content.Bus[i.split(',')[0]]['Int.Sub Number'];
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
						name: this.$store.state.areadetail.content.Bus[i.split(',')[0]]['String.Name'],
						Status: 1,
						vStatus: 1,
						Mvar: 0,
						MvarNom: 0,
						Vpu: 1,
						FreqHz: 60,
						id: this.$store.state.areadetail.content.Shunt[i]['String.ID']
					});
				}
				count++;
			}
			this.shunts = temp;
			if (this.shunts.length > 1) {
				return Promise.resolve('Table initialized properly');
			} else {
				return Promise.reject('Error in initialization');
			}
		},
		updateTable() {
			setInterval(() => {
				try {
					const temp = this.$store.state.parsedData;
					for (let i in this.shunts) {
						this.shunts[i].Vpu =
							temp[this.anchor + this.shuntFieldIndex['Vpu'] + this.shuntArray[i] * this.shuntDataLength];
						this.shunts[i].MvarNom =
							temp[this.anchor + this.shuntFieldIndex['MvarNom'] + this.shuntArray[i] * this.shuntDataLength]; // MW is the 6th in the load data
						this.shunts[i].Mvar =
							temp[this.anchor + this.shuntFieldIndex['Mvar'] + this.shuntArray[i] * this.shuntDataLength];
						this.shunts[i].Status =
							temp[this.anchor + this.shuntFieldIndex['Status'] + this.shuntArray[i] * this.shuntDataLength];
						if (
							this.$store.state.genAction['Shunt'][this.shunts[i].key] !=
							undefined
						) {
							if (
								this.$store.state.currentTime >=
								Math.max(
									this.$store.state.genAction['Shunt'][this.shunts[i].key]
								) +
									3
							) {
								this.shunts[i].vStatus = this.shunts[i].Status;
							}
						} else {
							this.shunts[i].vStatus = this.shunts[i].Status;
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
				'Shunt',
				item.key + ',' + item.id,
				item.key + '#' + item.id,
				command
			]);
			this.$store.commit('recordAction', ['Shunt', item.key]);
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
	watch: {
		selected: function(newval, oldval) {
			this.$store.commit('updateSelectedShunts', newval);
		}
	},
	computed: {
		disable() {
			if (this.$store.state.status == 'running') {
				return false;
			} else {
				return true;
			}
		}
	}
};
</script>
