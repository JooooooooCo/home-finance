<template>
  <v-card elevation="0" class="pa-4 mb-4">
    <v-card-title class="pa-0">Saldo por Modo de Pagamento</v-card-title>
    <v-row>
      <v-col cols="12">
        <PaymentTypeSelector v-model="selectedPaymentType" autoSelectFirst />
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
import { axiosHelper } from '@/helper/axios.helper';
import { useSnackbarStore } from '@/store/snackbar.store';

dayjs.locale('pt-br');

const snackbarStore = useSnackbarStore();

const props = defineProps({
  dueDateRangeFilter: {
    type: Array,
    required: true,
  },
});

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
    axisLabel: {
      show: false,
    },
  },
  series: [
    {
      name: 'Gastos',
      type: 'line',
      data: Array.from({ length: defaultMonths.length }, () => 0),
      smooth: true,
      label: {
        show: true,
        position: 'top',
        formatter: params => {
          if (params.value === 0) {
            return '';
          }
          const abs = Math.abs(params.value);
          const value = abs > 1000 ? (abs / 1000).toFixed(1) + 'k' : abs.toFixed(0);
          return params.value < 0 ? `-${value}` : `${value}`;
        },
        fontWeight: 'bold',
      },
      markLine: {
        data: [{ yAxis: 0 }],
        lineStyle: {
          color: '#9E9E9E',
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
  if (!data || !data.data || data.data.length === 0) {
    return { labels: defaultMonths, values: Array.from({ length: defaultMonths.length }, () => 0) };
  }

  const labels = data.data.map(d => dayjs(d.year_month + '-01').format('MMM'));
  const values = data.data.map(d => Number(d.balance ?? 0));
  return { labels, values };
};

const fetchChartData = async paymentTypeId => {
  if (!paymentTypeId || !props.dueDateRangeFilter || props.dueDateRangeFilter.length === 0) {
    option.value.xAxis.data = defaultMonths;
    option.value.series[0].data = Array.from({ length: defaultMonths.length }, () => 0);
    return;
  }

  const filters = {
    dueDateRange: props.dueDateRangeFilter,
    paymentTypeId: paymentTypeId,
  };
  const url = '/cashflow/transaction/per-payment-type-balance';
  const res = await axiosHelper.get(url, filters);

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
    return;
  }

  const normalized = normalizeResponseToChart(res);
  option.value.xAxis.data = normalized.labels;
  option.value.series[0].data = normalized.values;
};

watch(selectedPaymentType, val => {
  fetchChartData(val);
});

watch(
  () => props.dueDateRangeFilter,
  () => {
    fetchChartData(selectedPaymentType.value);
  },
  { deep: true }
);

onMounted(() => {
  fetchChartData(selectedPaymentType.value);
});
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>
