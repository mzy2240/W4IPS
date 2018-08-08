<template>
    <div>
        <h1>{{ message }}</h1>
    </div>
</template>

<script>
import mqtt from 'mqtt'

export default {
    name: 'MqttClient',
    data() {
        return {
            client: mqtt.connect('ws://127.0.0.1:8083/mqtt'),
            topic: 'data',
            message: 'Initialized'
        }
    },
    created() {
        // this.client = mqtt.connect('ws://127.0.0.1:8083/mqtt')
        this.client.on('connect', this.onConnect)
        this.client.on('message', this.onMessage)
    },
    methods: {
        onConnect() {
            console.log('onConnect')
            this.client.subscribe(this.topic)
        },
        onMessage(topic, message) {
            //console.log('#' + topic.toString() + '# ' + message.toString())
            this.message = message.toString()
        }
    }
}
</script>

<style scoped>
</style>
