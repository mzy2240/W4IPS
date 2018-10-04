<template>
	<div>
		<v-data-table :headers="headers" :items="shunts" :rows-per-page-items="defaultRowItems" disable-initial-sort item-key="name">
			<template slot="items" slot-scope="props">
				<tr @click="props.expanded = !props.expanded">
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
					text: 'Load',
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
			anchor: 0,
			shuntDataLength: 0,
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
			for (let i in this.$store.state.casedetail.content.Shunt) {
				temp.push({
					value: false,
					name: i,
					Status: 1,
					Mvar: 0,
					MvarNom: 0,
					Vpu: 1,
					FreqHz: 60,
					id: this.$store.state.casedetail.content.Shunt[i]['String.ID']
				});
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
					const temp = JSON.parse(this.$store.state.rawdata).Data;
					for (let i in this.shunts) {
						this.shunts[i].MvarNom = temp[this.anchor + 7 + i * this.shuntDataLength]; // MW is the 6th in the load data
						this.shunts[i].Mvar = temp[this.anchor + 6 + i * this.shuntDataLength];
						this.shunts[i].Vpu =
							temp[this.anchor + i * this.shuntDataLength];
						this.shunts[i].FreqHz =
							temp[this.anchor + 3 + i * this.shuntDataLength];
						this.shunts[i].Status =
							temp[this.anchor + 5 + i * this.shuntDataLength];
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
	}
};
</script>
