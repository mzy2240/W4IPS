<template>
	<div>
		<chatpop v-if="chatShow" :visible="chatShow" :topic="chatTopic" @close="chatShow=false"></chatpop>
		<linepop v-if="lineshowDialog" :visible='lineshowDialog' :type='type' :id='id' :name='name' @close="lineshowDialog=false" />
		<subpop v-if="subshowDialog" :visible='subshowDialog' :children='children' :type='type' :id='id' :name='name' @close="subshowDialog=false" />
	</div>
</template>

<script>
import mqtt from 'mqtt';
import { mapGetters } from 'vuex';
import fingerprint from 'fingerprintjs2';
import iziToast from 'izitoast';
import Push from 'push.js';

export default {
	name: 'MqttClient',
	data() {
		return {
			client: null,
			usermessage: 'Initialized',
			datamessage: 'Initialized',
			clientid: null,
			backend_online: null,
			chatShow: false,
			chatTopic: '',
			id: null,
			type: null,
			lineshowDialog: false,
			subshowDialog: false,
			children: {},
			name: ''
		};
	},
	props: {
		subtopic: {
			type: Array || String || Object,
			default: () => ['ds/data', 'ds/note', 'ds/system']
		},
		pubtopic: {
			type: String || Array || Object,
			default: 'user/cmd'
		},
		address: {
			type: String,
			default: '104.254.244.143:8083/mqtt'
		},
		qos: {
			type: Number,
			default: 0
		},
		protocol: {
			type: String,
			define: 'ws'
		},
		username: {
			type: String,
			default: ''
		},
		password: {
			type: String,
			define: ''
		}
	},
	created() {
		this.onInitClient();
	},
	computed: {
		...mapGetters([
			'getPubStatus',
			'getNewSubscribe',
			'getNewPublish',
			'startsimtrigger',
			'pausesimtrigger',
			'abortsimtrigger'
		])
	},
	watch: {
		getPubStatus: function(newVal, oldVal) {
			const temp = {
				user: this.$store.state.username, //this.clientid,
				type: this.$store.state.message[0],
				id: this.$store.state.message[1],
				name: this.$store.state.message[2],
				action: this.$store.state.message[3]
			};
			this.client.publish('user/cmd', JSON.stringify(temp));
			this.$store.commit('addReportUser', {
				time: this.$store.state.currentTime,
				event: [temp.type, temp.id, temp.action]
			});
			if (temp.type == 'Gen' && ['OPEN', 'CLOSE'].includes(temp.action)) {
				const id = temp.id.split(',')[1];
				this.$store.commit(
					'addCost',
					this.$store.state.casedetail.content.Gen[id]['OperationCost']
				);
			}
		},
		getNewSubscribe: function(newVal, oldVal) {
			this.client.subscribe(newVal);
			iziToast.success({
				title: 'System',
				message: 'Successfully subscribed to a new topic #' + newVal,
				// color: 'yellow',
				position: 'topRight'
			});
		},
		getNewPublish: function(newVal, oldVal) {
			this.client.publish(
				newVal[0],
				'User #' + this.$store.state.username + ': ' + newVal[1]
				// 'User #' + this.clientid + ': ' + newVal[1]
			);
		},
		startsimtrigger: function() {
			if (!this.$store.state.simtime) {
				this.client.publish(
					'user/system',
					this.$store.state.username + ':' + 'Start'
				);
			} else {
				this.client.publish(
					'user/system',
					this.$store.state.username +
						':' +
						'run till seconds ' +
						this.$store.state.simtime
				);
				this.$store.commit('clearsimtime');
			}
		},
		pausesimtrigger: function() {
			this.client.publish(
				'user/system',
				this.$store.state.username + ':' + 'Pause'
			);
		},
		abortsimtrigger: function() {
			this.client.publish(
				'user/system',
				this.$store.state.username + ':' + 'Abort'
			);
		},
		backend_online: function() {
			iziToast.success({
				title: 'System',
				message: 'DS backend is connected',
				// color: 'yellow',
				position: 'topRight'
			});
		}
	},
	methods: {
		onInitClient() {
			this.onGetUUID();
			this.client = mqtt.connect(
				this.protocol + '://' + this.address,
				{
					clientId: this.clientid,
					username: this.username,
					password: this.password
				}
			);
			this.client.on('connect', this.onConnect);
			this.client.on('message', this.onMessage);
			this.client.on('close', this.onClose);
			this.client.on('reconnect', this.onReconnect);
			this.client.on('offline', this.onOffline);
			this.client.on('error', this.onError);
			this.client.on('end', this.onEnd);
		},
		onGetUUID() {
			fingerprint().get((result, components) => {
				this.clientid = result.substring(0, 4);
				this.$store.commit('setUUID', this.clientid);
			});
		},
		onConnect(connack) {
			console.log('onConnect');
			this.client.subscribe(this.subtopic);
			iziToast.success({
				title: 'System',
				message: 'MQTT broker is connected',
				// color: 'yellow',
				position: 'topRight'
			});
		},
		onMessage(topic, message) {
			var self = this;
			if (topic == 'ds/data') {
				this.$store.commit('updateRawData', message);
				this.backend_online = true;
			} else if (topic == 'ds/note') {
				const temp = message.toString().split('@');
				this.usermessage = temp[0];
				if (this.$store.state.notMuted) {
					iziToast.warning({
						title: 'System',
						message: this.usermessage,
						position: 'topCenter',
						timeout: 8000,
						buttons: [
							[
								'<button>What?!</button>',
								function() {
									if (self.usermessage.includes('Branch')) {
										self.id = temp[1];
										self.name = temp[2];
										self.type = 'Branch';
										self.lineshowDialog = true;
									} else if (
										self.usermessage.includes('Load') ||
										self.usermessage.includes('Gen') ||
										self.usermessage.includes('Shunt')
									) {
										const busid = temp[1].split(',')[0];
										self.name = temp[2].split('Bus')[0];
										self.type = 'Substation';
										var found;
										// Base on the bus id, find the substation
										for (let subidx in self.$store.state.subDetail) {
											found = self.$store.state.subDetail[subidx].Bus.find(
												function(ele) {
													if (ele['Int.Bus Number'] == busid) {
														self.id = subidx;
														self.children =
															self.$store.state.subDetail[subidx].Bus;
														return true;
													}
												}
											);
											if (found) {
												self.subshowDialog = true;
												break;
											}
										}
									}
								}
							]
						]
					});
					Push.create('System', {
						body: this.usermessage,
						icon: require('../assets/logo.png'),
						timeout: 6000,
						onClick: function() {
							window.focus();
							this.close();
							if (self.usermessage.includes('Branch')) {
								self.id = temp[1];
								self.name = temp[2];
								self.type = 'Branch';
								self.lineshowDialog = true;
							} else if (
								self.usermessage.includes('Load') ||
								self.usermessage.includes('Gen') ||
								self.usermessage.includes('Shunt')
							) {
								const busid = temp[1].split(',')[0];
								self.name = temp[2].split('Bus')[0];
								self.type = 'Substation';
								var found;
								// Base on the bus id, find the substation
								for (let subidx in self.$store.state.subDetail) {
									found = self.$store.state.subDetail[subidx].Bus.find(function(
										ele
									) {
										if (ele['Int.Bus Number'] == busid) {
											self.id = subidx;
											self.children = self.$store.state.subDetail[subidx].Bus;
											return true;
										}
									});
									if (found) {
										self.subshowDialog = true;
										break;
									}
								}
							}
						}
					});
				}

				this.$store.commit('updatebadge');
				this.$store.commit('updatebadgelist', {
					title: this.usermessage,
					source: 'System',
					color: 'yellow',
					time: Date.now()
				});
			} else if (topic == 'ds/system') {
				iziToast.warning({
					title: 'System',
					message: message.toString(),
					// color: 'yellow',
					position: 'topCenter',
					timeout: 8000
				});
				if (
					[
						'The simulation has been aborted',
						'The system goes blackout'
					].includes(message.toString())
				) {
					this.$store.commit('setstartready');
				} else if (message.toString().includes('The simulation is started')) {
					this.$store.commit('resetReport'); // Reset the report when the simulation starts
					this.$store.commit('resetTotalCost');  // Reset the total cost when the simulation starts
					this.$store.commit('setStartTime', +message.toString().split('@')[1]);
					this.$store.commit('setstartdisable');
				}
				this.$store.commit('updatebadge');
				this.$store.commit('updatebadgelist', {
					title: message.toString(),
					source: 'System',
					color: 'red',
					time: Date.now()
				});
			} else {
				iziToast.show({
					title: message.toString().split(':')[0],
					message: message.toString().split(':')[1],
					color: 'yellow',
					position: 'topCenter',
					buttons: [
						[
							'<button>Chat</button>',
							function() {
								self.chatTopic = topic;
								self.chatShow = true;
							}
						]
					]
				});
				this.$store.commit('updatebadge');
				this.$store.commit('updatebadgelist', {
					title: message.toString(),
					source: 'user',
					color: 'light-blue',
					time: Date.now()
				});
			}
		},
		onClose() {
			console.log('onClose');
		},
		onReconnect() {
			console.log('onReconnect');
			iziToast.success({
				title: 'System',
				message: 'MQTT broker is being reconnected',
				// color: 'yellow',
				position: 'topRight'
			});
		},
		onOffline() {
			console.log('onOffline');
			iziToast.error({
				title: 'System',
				message: 'MQTT broker is disconnected',
				// color: 'yellow',
				position: 'topRight'
			});
		},
		onError(error) {
			console.log('onError: ' + error);
		},
		onEnd() {
			console.log('onEnd');
		}
	},
	components: {
		chatpop: () => import('./chatpop'),
		linepop: () => import('./linepop'),
		subpop: () => import('./subpop')
	}
};
</script>

<style scoped>
</style>
