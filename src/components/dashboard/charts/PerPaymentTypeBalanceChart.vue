<template>
  <v-card class="pa-4">
    <v-card-title class="pa-0">Saldo por Modo de Pagamento</v-card-title>
    <v-row>
      <v-col cols="12">
        <PaymentTypeSelector v-model="selectedPaymentType" />
      </v-col>
    </v-row>

    <v-chart class="chart" :option="option" />
  </v-card>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import VChart from 'vue-echarts';
import 'echarts';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import PaymentTypeSelector from '@/components/core/PaymentTypeSelector.vue';

dayjs.locale('pt-br');

const selectedPaymentType = ref(null);

const defaultMonths = Array.from({ length: 7 }, (_, i) => {
  const month = dayjs().subtract(1, 'month').add(i, 'month');
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
    data: defaultMonths,
  },
  yAxis: {
    type: 'value',
    axisLine: {
      show: false,
    },
  },
  series: [
    {
      name: 'Gastos',
      type: 'line',
      data: Array.from({ length: defaultMonths.length }, () => 0),
      smooth: true,
      itemStyle: {
        color: 'green',
      },
      label: {
        show: true,
        position: 'top',
        formatter: params => {
          if (params.value === 0) {
            return '';
          }
          const abs = Math.abs(params.value);
          const value = abs > 1000 ? (abs / 1000).toFixed(1) + 'k' : abs.toFixed(0);
          return `-${value}`;
        },
        color: 'red',
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
      end: 100,
    },
  ],
});

const normalizeResponseToChart = data => {
  // Accept multiple possible shapes from backend:
  // 1) { labels: [...], values: [...] }
  // 2) [{ label: 'Jan', value: -100 }, ...]
  // 3) [ -100, -200, ... ] -> use default months
  if (!data)
    return { labels: defaultMonths, values: Array.from({ length: defaultMonths.length }, () => 0) };

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return {
        labels: defaultMonths,
        values: Array.from({ length: defaultMonths.length }, () => 0),
      };
    }
    if (typeof data[0] === 'number') {
      return { labels: defaultMonths.slice(0, data.length), values: data };
    }
    if (typeof data[0] === 'object' && data[0] !== null) {
      const labels = data.map(d => (d.label ?? d.name ?? '').toString());
      const values = data.map(d => Number(d.value ?? d.amount ?? 0));
      return { labels, values };
    }
  }

  if (typeof data === 'object') {
    if (Array.isArray(data.labels) && Array.isArray(data.values)) {
      return { labels: data.labels, values: data.values };
    }
  }

  // Fallback
  return { labels: defaultMonths, values: Array.from({ length: defaultMonths.length }, () => 0) };
};

const fetchChartData = async paymentTypeId => {
  // Using mocked data for now (no network requests).
  const mock = {
    null: {
      labels: defaultMonths,
      values: [-1264.39, -1210.15, -559.67, -257.83, -109.9, -300, -450],
    },
    1: {
      labels: defaultMonths,
      values: [-500, -600, -700, -200, -100, -50, -80],
    },
    2: {
      labels: defaultMonths,
      values: [-1200, -1100, -900, -400, -300, -200, -150],
    },
    3: {
      labels: defaultMonths,
      values: [0, -100, -50, -20, -10, -5, -1],
    },
  };

  const key =
    paymentTypeId === null || paymentTypeId === undefined ? 'null' : String(paymentTypeId);
  const payload = mock[key] ?? mock['null'];

  option.value.xAxis.data = payload.labels;
  option.value.series[0].data = payload.values;
};

watch(selectedPaymentType, val => {
  fetchChartData(val);
});

onMounted(() => {
  // initial load without filter
  fetchChartData(selectedPaymentType.value);
});
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>
