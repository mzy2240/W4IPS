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
						<v-data-table :headers=$store.state.fieldstore.Substation :items="display" disable-initial-sort hide-actions class="elevation-1" lazy>
							<template slot="items" slot-scope="props">
								<td class="text-xs-right" v-for="item in props.item" :key=item.text>{{ item }}</td>
								<!-- <td class="text-xs-right">{{ props.item.GenMvar }}</td>
								<td class="text-xs-right">{{ props.item.LoadMW }}</td>
								<td class="text-xs-right">{{ props.item.LoadMvar }}</td>
								<td class="text-xs-right">{{ props.item.ShuntMW }}</td>
								<td class="text-xs-right">{{ props.item.ShuntMvar }}</td>
								<td class="text-xs-right">{{ props.item.FrequencyAve }}</td> -->
							</template>
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
import { mapGetters } from 'vuex';

export default {
	data() {
		return {
			dropdown: [],
			currentItem: 'tab-General',
			display: [],
			watch_switch: null
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
		...mapGetters(
			{
			dataflag: 'getDataUpdate'
		}
		),
		show: {
			get() {
				return this.visible;
			},
			set(value) {
				if (!value) {
					this.display = [];
					this.$emit('close');
				}
			}
		},
		tabs: function() {
			let temp = [];
			for (var ele in this.children) {
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
					anchor += arrlength * keyarr.length;
				} else {
					anchor += arrlength * keyarr.indexOf(this.id);
					break;
				}
				// console.log(Object.keys(this.$store.state.fieldstore).indexOf(ele))
				// console.log(Object.keys(this.$store.state.casedetail.content[ele]).length)
				// console.log(this.$store.state.fieldstore[ele].length)
			}
			const spdata = temp.slice(anchor, anchor + arrlength);
			let container = {};
			for (let e in spdata) {
				container[
					this.$store.state.fieldstore[this.type][e]['value']
				] = +spdata[e];
			}
			this.display = [container];
		}
	},
	watch: {
		dataflag: function() {
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
