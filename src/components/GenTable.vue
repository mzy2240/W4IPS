<template>
	<v-card>
		<v-toolbar card dense color="transparent">
			<v-toolbar-title>
				<h4> {{title}} </h4>
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-toolbar-items>
        		<v-menu bottom right offset-x>
					<v-btn icon slot="activator">
						<v-icon>more_vert</v-icon>
					</v-btn>
					<v-list>
						<v-list-tile @click="toggleALL">
							<v-list-tile-title>Toggle all AGC</v-list-tile-title>
						</v-list-tile>
					</v-list>
        		</v-menu>
			</v-toolbar-items>
		</v-toolbar>
		<v-divider></v-divider>
		<v-card-text class="pa-0">
			<template>
				<v-data-table class="fixed-header" :headers="headers" :items="$store.state.genData" :rows-per-page-items="defaultRowItems" v-model="selected" select-all disable-initial-sort item-key="name">
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
							<td class="text-xs-right"><v-chip label small :color="getColorByValue(props.item.MW, props.item.MWMax)" text-color="black" class="chip">{{ props.item.MW }}</v-chip></td>
							<td class="text-xs-right">{{ props.item.Mvar }}</td>
							<td class="text-xs-right">{{ props.item.MarginalCost }}</td>
							<td class="text-xs-right">
								<v-edit-dialog :return-value.sync="props.item.MWSetpoint" large lazy @save="savemws(props.item)" @open="openmws(props.item)">
									<div>{{ props.item.MWSetpoint }}</div>
									<div slot="input" class="mt-3 title">Update MW Setpoint</div>
									<v-text-field slot="input" v-model="mws" label="Edit" single-line autofocus></v-text-field>
								</v-edit-dialog>
							</td>
							<td class="text-xs-right">
								<v-edit-dialog :return-value.sync="props.item.VpuSetpoint" large lazy @save="savevps(props.item)" @open="openvps(props.item)">
									<div>{{ props.item.VpuSetpoint }}</div>
									<div slot="input" class="mt-3 title">Update Vpu Setpoint</div>
									<v-text-field slot="input" v-model="vps" label="Edit" single-line autofocus></v-text-field>
								</v-edit-dialog>
							</td>
							<td class="text-xs-right">{{ props.item.MWMax }}</td>
							<td class="text-xs-right">{{ props.item.MWMin }}</td>
							<td class="text-xs-center">
								<!-- <div class="mt-3 pa-0"> -->
									<v-switch class="mt-3" v-model="props.item.Status" @click.native="toggle(props.item)"></v-switch>
								<!-- </div> -->
							</td>
							<td class="text-xs-center">
								<!-- <div class="mt-3 pa-0"> -->
									<v-switch class="mt-3" v-model="props.item.AGC"></v-switch>
								<!-- </div> -->
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

.chip {
	width: 60px;
}
.fixed-header table {
    table-layout: fixed;
}

.fixed-header th {
    background-color: #fff; /* just for LIGHT THEME, change it to #474747 for DARK */
    position: sticky;
    top: 0;
    z-index: 10;
}

.fixed-header tr.datatable__progress th {
    top: 56px;
}

.fixed-header .table__overflow {
    overflow: auto;
    height: 100%;
}
</style>

<script>
import { mapGetters } from 'vuex';

export default {
	props: {
		title: String
	},
	data() {
		return {
			headers: [
				{
					text: 'Generator',
					align: 'left',
					sortable: false,
					value: 'name'
				},
				{ text: 'Status', value: 'Status'},
				{ text: 'MW', value: 'MW'},
				{ text: 'Mvar', value: 'Mvar'},
				{ text: 'Marginal Cost', value: 'MarginalCost'},
				{ text: 'MW Setpoint', value: 'MWSetpoint'},
				{ text: 'Vpu Setpoint', value: 'VpuSetpoint'},
				{ text: 'MW Max Limit', value: 'MWMax'},
				{ text: 'MW Min Limit', value: 'MWMin'},
				// { text: 'MW setpoint', value: 'MWSet', sortable: false },
				// { text: 'Vpu setpoint', value: 'VpuSet', sortable: false },
				{ text: 'Actions', value: 'Actions'},
				{ text: 'AGC', value: 'AGC'}
			],
			gens: [],
			selected: [],
			anchor: 0,
			genDataLength: 0,
			defaultRowItems: [
				10,
				25,
				{ text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }
			],
			mws: 0,
			vps: 1,
			switch: false
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
			let subID;
			for (let i in this.$store.state.casedetail.content.Gen) {
				subID = this.$store.state.casedetail.content.Bus[i]["Int.Sub Number"];
				temp.push({
					value: [this.$store.state.casedetail.content.Substation[subID.toString()]["Double.Longitude"], this.$store.state.casedetail.content.Substation[subID.toString()]["Double.Latitude"]],
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
					id: this.$store.state.casedetail.content.Gen[i]['String.ID']
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
			// setInterval(() => {
			try {
				const temp = JSON.parse(this.$store.state.rawdata).Data;
				for (let i in this.gens) {
					this.gens[i].MW = temp[this.anchor + 6 + i * this.genDataLength]; // MW is the 6th in the gen data
					this.gens[i].Mvar = temp[this.anchor + 7 + i * this.genDataLength];
					this.gens[i].MWSetpoint =
						temp[this.anchor + 10 + i * this.genDataLength];
					this.gens[i].VpuSetpoint =
						temp[this.anchor + 9 + i * this.genDataLength];
					this.gens[i].Status = temp[this.anchor + 5 + i * this.genDataLength];
				}
			} catch (e) {
				console.log('The raw data are not ready');
			}
			// }, 500);
		},
		savemws(item) {
			const command = 'Set Power ' + this.mws + ' MW';
			this.$store.commit('setMessage', [
				'Gen',
				item.name + ',' + item.id,
				item.name + '#' + item.id,
				command
			]);
			this.$store.commit('setPublish');
		},
		openmws(item) {
			this.mws = item.MWSetpoint;
		},
		savevps(item) {
			const command = 'Set Exciter_Setpoint ' + this.vps + ' pu';
			this.$store.commit('setMessage', [
				'Gen',
				item.name + ',' + item.id,
				item.name + '#' + item.id,
				command
			]);
			this.$store.commit('setPublish');
		},
		openvps(item) {
			this.vps = item.VpuSetpoint;
		},
		toggle(item) {
			var command;
			if (item.Status == true) {
				command = 'CLOSE';
			} else {
				command = 'OPEN';
			}
			this.$store.commit('setMessage', [
				'Gen',
				item.name + ',' + item.id,
				item.name + '#' + item.id,
				command
			]);
			this.$store.commit('setPublish');
		},
		toggleAGC(item) {
			console.log(item);
			// console.log(this.$store.state.genData)
		},
		toggleALL(){
			this.switch = !this.switch;
			this.$store.commit('toggleALL', this.switch);
		},
		getColorByValue(MW, MAX) {
			var temp = 'transparent';
			if (MW >= MAX) {
				temp = 'red';
			} else if (MW > 0.9 * MAX) {
				temp = 'yellow';
			}
			return temp;
		}
	},
	created() {
		// this.preProcess();
		// this.initTable();
	},
	mounted() {
		// this.initTable();
		// this.initTable().then(() => this.updateTable());
	},
	// computed: {
	// 	...mapGetters({
	// 		dataflag: 'getDataUpdate'
	// 	})
	// },
	watch: {
		selected: function(newval, oldval) {
			// console.log(newval);
			this.$store.commit('updateSelectedGens', newval);
		}
	}
};
</script>
