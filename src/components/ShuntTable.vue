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
							<span>
								{{ props.header.text }}
							</span>
						</v-tooltip>
					</template>
					<template slot="items" slot-scope="props">
						<tr :active="props.selected">
							<td>
								<v-checkbox v-model="props.selected" primary hide-details @click="props.selected = !props.selected"></v-checkbox>
							</td>
							<td class="text-xs-left">{{ props.item.name }}</td>
							<td class="text-xs-left">{{ props.item.Status }}</td>
							<td class="text-xs-right">{{ props.item.Mvar }}</td>
							<td class="text-xs-right">{{ props.item.MvarNom }}</td>
							<td class="text-xs-right">{{ props.item.Vpu }}</td>
							<td class="text-xs-right">{{ props.item.FreqHz }}</td>
							<td class="justify-center layout px-0">
								<div class="my-2">
									<v-switch v-model="props.item.Status" @click.native="toggle(props.item)"></v-switch>
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
					sortable: false,
					value: 'name'
				},
				{ text: 'Status', value: 'Status' },
				{ text: 'MvarNom', value: 'MvarNom' },
				{ text: 'Mvar', value: 'Mvar' },
				{ text: 'Vpu', value: 'Vpu' },
				{ text: 'FreqHz', value: 'FreqHz' },
				// { text: 'MVA', value: 'MVA' },
				// { text: 'MW setpoint', value: 'MWSet', sortable: false },
				// { text: 'Vpu setpoint', value: 'VpuSet', sortable: false },
				{ text: 'Actions', value: 'Actions', sortable: false }
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
			shuntArray: []
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
			for (let i in this.$store.state.casedetail.content.Shunt) {
				if (
					this.$store.state.casedetail.content.Shunt[i]['Int.Area Number'] ==
					+this.$store.state.area
				) {
					this.shuntArray.push(count);
					subID = this.$store.state.casedetail.content.Bus[i]['Int.Sub Number'];
					temp.push({
						value: [
							this.$store.state.casedetail.content.Substation[subID.toString()][
								'Double.Longitude'
							],
							this.$store.state.casedetail.content.Substation[subID.toString()][
								'Double.Latitude'
							]
						],
						name: i,
						Status: 1,
						Mvar: 0,
						MvarNom: 0,
						Vpu: 1,
						FreqHz: 60,
						id: this.$store.state.casedetail.content.Shunt[i]['String.ID']
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
						this.shunts[i].MvarNom =
							temp[this.anchor + 7 + this.shuntArray[i] * this.shuntDataLength]; // MW is the 6th in the load data
						this.shunts[i].Mvar =
							temp[this.anchor + 6 + this.shuntArray[i] * this.shuntDataLength];
						this.shunts[i].Vpu = temp[this.anchor + this.shuntArray[i] * this.shuntDataLength];
						this.shunts[i].FreqHz =
							temp[this.anchor + 3 + this.shuntArray[i] * this.shuntDataLength];
						this.shunts[i].Status =
							temp[this.anchor + 5 + this.shuntArray[i] * this.shuntDataLength];
					}
				} catch (e) {
					console.log('The raw data are not ready');
				}
			}, 500);
		},
		toggle(item) {
			var command;
			if (item.Status == true) {
				command = 'CLOSE';
			} else {
				command = 'OPEN';
			}
			this.$store.commit('setMessage', [
				'Shunt',
				item.name + ',' + item.id,
				item.name + '#' + item.id,
				command
			]);
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
	}
};
</script>
