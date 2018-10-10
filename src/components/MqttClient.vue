<template>
	<div>
		<chatpop v-if="chatShow" :visible="chatShow" :topic="chatTopic" @close="chatShow=false"></chatpop>
		<linepop v-if="lineshowDialog" :visible='lineshowDialog' :type='type' :id='id' :name='name' @close="lineshowDialog=false" />
		<subpop v-if="subshowDialog" :visible='subshowDialog' :children='children' :type='type' :id='id' :name='name' @close="subshowDialog=false" />
		<!-- <linepop v-if="lineshowDialog" :visible='lineshowDialog' :type='type' :id='id' :name='name' :volt='volt' @close="lineshowDialog=false" /> -->
		<!-- <p>{{ usermessage }}</p> -->
		<!-- <p>{{ datamessage }}</p> -->
	</div>
</template>

<script>
import mqtt from 'mqtt';
import { mapGetters } from 'vuex';
import fingerprint from 'fingerprintjs2';
import iziToast from 'izitoast';
// import chatpop from './chatpop';
// import linepop from './linepop';
// import subpop from './subpop';
// import { Notification } from 'element-ui';
import Vue from 'vue'
import VueNativeNotification from 'vue-native-notification'

Vue.use(VueNativeNotification, {
  // Automatic permission request before
  // showing notification (default: true)
  requestOnNotify: true
})

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
			'startsimtrigger'
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
		},
		getNewSubscribe: function(newVal, oldVal) {
			this.client.subscribe(newVal);
			// Notification.success({
			// 		title: 'Success',
			// 		message: "Successfully subscribed to a new topic #" + newVal
			// 	})
			// this.$toast.success(
			// 	'Successfully subscribed to a new topic #' + newVal,
			// 	'System',
			// 	this.$store.state.notificationSystem.options.success
			// );
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
			this.client.publish(
				'user/system',
				this.$store.state.username + ':' + 'Start'
			);
			// this.client.publish('user/system', this.clientid + ':' + 'Start');
		},
		backend_online: function() {
			// Notification.success({
			// 		title: 'DS backend is connected',
			// 		// message: message.toString(),
			// 		iconClass: "el-icon-circle-check-outline",
			// 		duration: 4500
			// 	})
			// this.$toast.success(
			// 	'DS backend is connected',
			// 	'System',
			// 	this.$store.state.notificationSystem.options.success
			// );
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
			// if(!this.clientid) {
			// 	this.clientid = this.$store.state.username;
			// }
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
			// this.clientid = this.$store.state.username;
			// this.$store.commit('setUUID', this.clientid);
		},
		onConnect(connack) {
			console.log('onConnect');
			this.client.subscribe(this.subtopic);
			// Notification.success({
			// 		title: 'MQTT broker is connected',
			// 		// message: message.toString(),
			// 		iconClass: "el-icon-circle-check-outline",
			// 		duration: 4000
			// 	})
			// this.$toast.success(
			// 	'MQTT broker is connected',
			// 	'System',
			// 	this.$store.state.notificationSystem.options.success
			// );
			iziToast.success({
				title: 'System',
				message: 'MQTT broker is connected',
				// color: 'yellow',
				position: 'topRight'
			});
		},
		onMessage(topic, message) {
			//console.log('#' + topic.toString() + '# ' + message.toString())
			var self = this;
			if (topic == 'ds/data') {
				this.$store.commit('updateRawData', message);
				this.backend_online = true;
			} else if (topic == 'ds/note') {
				const temp = message.toString().split('@');
				this.usermessage = temp[0];
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
									// self.children = [self.$store.state.busDetail[+self.id]];
									// Show the substation dialog
									// self.subshowDialog = true
								}
							}
						]
					]
				});
				this.$notification.show(
					'System',
					{
						body: this.usermessage
					},
					{}
				);
				this.$store.commit('updatebadge');
				this.$store.commit('updatebadgelist', {
					title: this.usermessage,
					source: 'System',
					color: 'yellow',
					time: Date.now()
				});
			} else if (topic == 'ds/system') {
				// Notification.warning({
				// 	title: message.toString(),
				// 	iconClass: "el-icon-setting",
				// 	duration: 5500
				// })
				// this.$toast.warning(
				// 	message.toString(),
				// 	'System',
				// 	this.$store.state.notificationSystem.options.warning2
				// );
				iziToast.warning({
					title: 'System',
					message: message.toString(),
					// color: 'yellow',
					position: 'topCenter',
					timeout: 8000
				});
				if (message.toString() == 'The simulation has been aborted') {
					this.$store.commit('setstartready');
				} else if (message.toString() == 'The simulation is started') {
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
				// Notification.success({
				// 	title: 'User Message',
				// 	message: message.toString(),
				// 	iconClass: "el-icon-sort",
				// 	duration: 5000
				// })
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
				// this.$toast.show(message.toString().split(':')[1], message.toString().split(':')[0], this.$store.state.notificationSystem.options.ballon);
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
			// Notification.success({
			// 	title: 'MQTT broker is being reconnected',
			// 	// message: message.toString(),
			// 	iconClass: 'el-icon-circle-check-outline',
			// 	duration: 3000
			// });
			iziToast.success({
				title: 'System',
				message: 'MQTT broker is being reconnected',
				// color: 'yellow',
				position: 'topRight'
			});
		},
		onOffline() {
			console.log('onOffline');
			// Notification.error({
			// 	title: 'MQTT broker is disconnected',
			// 	// message: message.toString(),
			// 	iconClass: 'el-icon-circle-close-outline',
			// 	duration: 3000
			// });
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
