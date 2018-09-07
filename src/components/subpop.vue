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
						<v-data-table :headers=$store.state.fieldstore.Substation :items="display" disable-initial-sort hide-actions class="elevation-1">
						</v-data-table>
					</v-card>
				</v-tab-item>
				<v-tab-item v-for="(item, index) in tabs" :id="'tab-' + item" :key="item" lazy>
					<popchild :name="item" :detail="children[index]" :subname="name"></popchild>
				</v-tab-item>
			</v-tabs-items>
		</v-dialog>
	</div>
</template>

<script>
import popchild from './popchild';
export default {
	data() {
		return {
			dropdown: [],
			currentItem: 'tab-General',
			display: [{
				name: "Realtime",
				value: false,
				GenMW: 0,
				GenMvar: 0,
				ShuntMW: 0,
				ShuntMvar: 0,
				LoadMW: 0,
				LoadMvar: 0,
				FrequencyAve: 60
			}]
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
	methods: {
		getData() {
			const temp = JSON.parse(this.$store.state.rawdata).Data;
			let anchor = 0;
			var arrlength;
			var keyarr;

			for (let ele in this.$store.state.fieldstore) {
				arrlength = this.$store.state.fieldstore[ele].length;
				keyarr = Object.keys(this.$store.state.casedetail.content[ele]);
				if (ele != this.type) {
					console.log('222');
					anchor += arrlength * keyarr.length;
				} else {
					console.log('111');
					anchor += arrlength * keyarr.indexOf(this.id);
					break;
				}
				// console.log(Object.keys(this.$store.state.fieldstore).indexOf(ele))
				// console.log(Object.keys(this.$store.state.casedetail.content[ele]).length)
				// console.log(this.$store.state.fieldstore[ele].length)
			}
			const spdata = temp.slice(anchor, anchor + arrlength);
			let container = {
				value: false,
				name: "Realtime"
			};
			for (let e in spdata) {
				container[this.$store.state.fieldstore[this.type][e]['value']] =
					+spdata[e];
			}
			console.log(container)
			// this.display = [container];
		}
	},
	watch: {
		show: function() {
			if (this.show) {
				this.getData();
			}
		}
	},
	components: {
		popchild
	}
};
</script>
