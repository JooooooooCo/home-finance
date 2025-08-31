<template>
  <div v-if="totalSummary">
    <v-card elevation="0" class="pa-4 mb-4">
      <v-card-title class="pa-0 pb-4">Saldo do Mês</v-card-title>

      <v-row>
        <v-col cols="6" class="pt-0 pb-2 pr-1">
          <v-card variant="outlined" class="border-thin">
            <v-card-title class="text-caption text-medium-emphasis font-weight-regular pb-0"
              >Saldo Inicial</v-card-title
            >
            <v-card-text
              class="text-subtitle-1 font-weight-bold pb-2"
              :class="totalSummary.executed_history_balance_amount < 0 ? 'text-red' : ''"
            >
              {{ userMonetaryValueFormatter(totalSummary.executed_history_balance_amount) }}
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="6" class="pt-0 pb-2 pl-1">
          <v-card variant="outlined" class="border-thin">
            <v-card-title class="text-caption text-medium-emphasis font-weight-regular pb-0"
              >Saldo Atual</v-card-title
            >
            <v-card-text
              class="text-subtitle-1 font-weight-bold pb-2"
              :class="totalSummary.executed_balance_amount < 0 ? 'text-red' : ''"
            >
              {{ userMonetaryValueFormatter(totalSummary.executed_balance_amount) }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="pt-0 pb-2">
          <v-card variant="outlined" class="border-thin">
            <v-card-title
              class="text-caption text-medium-emphasis font-weight-regular text-center pb-0"
              >Saldo Final</v-card-title
            >
            <v-card-text
              class="text-h6 font-weight-bold text-center pb-2"
              :class="totalSummary.forecast_balance_amount < 0 ? 'text-red' : ''"
            >
              {{ userMonetaryValueFormatter(totalSummary.forecast_balance_amount) }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="mt-0">
        <v-col cols="12">
          <MonthBalanceChart :totalSummary="totalSummary" />
        </v-col>
      </v-row>
    </v-card>

    <v-card elevation="0" class="pa-4">
      <v-card-title class="pa-0 pb-4">Receitas e Despesas</v-card-title>

      <v-row>
        <v-col cols="6" class="pt-0 pb-2 pr-1">
          <v-card variant="outlined" class="border-thin">
            <v-card-title class="text-caption text-medium-emphasis font-weight-regular pb-0">
              <v-icon icon="mdi-arrow-down-circle-outline" class="mr-1" color="red" />
              Despesas Totais
            </v-card-title>
            <v-card-text class="text-subtitle-1 font-weight-bold pb-2">
              {{ userMonetaryValueFormatter(totalSummary.forecast_expense_amount) }}
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="6" class="pt-0 pb-2 pl-1">
          <v-card variant="outlined" class="border-thin">
            <v-card-title class="text-caption text-medium-emphasis font-weight-regular pb-0">
              <v-icon icon="mdi-arrow-up-circle-outline" class="mr-1" color="teal darken-2" />
              Receitas Totais
            </v-card-title>
            <v-card-text class="text-subtitle-1 font-weight-bold pb-2">
              {{ userMonetaryValueFormatter(totalSummary.forecast_revenue_amount) }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" class="pt-0 pb-2 pr-1">
          <v-card variant="outlined" class="border-thin">
            <v-card-title class="text-caption text-medium-emphasis font-weight-regular pb-0">
              <v-icon icon="mdi-arrow-down-circle-outline" class="mr-1" color="red" />
              A Pagar
            </v-card-title>
            <v-card-text class="text-subtitle-1 font-weight-bold pb-2">
              {{ userMonetaryValueFormatter(totalSummary.pending_expense_amount) }}
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="6" class="pt-0 pb-2 pl-1">
          <v-card variant="outlined" class="border-thin">
            <v-card-title class="text-caption text-medium-emphasis font-weight-regular pb-0">
              <v-icon icon="mdi-arrow-up-circle-outline" class="mr-1" color="teal darken-2" />
              A Receber
            </v-card-title>
            <v-card-text class="text-subtitle-1 font-weight-bold pb-2">
              {{ userMonetaryValueFormatter(totalSummary.pending_revenue_amount) }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="mt-0">
        <v-col cols="12">
          <RevenueExpensePieChart :totalSummary="totalSummary" />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useMonetaryValueHandler } from '@/composables/useMonetaryValueHandler';
import { axiosHelper } from '@/helper/axios.helper';
import { useSnackbarStore } from '@/store/snackbar.store';
import RevenueExpensePieChart from '@/components/dashboard/charts/RevenueExpensePieChart.vue';
import MonthBalanceChart from '@/components/dashboard/charts/MonthBalanceChart.vue';

const { userMonetaryValueFormatter } = useMonetaryValueHandler();
const snackbarStore = useSnackbarStore();

const props = defineProps({
  dueDateRangeFilter: {
    type: Array,
    required: true,
  },
});
const loading = ref(false);
const totalSummary = ref(null);

const getTotalSummary = async () => {
  if (props.dueDateRangeFilter.lenght == 0) return;

  loading.value = true;

  const filters = {
    dueDateRange: props.dueDateRangeFilter,
  };
  const url = '/cashflow/transaction/total-summary';
  const res = await axiosHelper.get(url, filters);
  loading.value = false;

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
    return;
  }

  totalSummary.value = res.data.totals;
};

watch(
  () => props.dueDateRangeFilter,
  () => {
    getTotalSummary();
  }
);
</script>
