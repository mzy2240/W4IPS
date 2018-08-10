<template>
    <chart
            :options="option"
            auto-resize
    ></chart>
</template>

<style>
.echarts {
    height: 300px;
}
</style>

<script>
import mapboxgl from 'mapbox-gl'
import 'echarts-gl/dist/echarts-gl'

mapboxgl.accessToken =
    'sk.eyJ1IjoibXp5MjI0MCIsImEiOiJjamttc3Z3cjMxMWdxM3FwYjVhNzJxZ2FkIn0.6_Z5oFyQmZOMVwnpwecRWA'

export default {
    data: function() {
        let data = []

        for (let i = 0; i <= 360; i++) {
            let t = (i / 180) * Math.PI
            let r = Math.sin(2 * t) * Math.cos(2 * t)
            data.push([r, i])
        }

        return {
            option: {
                title: {
                    text: '极坐标双数值轴'
                },
                legend: {
                    data: ['line']
                },
                polar: {
                    center: ['50%', '54%']
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                angleAxis: {
                    type: 'value',
                    startAngle: 0
                },
                radiusAxis: {
                    min: 0
                },
                series: [
                    {
                        coordinateSystem: 'polar',
                        name: 'line',
                        type: 'line',
                        showSymbol: false,
                        data: data
                    }
                ],
                animationDuration: 2000
            }
        }
    },
    methods: {
        loadBMapScript() {
            let script = document.createElement('script')
            script.src =
                'http://api.map.baidu.com/getscript?v=3.0&ak=7orQb6L442IbNk80oQOxkvHGr7ZtWcxg'
            document.body.appendChild(script)
        }
    },
    mounted() {
        this.loadBMapScript() //load bmap when need
    }
}
</script>
