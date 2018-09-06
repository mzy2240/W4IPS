<template>
	<v-dialog v-model="show" :key='id' max-width="900px">
		<v-toolbar color="cyan" dark tabs>
			<v-toolbar-title>{{name}} {{volt}} {{type}}</v-toolbar-title>
			<v-tabs slot="extension" centered color="cyan" slider-color="yellow">
				<v-tab>
					General
				</v-tab>
			</v-tabs>
		</v-toolbar>
		<v-card>
			<v-card-title class='headline'>
				Data
			</v-card-title>
			<v-data-table :headers=$store.state.fieldstore.Branch :items="data" disable-initial-sort hide-actions class="elevation-1">
			</v-data-table>
			<v-card-title class='headline'>
				Control
			</v-card-title>
			<v-overflow-btn dense :items="dropdown" label="Commands" segmented target="#dropdown-example"></v-overflow-btn>
			<v-card-actions>
				<v-btn color="primary" flat @click.stop="show=false">Close</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	data() {
		let temp = [];
		for (var j in this.$store.state.tcmcommands.Branch) {
			let jj = j;
			temp.push({
				text: this.$store.state.tcmcommands.Branch[j],
				callback: () => {
					console.log(this.type, this.id, this.name);
					this.$store.commit('setMessage', [
						this.type,
						this.id,
						this.name,
						this.$store.state.tcmcommands.Branch[jj]
					]);
					this.$store.commit('setPublish');
				}
			});
		}
		return {
			dropdown: temp
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
		name: {
			type: String
		},
		volt: {
			type: String
		},
		data: {
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
	}
};
</script>
