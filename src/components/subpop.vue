<template>
	<div>
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
					</v-card>
				</v-tab-item>
				<v-tab-item v-for="(item, index) in tabs" :id="'tab-' + item" :key="item" lazy>
					<popchild :name="item" :detail="children[index]"></popchild>
				</v-tab-item>
			</v-tabs-items>
			{{ children }}
		</v-dialog>
	</div>
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
		data: {
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
	components: {
		popchild
	}
};
</script>
