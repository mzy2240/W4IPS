<template>
	<v-dialog v-model="show" max-width="500px">
		<v-card>
			<v-card-title>
				<span>{{id}} {{volt}} {{type}}</span>
			</v-card-title>
			<v-list dense subheader three-line>
				<v-list-tile v-for="(field, index) in config" v-bind:key="index">
					<v-list-tile-content>
						<v-list-tile-title>{{field}}</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
			</v-list>
			<v-card-actions>
				<v-btn color="primary" flat @click.stop="show=false">Close</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
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
