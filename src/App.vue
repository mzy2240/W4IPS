// App.vue

<template>
	<v-app>
		<v-navigation-drawer fixed mini-variant app clipped v-model="drawer">
			<v-toolbar flat class="transparent">
				<v-list class="pa-0">
					<v-list-tile avatar :key="'chat'" @click="dialog=true">
						<v-list-tile-avatar>
							<v-icon>chat</v-icon>
						</v-list-tile-avatar>

						<v-list-tile-content>
							<v-list-tile-title>Configure</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
					<v-list-tile avatar :key="'start'" v-if="$store.state.ready4start" @click="$store.commit('trigstartsim')">
						<v-list-tile-avatar>
							<v-icon>play_arrow</v-icon>
						</v-list-tile-avatar>

						<v-list-tile-content>
							<v-list-tile-title>Start</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
				</v-list>
			</v-toolbar>
		</v-navigation-drawer>
		<v-toolbar color="blue darken-3" dark app :clipped-left="$vuetify.breakpoint.mdAndUp" fixed>
			<v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
			<v-toolbar-title class="white--text">
				PowerWeb
				<div class="subheading">Powered by PowerWorld Dynamics Studio and EMQ</div>
			</v-toolbar-title>
			<v-toolbar-items>
			</v-toolbar-items>
		</v-toolbar>
		<v-content>
			<router-view/>
		</v-content>
		<chatpop v-if="dialog" :visible="dialog" @close="dialog=false"></chatpop>
	</v-app>
</template>

<script>
import chatpop from './components/chatpop';

export default {
	data() {
		return {
			drawer: false,
			dialog: false
		};
	},
	components: {
		chatpop
	}
};
</script>

<style>
.anchorBL {
	display: none;
}
</style>
