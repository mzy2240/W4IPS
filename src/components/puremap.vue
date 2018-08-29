/* eslint-disable */
<template>
    <div id="main" style="width: 1000px;height: 800px;"></div>
</template>

<script>
import echarts from "echarts";
import "echarts-gl/dist/echarts-gl";
// import _ from 'lodash';
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
        bmap: {
          center: [-86.84, 36.44],
          zoom: 8,
          roam: true
        },
        // mapbox: {
        //   center: [-86.84, 36.44],
        //   zoom: 6.5,
        //   // pitch: 50,
        //   // bearing: -50,
        //   altitudeScale: 100000000,
        //   silent: true,
        //   // style: "mapbox://styles/mapbox/dark-v9",
        //   postEffect: {
        //     enable: true,
        //     FXAA: {
        //       enable: true
        //     }
        //   },
        //   light: {
        //     main: {
        //       intensity: 1,
        //       shadow: true,
        //       shadowQuality: "high"
        //     },
        //     ambient: {
        //       intensity: 0
        //     }
        //   }
        // },
        series: [
          {
            id: "sub",
            type: "scatter",
            name: "sub",
            coordinateSystem: "bmap",
            symbol: "circle",
            // zindex: 2,
            data: [],
            label: {
              show: false,
              formatter: (res) => {
                return res.data.name.split('_')[0]
              }
              },
            itemStyle: {
              color: "rgb(200, 40, 0)"
            }
          },
          {
            id: "lines",
            type: "lines",
            coordinateSystem: "bmap",
            silent: false,
            effect: {
              show: true,
              constantSpeed: 5,
              trailWidth: 2,
              trailLength: 0.4,
              trailOpacity: 1,
              spotIntensity: 10
            },
            blendMode: "lighter",

            // polyline: true,

            lineStyle: {
              width: 1,
              color: "rgb(200, 40, 0)",
              opacity: 1
            },
            data: []
          }
        ]
      });
    },
    getData() {
      const temp = require("../assets/150.json");
      if (temp.content.type == "dsmDictionary") {
        for (var ele in temp.content.Substation) {
          this.subdata.push({
            name: temp.content.Substation[ele]["String.Name"],
            value: [
              temp.content.Substation[ele]["Double.Longitude"],
              temp.content.Substation[ele]["Double.Latitude"]
            ],
            attributes: {},
            bus: [],
          });
        }
        for (let ele in temp.content.Branch) {
          const fromid = ele.split(",")[0];
          const toid = ele.split(",")[1];
          const coords = [
            this.subdata[temp.content.Bus[fromid]["Int.Sub Number"] - 1].value,
            this.subdata[temp.content.Bus[toid]["Int.Sub Number"] - 1].value
          ];
          this.linedata.push({
            name: ele,
            coords: coords,
            count: 1,
            attributes: {
              MVALimit: temp.content.Branch[ele]["Single.MVA Limit"]
            }
          });
        }

        // for (let ele in temp.content.Bus) {
        //   this.subdata[temp.content.Bus[ele]['Int.Sub Number']-1].bus.push(temp.content.Bus[ele])
        // };
      }
    },
    onDrawSub() {
      this.chart.setOption({
        series: [
          {
            id: "sub",
            data: this.subdata
          }
        ]
      });
      this.chart.on('click', function(params) {alert(params)})
    },
    onDrawLines() {
      this.chart.setOption({
        series: [
          {
            id: "lines",
            data: this.linedata
          }
        ]
      });
    }
  },
  mounted() {
    this.getData();
    this.initdraw("main");
    this.onDrawSub();
    this.onDrawLines();
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