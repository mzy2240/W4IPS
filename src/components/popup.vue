<template>
	<v-dialog v-model="show" max-width="900px">
		<v-toolbar color="cyan" dark tabs>
			<v-toolbar-title>{{name}} {{volt}} {{type}}</v-toolbar-title>
			<v-tabs slot="extension" centered color="cyan" slider-color="yellow">
				<v-tab v-for="i in 3" :key="i" :href="`#tab-${i}`">
					Item {{ i }}
				</v-tab>
			</v-tabs>
		</v-toolbar>
		<v-card>
			<v-card-title class='headline'>
				Data
			</v-card-title>
			<v-data-table :headers="headers" :items="data" disable-initial-sort hide-actions class="elevation-1">
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
		name: {
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
					callback: () => {
						console.log(this.commands[jj]);
						this.$store.commit('setMessage', [
							this.type,
							this.id,
							this.name,
							this.commands[jj]
						]);
						this.$store.commit('setPublish');
					}
				});
			}
			this.dropdown = temp2;
		}
	}
};
</script>
