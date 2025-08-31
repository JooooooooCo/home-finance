<template>
  <v-card elevation="0" class="pa-4 mb-4">
    <v-card-title class="pa-0">Saldo Histórico</v-card-title>
    <v-chart class="chart" :option="option" />
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import VChart from 'vue-echarts';
import 'echarts';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

dayjs.locale('pt-br');

const months = Array.from({ length: 12 }, (_, i) => {
  const month = dayjs().subtract(5, 'month').add(i, 'month');
  return month.format('MMM');
});

const option = ref({
  grid: {
    left: '3%',
    right: '4%',
    bottom: '10%',
    containLabel: true,
  },
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    type: 'category',
    data: months,
  },
  yAxis: {
    type: 'value',
    axisLine: {
      show: false,
    },
  },
  series: [
    {
      name: 'Balanço',
      type: 'line',
      data: [
        781.73, -15.42, 327.63, 398.41, 889.39, 1490.27, 2091.15, 2392.03, 2692.91, 2993.79,
        3294.67, 3595.54,
      ],
      smooth: true,
      itemStyle: {
        color: 'green',
      },
      label: {
        show: true,
        position: 'top',
        formatter: params => {
          // console.log(params.value);
          if (params.value === 0) {
            return '';
          }
          const abs = Math.abs(params.value);
          const value = abs > 1000 ? (abs / 1000).toFixed(1) + 'k' : abs.toFixed(0);
          return params.value < 0 ? `-${value}` : `${value}`;
        },
        color: 'black',
        fontWeight: 'bold',
      },
      markLine: {
        data: [{ yAxis: 0 }],
        lineStyle: {
          color: 'transparent',
        },
      },
    },
  ],
  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 50,
    },
  ],
});
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>
