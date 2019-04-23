<template>
	<marquee-text :repeat="30" :duration="10" :key="$store.state.status">
		<span :style="style">{{ content }}</span>
	</marquee-text>
</template>

<script>
import MarqueeText from 'vue-marquee-text-component';

export default {
	data() {
		return {
			style: ''
		};
	},
	mounted() {},
	computed: {
		content() {
			if (this.$store.state.status === 'running') {
				this.style =
					'background-color: #800026; padding-right:30px; box-sizing:border-box;';
				return 'G Index: G5 (Extreme)';
			} else if (this.$store.state.status === 'paused') {
				this.style =
					'background-color: #ffff8b; padding-right:30px; box-sizing:border-box;';
				return 'PAUSED';
			} else if (this.$store.state.status === 'initialized') {
				this.style =
					'background-color: #ffff8b; padding-right:30px; box-sizing:border-box;';
				return 'INITIALIZED';
			} else if (this.$store.state.status === 'aborted') {
				this.style =
					'background-color: #be9c91; padding-right:30px; box-sizing:border-box;';
				return 'ABORTED';
			} else if (this.$store.state.status === 'finished') {
				this.style =
					'background-color: #ff5f52; padding-right:30px; box-sizing:border-box;';
				return 'FINISHED';
			} else if (this.$store.state.status === 'offline') {
				this.style =
					'background-color: #8e8e8e; padding-right:30px; box-sizing:border-box;';
				return 'OFFLINE';
			} else if (this.$store.state.status === 'error') {
				this.style =
					'background-color: #ff6f60; padding-right:30px; box-sizing:border-box;';
				return 'DS needs to be reset manually';
			}
		}
	},
	components: {
		MarqueeText
	}
};
</script>

<style>
</style>

