// App.vue

<template>
	<v-app>
		<dashboard></dashboard>
	</v-app>
</template>

<script>
import Spinner from 'vue-spinkit';
const dashboard = import('./components/Dashboard');
const loadingComponent = { render(h) {return (<Spinner name="pacman" color="#2243a5" class="loading"/>)}};
// const loadingComponent = { template: `<h1>Loading...</h1>` }
// import dashboard from './components/Dashboard';

export default {
	data() {
		return {
			loading: true
		};
	},
	components: {
		Spinner: Spinner,
		dashboard: () => ({
			component: new Promise(resolve => {
				setTimeout(() => {
					resolve(dashboard);
				}, 3000);
			}),
			loading: loadingComponent,
			delay: 0
		})
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
</style>

