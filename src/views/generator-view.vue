<template>
	<div>
		<v-layout row class="align-center layout px-4 pt-4 app--page-header">
			<div class="page-header-left">
				<h3 class="pr-3">Generator</h3>
			</div>
			<v-breadcrumbs divider="-">
				<v-breadcrumbs-item>
					<v-icon larg>mdi-google-glass</v-icon>
				</v-breadcrumbs-item>
			</v-breadcrumbs>
			<v-spacer></v-spacer>
			<div class="page-header-right">
				<h4 class="pr-1">
					Hi {{$store.state.username}}  
					<status-indicator :negative="$store.state.alarm" :positive="!$store.state.alarm" pulse></status-indicator>
				</h4>
			</div>
		</v-layout>
		<v-container grid-list-xl text-xs-center fluid>
			<v-layout row wrap>
				<v-flex lg8 sm12 xs12>
					<!-- <v-widget title="Realtime Data" content-bg="white">
						<div slot="widget-content"> -->
							<gentable title="Realtime Data"></gentable>
						<!-- </div>
					</v-widget> -->
				</v-flex>
				<v-flex lg4 sm12 xs12>
					<v-layout row wrap>
						<v-flex>
              				<v-layout row wrap>
                  				<v-flex sm6 xs6 white--text>
									<div class="text-sm-center primary card">
										<div class="caption pt-3">Total Cost</div>
										<span class="headline">${{ $store.state.totalCost }}</span>
									</div>
								</v-flex>
								<v-flex sm6 xs6 white--text>
									<div class="align-center text-sm-center green card">
										<div class="caption pt-3">ACE</div>
										<span class="headline">{{ $store.state.ACE }}MW</span>
									</div>
								</v-flex>
							</v-layout>
						</v-flex>
						<v-flex lg12 sm12 xs12>
							<chartStatistic id="UTC" min=null max=null left="13%" title="Current Cost ($/h)" icon="attach_money" card-color="indigo" :chart-color="[color.indigo.lighten1]" :costData='$store.state.unitTimeCost' type="line"></chartStatistic>
						</v-flex>
						<v-flex lg12 sm12 xs12>
							<chartStatistic id="ATC" min=null max=null left="8%" :precision=1 title="Average Total Cost ($/MWh)" icon="attach_money" card-color="pink" :chart-color="[color.pink.darken1, 'rgba(255,255,255,0.3)']" :costData='+($store.state.totalCost/$store.state.totalMWh).toFixed(2)' type="line"></chartStatistic>
						</v-flex>
						<v-flex lg12 sm12 xs12>
							<MapWidget title="Location Assist"></MapWidget>
						</v-flex>
					</v-layout>
				</v-flex>
			</v-layout>
		</v-container>
	</div>

</template>

<style>
/* .container {
	max-width: 100vw;
	padding: 0px;
	margin: 5px;
} */
.cardiv {
	height: 300px;
	width: 100%;
}
.card {
	height: 100px;
}
</style>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld';
// import ApiClient from '@/components/ApiClient';
// import mapchart from '@/components/map';
import gentable from '@/components/GenTable';
import VWidget from '@/components/VWidget';
import chartStatistic from '@/components/chartStatistic2';
import Material from 'vuetify/es5/util/colors';
import MapWidget from '@/components/MapWidget'

export default {
	name: 'generator',
	data() {
		return {
			color: Material
		};
	},
	components: {
		// HelloWorld,
		// ApiClient,
		// mapchart,
		gentable,
		VWidget,
		chartStatistic,
		MapWidget
	}
};
</script>
