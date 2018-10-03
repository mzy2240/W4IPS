<template>
	<v-container grid-list-xs text-xs-center>
		<v-layout row wrap>
			<v-flex d-block xs7 style="height: auto;width:100%;">
				<loadtable></loadtable>
			</v-flex>
			<v-flex d-flex xs5 style="height: 700px;">
				<v-layout row wrap>
					<v-flex style="height:50%;" d-flex xs12>
						<v-card dark color="light-blue">
							<v-card-text class="px-0">Tool1</v-card-text>
						</v-card>
					</v-flex>
					<v-flex style="height:50%;" d-flex xs12>
						<v-card dark color="light-blue">
							<v-card-text class="px-0">Tool2</v-card-text>
						</v-card>
					</v-flex>
				</v-layout>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<style>
.container {
	max-width: 100vw;
	padding: 0px;
	margin: 5px;
}
</style>

<script>
import loadtable from '@/components/LoadTable';

export default {
	name: 'generator',
	components: {
		loadtable
	}
};
</script>