<template>
  <div class="home">
    <HelloWorld></HelloWorld>
    <mapchart></mapchart>
      <MqttClient  style="font-size: 12px"></MqttClient>
    <ApiClient></ApiClient>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import MqttClient from '@/components/MqttClient.vue'
import ApiClient from '@/components/ApiClient.vue'
import mapchart from '@/components/map.vue'

export default {
    name: 'home',
    components: {
        HelloWorld,
        MqttClient,
        ApiClient,
        mapchart
    }
}
</script>
