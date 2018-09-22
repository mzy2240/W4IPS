<template>
	<v-card class="elevation-0">
		<v-toolbar card dense color="transparent">
			<v-toolbar-title>
				<h4>Notification</h4>
			</v-toolbar-title>
		</v-toolbar>
		<v-divider></v-divider>
		<v-card-text class="pa-0">
			<v-list three-line dense class="pa-0">
				<template v-for="(item, index) in $store.state.badgelist">
					<v-subheader v-if="item.header" :key="item.header">{{ item.header }}</v-subheader>
					<v-list-tile avatar v-else :key="item.time" @click="handleClick">
						<v-list-tile-avatar :color="item.color">
							<v-icon dark>{{item.icon}}</v-icon>
						</v-list-tile-avatar>
						<v-list-tile-content class="list_tile_sub_title">
							<v-list-tile-sub-title v-html="item.title"></v-list-tile-sub-title>
						</v-list-tile-content>
						<v-list-tile-action class="caption">
							{{item.time}}
						</v-list-tile-action>
					</v-list-tile>
					<v-divider :key="index"></v-divider>
				</template>
			</v-list>
			<v-divider></v-divider>
			<v-btn block flat class="ma-0" @click="cleanclear">Clear</v-btn>
			<v-divider></v-divider>
		</v-card-text>
	</v-card>
</template>

<style scoped>
.list_tile_sub_title {
	max-width: 300px;
}

</style>

<script>
export default {
	data: function() {
		return {
			// items: this.$store.state.badgelist
		}
	},
	methods: {
		handleClick: e => {
			console.log(e);
		},
		cleanclear: function() {
			console.log("Yeah");
			this.$store.commit("resetbadgelist");
		}
	}
};
</script>
