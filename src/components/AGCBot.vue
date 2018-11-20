<template>
</template>

<script>
import { mapGetters } from 'vuex';
import _ from 'lodash';
import * as math from 'mathjs';

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
				if (this.$store.state.status == 'running') {
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
				}
			}, 5000);
		},
		dispatchAGC(units) {
			if (units.length > 1) {
				// let sorted_units = _.sortBy(units, 'MarginalCost');
				let sorted_units;
				if (this.$store.state.ACE > 0) {
					sorted_units = _.orderBy(units, ['MarginalCost'], ['asc']);
				} else {
					sorted_units = _.orderBy(units, ['MarginalCost'], ['desc']);
				}
				for (let i in sorted_units) {
					if (sorted_units[i].MWSetpoint < sorted_units[i].MWMax) {
						this.updateSingleAGC(sorted_units[i]);
						break;
					}
				}
			} else {
				this.updateSingleAGC(units[0]);
			}
		},
		updateSingleAGC(unit) {
			if (unit.MWSetpoint < unit.MWMax) {
				let new_setpoint, command;
				new_setpoint = math.min(
					unit.MWMax,
					+(unit.MW + this.$store.state.ACE).toFixed(2)
				);
				command = 'Set Power ' + new_setpoint + ' MW';
				this.$store.commit('setMessage', [
					'Gen',
					unit.key + ',' + unit.id,
					unit.key + '#' + unit.id,
					command
				]);
				this.$store.commit('setPublish');
				this.$store.commit('addReportUser', {
					time: this.$store.state.currentTime,
					event: ['AGC', unit.key + ',' + unit.id, command]
				});
			}
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

