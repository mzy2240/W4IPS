<template>
	<div>
		<v-app v-if="showDash" class="app">
			<dashboard v-if="showDash"></dashboard>
		</v-app>
		<!-- <v-app class="app"></v-app> -->
		<v-app v-else id="login" class="primary">
			<v-content>
				<v-container fluid fill-height>
					<v-layout align-center justify-center>
						<v-flex xs12 sm8 md4 lg4>
							<v-card class="elevation-1 pa-3">
								<v-card-text>
									<div class="layout column align-center">
										<img src="../assets/logo.png" alt="Vue Material Admin" width="120" height="120">
										<h1 class="flex my-4 primary--text">PowerWeb</h1>
									</div>

									<v-form id="step1">
										<v-text-field append-icon="person" name="login" label="Login" type="text" v-model="model.username"></v-text-field>
										<v-text-field append-icon="lock" name="password" label="Password" id="password" type="password" v-model="model.password"></v-text-field>
										<v-select :items="items" label="Area" v-model="area"></v-select>
									</v-form>
								</v-card-text>
								<v-card-actions id="step2">
									<v-checkbox label="Administrator" v-model="checkbox"></v-checkbox>
									<v-spacer></v-spacer>
									<v-btn block color="primary" @click="login" :loading="loading">Login</v-btn>
								</v-card-actions>
							</v-card>
						</v-flex>
					</v-layout>
				</v-container>
			</v-content>
		</v-app>
	</div>
</template>

<style>
styleDash {
	position: 'absolute';
	width: '100%';
}
</style>

<style scoped lang="css">
/* #login {
	height: 50%;
	width: 100%;
	position: absolute;
	top: 0;
	left: 0;
	content: '';
	z-index: 0;
} */
</style>

<script>
import Spinner from 'vue-spinkit';
const dashboard = import('../components/Dashboard');
const loadingComponent = {
	render(h) {
		return <Spinner name="pacman" color="#2243a5" class="loading" />;
	}
};

export default {
	data() {
		return {
			loading: false,
			model: {
				username: 'Admin',
				password: 'password'
			},
			showDash: false,
			items: Object.keys(this.$store.state.casedetail.content.Area).concat([
				'Not specified'
			]),
			checkbox: false,
			area: null
		};
	},
	methods: {
		login() {
			if (this.checkbox) {
				this.$store.commit('onAdmin');
			}
			this.$store.commit('setArea', this.area);
			this.$store.commit('setUsername', this.model.username);
			this.loading = true;
			setTimeout(() => {
				this.showDash = true;
				// this.$router.push('/dashboard');
			}, 1000);
		}
	},
	mounted() {
	},
	components: {
		Spinner,
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
	}
};
</script>

