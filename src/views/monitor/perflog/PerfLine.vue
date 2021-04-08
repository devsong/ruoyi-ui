<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts';
require('echarts/theme/macarons'); // echarts theme
import resize from '@/views/dashboard/mixins/resize';

export default {
  name: "PerfLine",
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '400px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons');
      this.setOptions(this.chartData);
    },
    setOptions({ title, xAxis, yAxis, yUnit, yFormat } = {}) {
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          position: function (pt) {
            return [pt[0], '100%'];
          },
          formatter: '{b0}<br/>{c0}'+yUnit,
          // formatter: '{b0}<br/>{a0}: {c0}'+yUnit
        },
        grid: {

        },
        title: {
          text: title,
          left: 'center',
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxis
        },
        yAxis: {
          type: 'value',
          name: yUnit,
          boundaryGap: [0, '10%'],
          axisLabel: {
            show: true,
            interval: 'auto'
          },
          show: true
        },
        // dataZoom: [{
        //   type: 'inside',
        //   start: 0,
        //   end: 100
        // }, {
        //   start: 0,
        //   end: 10,
        //   handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        //   handleSize: '80%',
        //   handleStyle: {
        //     color: '#fff',
        //     shadowBlur: 3,
        //     shadowColor: 'rgba(110, 150, 215, 0.6)',
        //     shadowOffsetX: 2,
        //     shadowOffsetY: 2
        //   }
        // }],
        series: [
          {
            name: title,
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
              color: 'rgb(110, 150, 215)'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(110, 150, 215)'
              }, {
                offset: 1,
                color: 'rgb(110, 150, 215)'
              }])
            },
            data: yAxis
          },
        ]
      });
    }
  }
};
</script>
