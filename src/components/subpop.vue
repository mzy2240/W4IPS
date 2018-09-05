<template>
	<v-dialog v-model="show" :key='id' max-width="900px">
		<v-toolbar color="cyan" dark tabs>
			<v-toolbar-title>{{name}} {{volt}} {{type}}</v-toolbar-title>
			<v-tabs slot="extension" v-model="currentItem" centered color="cyan" slider-color="yellow">
				<v-tab :key="'General'" :href="'#tab-General'">General</v-tab>
				<v-tab v-for="item in tabs" :key=item :href="'#tab-' + item">{{item}}</v-tab>
			</v-tabs>
		</v-toolbar>
		<v-tabs-items v-model="currentItem">
			<v-tab-item :id="'tab-General'" :key="'General'" lazy>
				<v-card>
					<v-card-title class='headline'>
						Data
					</v-card-title>
					<v-data-table :headers=$store.state.fieldstore.Sub :items="data" disable-initial-sort hide-actions class="elevation-1">
					</v-data-table>
					<v-card-title class='headline'>
						Control
					</v-card-title>
					<v-overflow-btn dense :items="dropdown" label="Commands" segmented target="#dropdown-example"></v-overflow-btn>
					<v-card-actions>
						<v-btn color="primary" flat @click.stop="show=false">Close</v-btn>
					</v-card-actions>
				</v-card>
			</v-tab-item>
			<v-tab-item v-for="(item, index) in tabs" :id="'tab-' + item" :key="item" lazy>
				<popchild :name="item" :detail="children[index]"></popchild>
			</v-tab-item>
		</v-tabs-items>
		{{ children }}
	</v-dialog>
</template>

<script>
import popchild from './popchild';
export default {
	data() {
		return {
			dropdown: [],
			currentItem: 'tab-General'
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
		children: {}
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
		tabs: function() {
			let temp = [];
			for (var ele in this.children) {
				console.log(this.children[ele]['Int.Bus Number'].toString());
				temp.push('Bus ' + this.children[ele]['Int.Bus Number'].toString());
			}
			return temp;
		}
	},
	watch: {
		config: function() {
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
	},
	components: {
		popchild
	}
};
</script>
