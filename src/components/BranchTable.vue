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
				<v-data-table class="fixed-header" :headers="headers" :items="branches" :rows-per-page-items="defaultRowItems" v-model="selected" select-all disable-initial-sort item-key="name">
					<template slot="headerCell" slot-scope="props">
						<!-- <v-tooltip bottom> -->
							<span slot="activator">
								{{ props.header.text }}
							</span>
						<!-- </v-tooltip> -->
					</template>
					<template slot="items" slot-scope="props">
						<tr :active="props.selected">
							<td>
								<v-checkbox v-model="props.selected" primary hide-details @click="props.selected = !props.selected"></v-checkbox>
							</td>
							<td class="text-xs-left">{{ props.item.name }}</td>
							<td class="text-xs-left">{{ props.item.Status }}</td>
							<td class="text-xs-right">{{ props.item.MWFrom }}</td>
							<td class="text-xs-right">{{ props.item.MvarFrom }}</td>
							<td class="text-xs-right">{{ props.item.MVAFrom }}</td>
							<td class="text-xs-right">{{ props.item.AmpsFrom }}</td>
							<td class="text-xs-right">{{ props.item.MWTo }}</td>
							<td class="text-xs-right">{{ props.item.MvarTo }}</td>
							<td class="text-xs-right">{{ props.item.MVATo }}</td>
							<td class="text-xs-right">{{ props.item.AmpsTo }}</td>
							<td class="text-xs-right">{{ props.item.MVALimit }}</td>
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
export default {
	props: {
		title: String
	},
	data() {
		return {
			headers: [
				{
					text: 'Branch',
					align: 'left',
					sortable: false,
					value: 'name'
				},
				{ text: 'Status', value: 'Status'},
				{ text: 'MWFrom', value: 'MWFrom' },
				{ text: 'MvarFrom', value: 'MvarFrom' },
				{ text: 'MVAFrom', value: 'MVAFrom' },
				{ text: 'AmpsFrom', value: 'AmpsFrom' },
				{ text: 'MWTo', value: 'MWTo' },
				{ text: 'MvarTo', value: 'MvarTo' },
				{ text: 'MVATo', value: 'MVATo' },
				{ text: 'AmpsTo', value: 'AmpsTo' },
				{ text: 'MVA Limit', value: 'MVALimit' },
				// { text: 'MVA', value: 'MVA' },
				// { text: 'MW setpoint', value: 'MWSet', sortable: false },
				// { text: 'Vpu setpoint', value: 'VpuSet', sortable: false },
				{ text: 'Actions', value: 'Actions', sortable: false }
			],
			branches: [],
			selected: [],
			anchor: 0,
			branchDataLength: 0,
			defaultRowItems: [
				15,
				30,
				{ text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }
			]
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
				if (ele != 'Branch') {
					anchor += arrlength * keyarr.length;
				} else {
					break;
				}
			}
			this.anchor = anchor;
			this.branchDataLength = arrlength;
		},
		initTable() {
			let temp = [];
			// let subID;
			for (let i in this.$store.state.casedetail.content.Branch) {
				temp.push({
					value: false, //[this.$store.state.casedetail.content.Substation[subID.toString()]["Double.Longitude"], this.$store.state.casedetail.content.Substation[subID.toString()]["Double.Latitude"]],
					name: i,
					id: this.$store.state.casedetail.content.Branch[i]['String.CircuitID'],
					Status: 1,
					MWFrom: 0,
					MvarFrom: 0,
					MVAFrom: 0,
					AmpsFrom: 0,
					MWTo: 0,
					MvarTo: 0,
					MVATo: 0,
					AmpsTo: 0,
					MVALimit: this.$store.state.casedetail.content.Branch[i]['Single.MVA Limit']
				});
			}
			this.branches = temp;
			if (this.branches.length > 1) {
				return Promise.resolve('Table initialized properly');
			} else {
				return Promise.reject('Error in initialization');
			}
		},
		updateTable() {
			setInterval(() => {
				try {
					// const temp = JSON.parse(this.$store.state.rawdata).Data;
					// const message = JSON.parse(this.$store.state.rawdata)
					// console.log(message);
					const temp = this.$store.state.data;
					for (let i in this.branches) {
						this.branches[i].Status =
							temp[this.anchor + 0 + i * this.branchDataLength];
						this.branches[i].MWFrom =
							temp[this.anchor + 1 + i * this.branchDataLength]; // MW is the 6th in the load data
						this.branches[i].MvarFrom =
							temp[this.anchor + 2 + i * this.branchDataLength];
						this.branches[i].MVAFrom =
							temp[this.anchor + 3 + i * this.branchDataLength];
						this.branches[i].AmpsFrom =
							temp[this.anchor + 4 + i * this.branchDataLength];
						this.branches[i].MWTo =
							temp[this.anchor + 5 + i * this.branchDataLength]; // MW is the 6th in the load data
						this.branches[i].MvarTo =
							temp[this.anchor + 6 + i * this.branchDataLength];
						this.branches[i].MVATo =
							temp[this.anchor + 7 + i * this.branchDataLength];
						this.branches[i].AmpsTo =
							temp[this.anchor + 8 + i * this.branchDataLength];
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
