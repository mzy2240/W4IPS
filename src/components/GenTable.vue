<template>
	<div>
		<v-data-table :headers="headers" :items="gens" :rows-per-page-items="defaultRowItems" disable-initial-sort item-key="name">
			<template slot="items" slot-scope="props">
				<tr @click="props.expanded = !props.expanded">
					<td class="text-xs-left">{{ props.item.name }}</td>
					<td class="text-xs-right">{{ props.item.MW }}</td>
					<td class="text-xs-right">{{ props.item.Mvar }}</td>
					<td class="text-xs-right">{{ props.item.MWSetpoint }}</td>
					<td class="text-xs-right">{{ props.item.VpuSetpoint }}</td>
					<td class="text-xs-right">{{ props.item.MWMax }}</td>
					<td class="text-xs-right">{{ props.item.MWMin }}</td>
					<!-- <td class="text-xs-right">{{ props.item.carbs }}</td>
					<td class="text-xs-right">{{ props.item.protein }}</td>
					<td class="text-xs-right">{{ props.item.iron }}</td> -->
				</tr>
			</template>
			<template slot="expand" slot-scope="props">
				<v-card flat>
					<v-card-text>Peek-a-boo!</v-card-text>
				</v-card>
			</template>
		</v-data-table>
	</div>
</template>

<style>
table.v-table tbody td:first-child, table.v-table tbody td:not(:first-child), table.v-table tbody th:first-child, table.v-table tbody th:not(:first-child), table.v-table thead td:first-child, table.v-table thead td:not(:first-child), table.v-table thead th:first-child, table.v-table thead th:not(:first-child) {
  padding: 0 10px
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
				{ text: 'MW', value: 'MW'},
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
			defaultRowItems: [10,25,{"text":"$vuetify.dataIterator.rowsPerPageAll","value":-1}]
		};
	},
	methods: {
		initTable() {
			let temp = []
			for (let i in this.$store.state.casedetail.content.Gen) {
				temp.push({
					value: false,
					name: i,
					MWMax: this.$store.state.casedetail.content.Gen[i]['Single.MW Max Limit'],
					MWMin: this.$store.state.casedetail.content.Gen[i]['Single.MW Min Limit'],
					MW: 0,
					Mvar: 0,
					MWSetpoint: 0,
					VpuSetpoint: 1
				})
			}
			this.gens = temp;
		},
		updateTable() {}
	},
	mounted() {
		this.initTable();
	}
};
</script>
