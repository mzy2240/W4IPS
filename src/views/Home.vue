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
import HelloWorld from '@/components/HelloWorld'
import MqttClient from '@/components/MqttClient'
import ApiClient from '@/components/ApiClient'
import mapchart from '@/components/map'

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
