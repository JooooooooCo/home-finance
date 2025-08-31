<template>
  <v-chart class="chart" :option="option" />
</template>

<script setup>
import { ref, watch } from 'vue';
import VChart from 'vue-echarts';
import 'echarts';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

dayjs.locale('pt-br');

const props = defineProps({
  totalSummary: {
    type: Object,
    required: true,
  },
});

const option = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'line',
    },
    formatter: '{b}: {c}',
  },
  legend: {
    data: ['Saldo'],
    orient: 'horizontal',
    bottom: '0',
    left: 'center',
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '10%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: ['Saldo Inicial', 'Saldo Atual', 'Saldo Final'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: 'Saldo',
      type: 'line',
      data: [],
      itemStyle: { color: '#2196f3' }, // Use a single color for the line
      label: {
        show: true,
        position: 'top',
        formatter: '{c}',
        fontWeight: 'bold',
      },
    },
  ],
});

const updateChart = () => {
  if (!props.totalSummary) return;

  option.value.series[0].data = [
    props.totalSummary.executed_history_balance_amount,
    props.totalSummary.executed_balance_amount,
    props.totalSummary.forecast_balance_amount,
  ];
};

watch(
  () => props.totalSummary,
  () => {
    updateChart();
  },
  { immediate: true }
);
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>
