/* eslint-disable */
<template>
    <div id="main" style="width: 1000px;height: 800px;"></div>
</template>

<script>
import echarts from "echarts";
import "echarts-gl/dist/echarts-gl";
mapboxgl.accessToken =
  "pk.eyJ1IjoibXp5MjI0MCIsImEiOiJjamttc3VsODYyZmI4M2ttbGxmbzFudGM2In0.0dy22s32n9eth_63nlX1UA";

export default {
  name: "TEST",
  data() {
    return {
      chart: "",
      linedata: [],
      subdata: []
    };
  },
  methods: {
    initdraw(id) {
      this.chart = echarts.init(document.getElementById(id));
      this.chart.setOption({
        animation: false,
        mapbox: {
          center: [-86.84, 36.44],
          zoom: 6.5,
          // pitch: 50,
          // bearing: -50,
          altitudeScale: 100000000,
          style: "mapbox://styles/mapbox/dark-v9",
          postEffect: {
            enable: true,
            FXAA: {
              enable: true
            }
          },
          light: {
            main: {
              intensity: 1,
              shadow: true,
              shadowQuality: "high"
            },
            ambient: {
              intensity: 0
            }
          }
        },
        series: [
          {
            type: "lines3D",
            coordinateSystem: "mapbox",
            silent: false,
            effect: {
              show: false,
              constantSpeed: 5,
              trailWidth: 2,
              trailLength: 0.4,
              trailOpacity: 1,
              spotIntensity: 10
            },

            blendMode: "lighter",

            polyline: true,

            lineStyle: {
              width: 1,
              color: "rgb(200, 40, 0)",
              opacity: 1
            },
            data: [{
              coords: [[-86.84, 36.44], [-87, 37]],
              count: 1
            }]
          },
          {
          type: "scatter3D",
          name: "sub",
          coordinateSystem: "mapbox",
          symbol: "circle",
          data: [
            {
              name: "X",
              value: [-86.84, 36.44]
            }
          ],
          itemStyle: {
            color: "rgb(200, 40, 0)"
          }
        }
        ]
      });
    },
    getData() {
      const temp = require("../assets/150.json");
      if (temp.content.type == "dsmDictionary") {
        console.log(temp.content);
        this.subdata = temp.content.Substation;
      }
    },
    onDrawSub() {
      console.log(this.chart.getOption());
      this.chart.setOption({
        series: {
          type: "scatter",
          name: "sub",
          coordinateSystem: "mapbox",
          symbol: "circle",
          data: [
            {
              name: "X",
              value: [-86.84, 36.44]
            }
          ],
          itemStyle: {
            color: "red"
          }
        }
      });
    },
    onDrawLines() {}
  },
  mounted() {
    this.$nextTick(function() {
      this.getData();
      this.initdraw("main");
      // this.onDrawSub();
      this.onDrawLines();
    });
  }
};
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>