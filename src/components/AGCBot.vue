<template>
</template>

<script>
import { mapGetters } from 'vuex';
import _ from 'lodash';

export default {
	data() {
		return {
			anchor: null,
			genDataLength: null,
			show: false,
			marginalcost: [],
			gens: null
		};
	},
	methods: {
		updateAGC() {
			setInterval(() => {
				if (this.$store.state.ACE) {
					var activeunits = [];
					for (let i in this.$store.state.genData) {
						if (this.$store.state.genData[i].AGC) {
							activeunits.push(this.$store.state.genData[i]);
						}
					}
					if (activeunits.length > 0) {
						this.dispatchAGC(activeunits);
					}
				}
			}, 5000);
		},
		dispatchAGC(units) {
			if (units.length > 1) {
                // let sorted_units = _.sortBy(units, 'MarginalCost');
                let sorted_units;
                if(this.$store.state.ACE>0){
                    sorted_units = _.orderBy(units, ['MarginalCost'], ['asc']);
                } else {
                    sorted_units = _.orderBy(units, ['MarginalCost'], ['desc']);
                }
				for (let i in sorted_units) {
					if (
						sorted_units[i].MWMax - sorted_units[i].MW >=
						this.$store.state.ACE
					) {
						this.updateSingleAGC(sorted_units[i]);
						break;
					}
				}
			} else {
				this.updateSingleAGC(units[0]);
			}
		},
		updateSingleAGC(unit) {
			let new_setpoint, command;
			new_setpoint = +(unit.MW + this.$store.state.ACE).toFixed(2);
			command = 'Set Power ' + new_setpoint + ' MW';
			this.$store.commit('setMessage', [
				'Gen',
				unit.name + ',' + unit.id,
				unit.name + '#' + unit.id,
				command
			]);
			this.$store.commit('setPublish');
		}
	},
	created() {
		this.updateAGC();
	}
	// computed: {
	// 	...mapGetters({
	// 		dataflag: 'getDataUpdate'
	// 	})
	// },
	// watch: {
	// 	dataflag: function() {
	// 		this.getMP();
	// 	}
	// }
};
</script>

