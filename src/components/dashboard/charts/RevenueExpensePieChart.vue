<template>
  <v-chart class="chart" :option="option" />
</template>

<script setup>
import { ref, watch } from 'vue';
import VChart from 'vue-echarts';
import 'echarts';

const props = defineProps({
  totalSummary: {
    type: Object,
    required: true,
  },
});

const option = ref({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)',
  },
  legend: {
    orient: 'horizontal',
    bottom: '0',
    left: 'center',
  },
  series: [
    {
      name: 'Receitas e Despesas',
      type: 'pie',
      radius: '50%',
      avoidLabelOverlap: false,
      label: {
        show: true,
        position: 'outside',
        formatter: '{d}%',
        fontSize: 12,
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '18',
          fontWeight: 'bold',
        },
      },
      labelLine: {
        show: true,
        length: 10,
        length2: 10,
      },
      data: [],
    },
  ],
});

const updateChart = () => {
  if (!props.totalSummary) return;

  const forecastRevenue = Math.abs(props.totalSummary.forecast_revenue_amount || 0);
  const pendingRevenue = Math.abs(props.totalSummary.pending_revenue_amount || 0);
  const forecastExpense = Math.abs(props.totalSummary.forecast_expense_amount || 0);
  const pendingExpense = Math.abs(props.totalSummary.pending_expense_amount || 0);

  option.value.series[0].data = [
    { value: forecastRevenue, name: 'Receitas Totais', itemStyle: { color: '#4caf50' } },
    { value: pendingRevenue, name: 'Receitas a Receber', itemStyle: { color: '#81c784' } },
    { value: forecastExpense, name: 'Despesas Totais', itemStyle: { color: '#f44336' } },
    { value: pendingExpense, name: 'Despesas a Receber', itemStyle: { color: '#ef5350' } },
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
