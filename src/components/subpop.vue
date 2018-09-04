<template>
	<v-dialog v-model="show" max-width="900px">
		<v-toolbar color="cyan" dark tabs>
			<v-toolbar-title>{{name}} {{volt}} {{type}}</v-toolbar-title>
			<v-tabs slot="extension" centered color="cyan" slider-color="yellow">
				<v-tab>
					General
				</v-tab>
				<v-tab v-for="tab in tabs" :key=tab>{{tab}}</v-tab>
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
		{{ children }}
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
		},
		children: {
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
		},
		tabs: function () {
			let temp = [];
			for (var ele in this.children) {
				console.log(this.children[ele]["Int.Bus Number"].toString())
				temp.push('Bus ' + this.children[ele]["Int.Bus Number"].toString())
			}
			return temp;
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
