<template>
  <v-card elevation="0" class="pa-4 mb-4">
    <v-card-title class="pa-0">Saldo Geral</v-card-title>
    <v-chart class="chart" :option="option" />
  </v-card>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import VChart from 'vue-echarts';
import 'echarts';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
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

const loading = ref(false);
const balanceData = ref([]);
const months = ref([]);

const getGeneralBalance = async () => {
  if (!props.dueDateRangeFilter || props.dueDateRangeFilter.length === 0) return;

  loading.value = true;

  const filters = {
    dueDateRange: props.dueDateRangeFilter,
  };
  const url = '/cashflow/transaction/general-balance';
  const res = await axiosHelper.get(url, filters);
  loading.value = false;

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
    return;
  }

  months.value = res.data.map(item => dayjs(item.year_month + '-01').format('MMM'));
  balanceData.value = res.data.map(item => item.balance);
  updateChart();
};

const updateChart = () => {
  option.value.xAxis.data = months.value;
  option.value.series[0].data = balanceData.value;
};

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
    data: months.value,
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
      name: 'Balanço',
      type: 'line',
      data: balanceData.value,
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

watch(
  () => props.dueDateRangeFilter,
  () => {
    if (props.dueDateRangeFilter && props.dueDateRangeFilter.length > 0) {
      getGeneralBalance();
    }
  }
);

onMounted(() => {
  if (props.dueDateRangeFilter && props.dueDateRangeFilter.length > 0) {
    getGeneralBalance();
  }
});
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>
