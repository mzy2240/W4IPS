// App.vue

<template>
	<v-app class="app">
		<Spinner v-if="loading" name="pacman" color="#2243a5" class="loading" />
		<dashboard v-bind:style="styleDashboard"></dashboard>
	</v-app>
</template>

<script>
import Spinner from 'vue-spinkit';
const dashboard = import('./components/Dashboard');
const loadingComponent = {
	render(h) {
		return <Spinner name="pacman" color="#2243a5" class="loading" />;
	}
};
// const loadingComponent = { template: `<h1>Loading...</h1>` }
// import dashboard from './components/Dashboard';

export default {
	data() {
		return {
			loading: true,
			styleDashboard: {
				position: 'absolute',
				filter: 'blur(5px)',
				width: '100%'
			}
		};
	},
	components: {
		Spinner: Spinner,
		dashboard: () => ({
			component: dashboard,
			// component: new Promise(resolve => {
			// 	setTimeout(() => {
			// 		resolve(dashboard);
			// 	}, 3000);
			// }),
			loading: loadingComponent,
			delay: 0
		})
	},
	mounted() {
		setTimeout(() => {
			this.loading = false;
		}, 3000);
		setTimeout(() => {
			this.styleDashboard = {
				position: 'absolute',
				width: '100%'
			};
		}, 3200);
	}
};
</script>

<style>
.loading {
	position: fixed;
	z-index: 999;
	height: 2em;
	width: 2em;
	overflow: show;
	margin: auto;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
}
/* .dashboard {
	filter:blur(5px);
} */
</style>

