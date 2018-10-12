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
						<v-flex lg12 sm12 xs12>
							<v-widget title="Tool1" content-bg="white">
								<div slot="widget-content" class='cardiv'>
									<v-card dark color="light-blue">
										<v-card-text class="px-0">Tool1</v-card-text>
									</v-card>
								</div>
							</v-widget>
						</v-flex>
						<v-flex lg12 sm12 xs12>
							<v-widget title="Tool2" content-bg="white">
								<div slot="widget-content" class='cardiv'>
									<v-card dark color="light-blue">
										<v-card-text class="px-0">Tool2</v-card-text>
									</v-card>
								</div>
							</v-widget>
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
</style>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld';
// import ApiClient from '@/components/ApiClient';
// import mapchart from '@/components/map';
import gentable from '@/components/GenTable';
import VWidget from '@/components/VWidget';

export default {
	name: 'generator',
	components: {
		// HelloWorld,
		// ApiClient,
		// mapchart,
		gentable,
		VWidget
	}
};
</script>
