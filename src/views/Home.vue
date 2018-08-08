<template>
  <div class="home">
    <HelloWorld></HelloWorld>
      <MqttClient style="font-size: 12px"></MqttClient>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import MqttClient from '@/components/MqttClient.vue'

export default {
    name: 'home',
    components: {
        HelloWorld,
        MqttClient
    }
}
</script>
