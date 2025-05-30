<template>
  <v-container>
    <v-row class="mt-0">
      <YearMonthPicker v-model="dueDateFilter" mobileView />
    </v-row>
    <v-row>
      <v-col cols="6" class="d-flex flex-column justify-center"> <h3>Budget</h3> </v-col>
      <v-col cols="6" class="d-flex flex-column">
        <span class="d-flex flex-row-reverse">Receita Prevista</span>
        <div class="d-flex flex-row-reverse">
          <b>{{ userMonetaryValueFormatter(forecastRevenueAmount) }}</b>
          <v-icon icon="mdi-arrow-up-circle-outline" class="mr-1" color="teal darken-2" />
        </div>
      </v-col>
    </v-row>
    <v-divider class="mb-4 mt-2" />
  </v-container>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useMonetaryValueHandler } from '@/composables/useMonetaryValueHandler';
import { axiosHelper } from '@/helper/axios.helper';
import { useSnackbarStore } from '@/store/snackbar.store';
import { useDateHandler } from '@/composables/useDateHandler';
import YearMonthPicker from '@/components/generics/YearMonthPicker.vue';
import dayjs from 'dayjs';

const { userMonetaryValueFormatter } = useMonetaryValueHandler();
const snackbarStore = useSnackbarStore();
const { getMonthInitialEndDate, apiDateFormatter } = useDateHandler();

const forecastRevenueAmount = ref(0);
const dueDateFilter = ref({
  year: dayjs().format('YYYY'),
  month: dayjs().format('MM'),
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

const getTotalSummary = async () => {
  if (dueDateRangeFilter.value.lenght == 0) return;

  const filters = {
    dueDateRange: dueDateRangeFilter.value,
  };
  const url = '/cashflow/transaction/total-summary';
  const res = await axiosHelper.get(url, filters);

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
    return;
  }

  forecastRevenueAmount.value = res.data.totals.forecast_revenue_amount;
};

watch(
  () => dueDateRangeFilter.value,
  () => {
    getTotalSummary();
  }
);
</script>
