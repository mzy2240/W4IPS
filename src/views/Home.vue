<template>
  <div>
    <!-- <HelloWorld></HelloWorld> -->
    <directchart></directchart>
    <!-- <mapchart></mapchart> -->
      <!-- <MqttClient  style="font-size: 12px"></MqttClient> -->
    <!-- <ApiClient></ApiClient> -->
  </div>
</template>

<style>
.chart {
  height: 800px;
  width: 800px;
}
</style>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld'
import MqttClient from '@/components/MqttClient'
import ApiClient from '@/components/ApiClient'
import mapchart from '@/components/map'
import directchart from '@/components/puremap'

export default {
    name: 'home',
    components: {
        HelloWorld,
        MqttClient,
        ApiClient,
        mapchart,
        directchart
    }
}
</script>
