<template>
	<v-layout row justify-center>
		<v-dialog v-model="show" max-width="500px">
			<v-card>
				<v-card-title>
					<span class="title">Report</span>
				</v-card-title>
				<v-card-text>
					<v-textarea name="input-7-1" v-model="comment" box label="Comment (optional)" auto-grow></v-textarea>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="blue darken-1" flat @click.native="activate">Download</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-layout>
</template>

<style>
</style>

<script>
export default {
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		topic: {
			default: ''
		}
	},
	data() {
		return {
			content: '',
			time: null,
			comment: null,
			rules: {
				prohibited: value =>
					(value != 'data' && value != 'user' && value != 'note') ||
					'Cannot use the reserved topic'
			}
		};
	},
	computed: {
		show: {
			get() {
				return this.visible;
			},
			set(value) {
				if (!value) {
					this.display = [];
					this.childshow = false;
					this.$emit('close');
				}
			}
		}
	},
	methods: {
		activate() {
			this.$store.commit('setReportName', this.$store.state.username);
			this.$store.commit('setReportComment', this.comment);

			const report = JSON.stringify({Time: new Date(), Content: this.$store.state.report});
			const blob = new Blob([report], { type: 'text/plain' });
			const e = document.createEvent('MouseEvents'),
				a = document.createElement('a');
			a.download = 'UIN-Name-CaseX.json';
			a.href = window.URL.createObjectURL(blob);
			a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
			e.initEvent(
				'click',
				true,
				false,
				window,
				0,
				0,
				0,
				0,
				0,
				false,
				false,
				false,
				false,
				0,
				null
			);
			a.dispatchEvent(e);
			this.show = false;
		}
		// enterClicked() {
		// 	this.activate();
		// }
	}
};
</script>
