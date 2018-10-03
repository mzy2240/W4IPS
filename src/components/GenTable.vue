<template>
	<div>
		<v-data-table :headers="headers" :items="gens" :rows-per-page-items="defaultRowItems" disable-initial-sort item-key="name">
			<template slot="items" slot-scope="props">
				<tr @click="props.expanded = !props.expanded">
					<td class="text-xs-left">{{ props.item.name }}</td>
					<td class="text-xs-left">{{ props.item.Status }}</td>
					<td class="text-xs-right">{{ props.item.MW }}</td>
					<td class="text-xs-right">{{ props.item.Mvar }}</td>
					<td class="text-xs-right">
						<v-edit-dialog :return-value.sync="props.item.MWSetpoint" large lazy @save="save(props.item)" @open="open(props.item)">
							<div>{{ props.item.MWSetpoint }}</div>
							<div slot="input" class="mt-3 title">Update MW Setpoint</div>
							<v-text-field slot="input" v-model="mws" label="Edit" single-line autofocus></v-text-field>
						</v-edit-dialog>
						<!-- {{ props.item.MWSetpoint }} -->
					</td>
					<td class="text-xs-right">{{ props.item.VpuSetpoint }}</td>
					<td class="text-xs-right">{{ props.item.MWMax }}</td>
					<td class="text-xs-right">{{ props.item.MWMin }}</td>
					<td class="justify-center layout px-0">
						<v-icon small class="mr-2" @click="editItem(props.item)">
							edit
						</v-icon>
						<v-icon small @click="deleteItem(props.item)">
							delete
						</v-icon>
					</td>
				</tr>
			</template>
			<!-- <template slot="expand" slot-scope="props">
				<v-card flat>
					<v-card-text>Peek-a-boo!</v-card-text>
				</v-card>
			</template> -->
		</v-data-table>
	</div>
</template>

<style>
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
	data() {
		return {
			headers: [
				{
					text: 'Generator',
					align: 'left',
					sortable: false,
					value: 'name'
				},
				{ text: 'Status', value: 'Status' },
				{ text: 'MW', value: 'MW' },
				{ text: 'Mvar', value: 'Mvar' },
				// { text: 'MVA', value: 'MVA' },
				{ text: 'MW Setpoint', value: 'MWSetpoint' },
				{ text: 'Vpu Setpoint', value: 'VpuSetpoint' },
				{ text: 'MW Max Limit', value: 'MWMax' },
				{ text: 'MW Min Limit', value: 'MWMin' },
				// { text: 'MW setpoint', value: 'MWSet', sortable: false },
				// { text: 'Vpu setpoint', value: 'VpuSet', sortable: false },
				{ text: 'Actions', value: 'Actions', sortable: false }
			],
			gens: [],
			anchor: 0,
			genDataLength: 0,
			defaultRowItems: [
				10,
				25,
				{ text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }
			],
			mws: 0
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
		initTable() {
			let temp = [];
			for (let i in this.$store.state.casedetail.content.Gen) {
				temp.push({
					value: false,
					name: i,
					Status: 1,
					MWMax: this.$store.state.casedetail.content.Gen[i][
						'Single.MW Max Limit'
					],
					MWMin: this.$store.state.casedetail.content.Gen[i][
						'Single.MW Min Limit'
					],
					MW: 0,
					Mvar: 0,
					MWSetpoint: 0,
					VpuSetpoint: 1,
					id: this.$store.state.casedetail.content.Gen[i][
						'String.ID'
					]
				});
			}
			this.gens = temp;
			if (this.gens.length > 1) {
				return Promise.resolve('Table initialized properly');
			} else {
				return Promise.reject('Error in initialization');
			}
		},
		updateTable() {
			setInterval(() => {
				try {
					const temp = JSON.parse(this.$store.state.rawdata).Data;
					for (let i in this.gens) {
						this.gens[i].MW = temp[this.anchor + 6 + i * this.genDataLength]; // MW is the 6th in the gen data
						this.gens[i].Mvar = temp[this.anchor + 7 + i * this.genDataLength];
						this.gens[i].MWSetpoint =
							temp[this.anchor + 10 + i * this.genDataLength];
						this.gens[i].VpuSetpoint =
							temp[this.anchor + 9 + i * this.genDataLength];
						this.gens[i].Status =
							temp[this.anchor + 5 + i * this.genDataLength];
						this.gens[i].id =
							temp[this.anchor + 5 + i * this.genDataLength];
					}
				} catch (e) {
					console.log('The raw data are not ready');
				}
			}, 500);
		},
		save(item) {
			console.log(item);
			const command = "Set Power " + this.mws + " MW";
			this.$store.commit('setMessage', [
							"Gen",
							item.name + ',' + item.id,
							item.name + '#' + item.id,
							command
						]);
			this.$store.commit('setPublish');
		},
		open(item) {
			this.mws = item.MWSetpoint;
		}
	},
	created() {
		this.preProcess();
		// this.initTable();
	},
	mounted() {
		this.initTable().then(() => this.updateTable());
	}
};
</script>
