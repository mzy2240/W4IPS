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
			clientid: null
		};
	},
	props: {
		subtopic: {
			type: Array || String || Object,
			default: () => ['data', 'note']
		},
		pubtopic: {
			type: String || Array || Object,
			default: 'user'
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
		...mapGetters(['getPubStatus', 'getNewSubscribe', 'getNewPublish'])
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
			this.client.publish('user', JSON.stringify(temp));
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
		},
		onMessage(topic, message) {
			//console.log('#' + topic.toString() + '# ' + message.toString())
			if (topic == 'data') {
				this.$store.commit('updateRawData', message)
			} else if (topic == 'note') {
				this.usermessage = message.toString();
				// console.log(this.usermessage)
				Notification.warning({
					title: 'Notification',
					message: this.usermessage
				})
			} else {
				Notification.success({
					title: 'User Message',
					message: message.toString(),
					iconClass: "el-icon-sort",
					duration: 5000
				})
			}
		},
		onClose() {
			console.log('onClose');
		},
		onReconnect() {
			console.log('onReconnect');
		},
		onOffline() {
			console.log('onOffline');
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
