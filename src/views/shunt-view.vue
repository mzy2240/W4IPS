<template>
	<div>
		<v-layout row class="align-center layout px-4 pt-4 app--page-header">
			<div class="page-header-left">
				<h3 class="pr-3">Shunt</h3>
			</div>
			<v-breadcrumbs divider="-">
				<v-breadcrumbs-item>
					<v-icon larg>mdi-currency-usd</v-icon>
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
							<shunttable title="Realtime Data"></shunttable>
						<!-- </div>
					</v-widget> -->
				</v-flex>
				<v-flex lg4 sm12 xs12>
					<v-layout row wrap>
						<v-flex lg12 sm12 xs12>
							<bustable title="Violating Buses"></bustable>
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
</style>

<script>
import shunttable from '@/components/ShuntTable';
import bustable from '@/components/RiskBusTable';
import VWidget from '@/components/VWidget';
import MapWidget from '@/components/MapWidget'

export default {
	name: 'generator',
	components: {
		shunttable,
		VWidget,
		bustable,
		MapWidget
	}
};
</script>
