// Dashboard.vue

<template>
	<div>
		<v-navigation-drawer fixed mini-variant app clipped v-model="drawer">
			<v-toolbar flat class="transparent">
				<v-list class="pa-0">
					<v-list-tile avatar :key="'home'" @click="$store.commit('setpage', 'Home')">
						<v-list-tile-avatar>
							<v-icon>mdi-home</v-icon>
						</v-list-tile-avatar>

						<v-list-tile-content>
							<v-list-tile-title>Home</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
					<v-list-tile avatar :key="'generator'" @click="$store.commit('setpage', 'generator')">
						<v-list-tile-avatar>
							<v-icon>mdi-google-glass</v-icon>
						</v-list-tile-avatar>

						<v-list-tile-content>
							<v-list-tile-title>Generator</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
					<v-list-tile avatar :key="'load'" @click="$store.commit('setpage', 'load')">
						<v-list-tile-avatar>
							<v-icon>mdi-lightbulb</v-icon>
						</v-list-tile-avatar>

						<v-list-tile-content>
							<v-list-tile-title>Load</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
					<v-list-tile avatar :key="'shunt'" @click="$store.commit('setpage', 'shunt')">
						<v-list-tile-avatar>
							<v-icon>mdi-currency-usd</v-icon>
						</v-list-tile-avatar>

						<v-list-tile-content>
							<v-list-tile-title>Shunt</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
					<v-list-tile avatar :key="'chat'" @click="dialog=true">
						<v-list-tile-avatar>
							<v-icon>chat</v-icon>
						</v-list-tile-avatar>

						<v-list-tile-content>
							<v-list-tile-title>chat</v-list-tile-title>
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
				<button v-on:click="$store.commit('setpage','Home')">PowerWeb</button>
				<div class="subheading">Powered by PowerWorld Dynamics Studio and EMQ</div>
			</v-toolbar-title>
			<!-- <v-toolbar-items>
			</v-toolbar-items> -->
			<v-spacer></v-spacer>
			<v-btn icon @click="handleFullScreen()">
				<v-icon>fullscreen</v-icon>
			</v-btn>
			<v-menu offset-y origin="center center" class="elelvation-1" :nudge-bottom="14" transition="scale-transition" v-model="show">
				<v-btn icon flat slot="activator" @click="$store.commit('resetbadge')">
					<v-badge color="red" overlap v-model="$store.state.badgeShow">
						<span slot="badge"> {{$store.state.badge}} </span>
						<v-icon medium>notifications</v-icon>
					</v-badge>
				</v-btn>
				<NotificationList></NotificationList>
			</v-menu>
		</v-toolbar>
		<v-content>
			<div class="page-wrapper">
				<component v-bind:is="page"></component>
			</div>

			<!-- <router-view/> -->
		</v-content>
		<MqttClient style="font-size: 12px"></MqttClient>
		<chatpop v-if="dialog" :visible="dialog" @close="dialog=false"></chatpop>
	</div>
</template>

<script>
// import Home from './views/Home';
import generator from '../views/generator-view';
import load from '../views/load-view';
import shunt from '../views/shunt-view';
// import chatpop from './components/chatpop';
import MqttClient from './MqttClient';
import Util from '../util';
// import NotificationList from './components/NotificationList';

export default {
	data() {
		return {
			drawer: true,
			dialog: false,
			show: false
		};
	},
	computed: {
		page() {
			return this.$store.getters.page;
		}
	},
	components: {
		chatpop: () => import('./chatpop'),
		MqttClient,
		Home: () => import('../views/Home'),
		generator: generator,
		load: load,
		shunt: shunt,
		NotificationList: () => import('./NotificationList')
	},
	methods: {
		handleFullScreen() {
			Util.toggleFullScreen();
		}
	},
	watch: {
		show: function(newVal, Val) {
			if (newVal == false) {
				this.$store.commit('resetbadgelist');
			}
		}
	}
};
</script>

<style lang="stylus">
// .anchorBL
// 	display: none;
.page-wrapper
    min-height:calc(100vh - 64px - 50px - 81px );
</style>
