<template>
	<v-dialog v-model="show" max-width="900px">
		<v-card>
			<v-card-title>
				<span class="headline">{{id}} {{volt}} {{type}}</span>
			</v-card-title>
			<v-toolbar flat color="white">
				<v-toolbar-title>Data</v-toolbar-title>
			</v-toolbar>
			<v-data-table :headers="headers" :items="data" disable-initial-sort hide-actions class="elevation-1">
			</v-data-table>
			<v-toolbar flat color="white">
				<v-toolbar-title>Control</v-toolbar-title>
			</v-toolbar>
			<v-overflow-btn dense :items="dropdown" label="Commands" segmented target="#dropdown-example"></v-overflow-btn>
			<!-- <v-list dense subheader three-line>
				<v-list-tile v-for="(field, index) in config" v-bind:key="index">
					<v-list-tile-content>
						<v-list-tile-title>{{field}}</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
			</v-list> -->
			<v-card-actions>
				<v-btn color="primary" flat @click.stop="show=false">Close</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	data() {
		return {
			headers: [],
			dropdown: []
		};
	},
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		type: {
			type: String
		},
		id: {
			type: String
		},
		volt: {
			type: String
		},
		config: {
			type: Array
		},
		data: {
			default: function() {
				return [];
			}
		},
		commands: {
			default: function() {
				return [];
			}
		}
	},
	computed: {
		show: {
			get() {
				return this.visible;
			},
			set(value) {
				if (!value) {
					this.$emit('close');
				}
			}
		}
	},
	watch: {
		config: function() {
			let temp = [];
			for (var i in this.config) {
				temp.push({
					text: this.config[i],
					value: this.config[i]
				});
			}
			this.headers = temp;
			let temp2 = [];
			for (var j in this.commands) {
				let jj = j;
				temp2.push({
					text: this.commands[j],
					callback: () => console.log(this.commands[jj])
				});
			}
			this.dropdown = temp2;
		}
	}
};
</script>
