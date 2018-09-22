<template>
    <div>
        <!-- <p>{{ usermessage }}</p> -->
        <!-- <p>{{ datamessage }}</p> -->
    </div>
</template>

<script>
import mqtt from 'mqtt';
import { mapGetters } from 'vuex';
import fingerprint from 'fingerprintjs2';
import { Notification } from 'element-ui';

export default {
	name: 'MqttClient',
	data() {
		return {
			client: null,
			usermessage: 'Initialized',
			datamessage: 'Initialized',
			clientid: null,
			backend_online: null
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
			default: '165.91.215.141:8083/mqtt'
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
		...mapGetters(['getPubStatus', 'getNewSubscribe', 'getNewPublish', 'startsimtrigger'])
	},
	watch: {
		getPubStatus: function(newVal, oldVal) {
			const temp = {
				user: this.clientid,
				type: this.$store.state.message[0],
				id: this.$store.state.message[1],
				name: this.$store.state.message[2],
				action: this.$store.state.message[3]
			};
			this.client.publish('user/cmd', JSON.stringify(temp));
		},
		getNewSubscribe: function(newVal, oldVal) {
			this.client.subscribe(newVal);
			Notification.success({
					title: 'Success',
					message: "Successfully subscribed to a new topic #" + newVal
				})
		},
		getNewPublish: function(newVal, oldVal) {
			this.client.publish(newVal[0], "User #" + this.clientid + ": " + newVal[1]);
		},
		startsimtrigger: function() {
			this.client.publish('user/system', this.clientid + ":" + "Start");
		},
		backend_online: function() {
			Notification.success({
					title: 'DS backend is connected',
					// message: message.toString(),
					iconClass: "el-icon-circle-check-outline",
					duration: 4500
				})
		}
	},
	methods: {
		onInitClient() {
			this.onGetUUID();
			this.client = mqtt.connect(this.protocol + '://' + this.address, {
				clientId: this.clientid,
				username: this.username,
				password: this.password
			});
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
				this.clientid = result.substring(0,4);
				this.$store.commit('setUUID', this.clientid);
			});
		},
		onConnect(connack) {
			console.log('onConnect');
			this.client.subscribe(this.subtopic);
			Notification.success({
					title: 'MQTT broker is connected',
					// message: message.toString(),
					iconClass: "el-icon-circle-check-outline",
					duration: 4000
				})
		},
		onMessage(topic, message) {
			//console.log('#' + topic.toString() + '# ' + message.toString())
			if (topic == 'ds/data') {
				this.$store.commit('updateRawData', message)
				this.backend_online = true
			} else if (topic == 'ds/note') {
				this.usermessage = message.toString();
				// console.log(this.usermessage)
				Notification.warning({
					title: 'Notification',
					message: this.usermessage,
					duration: 5000
				})
				this.$store.commit('updatebadge');
			} else if (topic == 'ds/system') {
				Notification.warning({
					title: message.toString(),
					iconClass: "el-icon-setting",
					duration: 5500
				})
				if (message.toString() == "The simulation has been aborted") {
					this.$store.commit('setstartready')
				} else if (message.toString() == "The simulation is started") {
					this.$store.commit('setstartdisable')
				}
				this.$store.commit('updatebadge');
			} else {
				// Notification.success({
				// 	title: 'User Message',
				// 	message: message.toString(),
				// 	iconClass: "el-icon-sort",
				// 	duration: 5000
				// })
				this.$toast.show(message.toString().split(':')[1], message.toString().split(':')[0], this.$store.state.notificationSystem.options.ballon);
				this.$store.commit('updatebadge');
			}
		},
		onClose() {
			console.log('onClose');
		},
		onReconnect() {
			console.log('onReconnect');
			Notification.success({
					title: 'MQTT broker is reconnected',
					// message: message.toString(),
					iconClass: "el-icon-circle-check-outline",
					duration: 3000
				})
		},
		onOffline() {
			console.log('onOffline');
			Notification.error({
					title: 'MQTT broker is disconnected',
					// message: message.toString(),
					iconClass: "el-icon-circle-close-outline",
					duration: 3000
				})
		},
		onError(error) {
			console.log('onError: ' + error);
		},
		onEnd() {
			console.log('onEnd');
		}
	}
};
</script>

<style scoped>
</style>
