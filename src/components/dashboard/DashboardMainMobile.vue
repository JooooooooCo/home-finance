<template>
  <v-row class="mt-0">
    <YearMonthPicker v-model="dueDateFilter" mobileView />
  </v-row>
  <v-row class="mt-0">
    <v-col>
      <DashboardTotalSummary :dueDateRangeFilter="dueDateRangeFilter" />
    </v-col>
  </v-row>
  <v-row class="mt-0">
    <v-col>
      <GeneralBalanceChart />
    </v-col>
  </v-row>
  <v-row class="mt-0">
    <v-col>
      <PerPaymentTypeBalanceChart />
    </v-col>
  </v-row>
  <v-row class="mt-0">
    <v-col>
      <ChartCategoriesBudgetExecuted :dueDateFilter="dueDateFilter" />
    </v-col>
  </v-row>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useDateHandler } from '@/composables/useDateHandler';
import YearMonthPicker from '@/components/generics/YearMonthPicker.vue';
import DashboardTotalSummary from '@/components/dashboard/total-summary/DashboardTotalSummary.vue';
import ChartCategoriesForecastExecuted from '@/components/dashboard/charts/ChartCategoriesForecastExecuted.vue';
import ChartCategoriesBudgetExecuted from '@/components/dashboard/charts/ChartCategoriesBudgetExecuted.vue';
import PerPaymentTypeBalanceChart from '@/components/dashboard/charts/PerPaymentTypeBalanceChart.vue';
import GeneralBalanceChart from '@/components/dashboard/charts/GeneralBalanceChart.vue';
import dayjs from 'dayjs';

const { getMonthInitialEndDate, apiDateFormatter } = useDateHandler();

const dueDateFilter = ref({
  year: dayjs().format('YYYY'),
  // month: dayjs().format('MM'),
  month: 1,
});

const dueDateRangeFilter = computed(() =>
  getRangeDateFormatted(
    getMonthInitialEndDate(new Date(dueDateFilter.value.year + '-' + dueDateFilter.value.month))
  )
);

const getRangeDateFormatted = dateRange => {
  return dateRange.length > 0
    ? [apiDateFormatter(dateRange.at(0)), apiDateFormatter(dateRange.at(-1))]
    : [];
};
</script>
