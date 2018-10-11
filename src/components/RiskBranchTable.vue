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
				<v-data-table :headers="headers" :items="data" hide-actions item-key="name">
					<template slot="items" slot-scope="props">
						<tr @click="props.expanded = !props.expanded" @mouseover="onMapInteraction(props.item)" @mouseout="offMapInteraction(props.item)">
							<td class="text-xs-left">{{ props.item.name }}</td>
							<td class="text-xs-right">
								<v-chip label small :color="getColorByRatio(props.item.Ratio)" text-color="white">{{ props.item.Ratio }}</v-chip>
							</td>
							<td class="text-xs-right">{{ props.item.MVA }}</td>
							<td class="text-xs-right">{{ props.item.MVALimit }}</td>
						</tr>
					</template>
				</v-data-table>
			</template>
			<v-divider></v-divider>
		</v-card-text>
	</v-card>
</template>

<style>
/* table.v-table tbody td:first-child,
table.v-table tbody td:not(:first-child),
table.v-table tbody th:first-child,
table.v-table tbody th:not(:first-child),
table.v-table thead td:first-child,
table.v-table thead td:not(:first-child),
table.v-table thead th:first-child,
table.v-table thead th:not(:first-child) {
	padding: 0 10px;
}
.tablediv {
	z-index: 0;
	height: 300px;
	width: 100%;
} */
</style>

<script>
export default {
	props: {
		data: Array,
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
				{ text: 'Ratio (%)', value: 'Ratio' },
				{ text: 'MVA', value: 'MVA' },
				{ text: 'MVA Limit', value: 'MVALimit' }
			],
			branches: [],
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
		getColorByRatio(ratio) {
			var temp;
			if(ratio > 100) {
				temp = 'red';
			} else if (ratio > 90) {
				temp = 'orange';
			} else if (ratio > 80) {
				temp = 'yellow'
			}
			return temp;
		},
		onMapInteraction(item) {
			const temp = {name: item.name, coords: item.coords};
			this.$store.commit('addLine', temp);
		},
		offMapInteraction(item) {
			const temp = {name: item.name, coords: item.coords};
			this.$store.commit('removeLine', item);
		}
	},
	created() {
		// this.initTable();
	},
	mounted() {

	}
};
</script>
