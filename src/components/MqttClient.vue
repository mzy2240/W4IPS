<template>
    <div>
        <h1>{{ message }}</h1>
    </div>
</template>

<script>
import mqtt from 'mqtt'
import fingerprint from 'fingerprintjs2'

export default {
    name: 'MqttClient',
    data() {
        return {
            client: null,
            message: 'Initialized',
            clientid: null
        }
    },
    props: {
        topic: {
            type: String || Array || Object,
            default: 'data'
        },
        address: {
            type: String,
            default: '127.0.0.1:8083/mqtt'
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
        this.onInitClient()
    },
    methods: {
        onInitClient() {
            this.onGetUUID()
            this.client = mqtt.connect(
                this.protocol + '://' + this.address,
                {
                    clientId: this.clientid,
                    username: this.username,
                    password: this.password
                }
            )
            this.client.on('connect', this.onConnect)
            this.client.on('message', this.onMessage)
            this.client.on('close', this.onClose)
            this.client.on('reconnect', this.onReconnect)
            this.client.on('offline', this.onOffline)
            this.client.on('error', this.onError)
            this.client.on('end', this.onEnd)
        },
        onGetUUID() {
            fingerprint().get((result, components) => {
                this.clientid = result
            })
        },
        onConnect(connack) {
            console.log('onConnect')
            this.client.subscribe(this.topic, { qos: this.qos })
        },
        onMessage(topic, message) {
            //console.log('#' + topic.toString() + '# ' + message.toString())
            this.message = message.toString()
        },
        onClose() {
            console.log('onClose')
        },
        onReconnect() {
            console.log('onReconnect')
        },
        onOffline() {
            console.log('onOffline')
        },
        onError(error) {
            console.log('onError: ' + error)
        },
        onEnd() {
            console.log('onEnd')
        }
    }
}
</script>

<style scoped>
</style>
