<template>
    <v-card elevation="0" class="pb-2" v-if="totalSummary">
        <v-row>
            <v-col cols="12" class="pb-0">
                <h3>Totais </h3>
            </v-col>
            <v-divider class="mb-4" />
        </v-row>
        <v-row>
            <v-col cols="6" class="pt-0 pb-0">
                <v-card elevation="0" color="grey-lighten-4 pt-4">
                    <v-card-title class="text-subtitle-2 text-medium-emphasis font-weight-regular">Saldo
                        Inicial</v-card-title>
                    <v-card-text class="text-h6 font-weight-bold" :class="totalSummary.executed_history_balance_amount < 0 ? 'text-red' : ''">
                        {{ userMonetaryValueFormatter(totalSummary.executed_history_balance_amount) }}
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="6" class="pt-0 pb-0">
                <v-card elevation="0" color="grey-lighten-4 pt-4 mb-2">
                    <v-card-title class="text-subtitle-2 text-medium-emphasis font-weight-regular">Saldo
                        Atual</v-card-title>
                    <v-card-text class="text-h6 font-weight-bold" :class="totalSummary.executed_balance_amount < 0 ? 'text-red' : ''">
                        {{ userMonetaryValueFormatter(totalSummary.executed_balance_amount) }}
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="6" class="pt-0 pb-0">
                <v-card elevation="0" color="grey-lighten-4">
                    <v-card-title class="text-subtitle-2 text-medium-emphasis font-weight-regular">Contas a
                        Pagar</v-card-title>
                    <v-card-text class="text-h6 font-weight-bold">
                        <v-icon icon="mdi-arrow-down-circle-outline" class="mr-1" color="red" />
                        {{ userMonetaryValueFormatter(totalSummary.pending_expense_amount) }}
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="6" class="pt-0 pb-0">
                <v-card elevation="0" color="grey-lighten-4 mb-2">
                    <v-card-title class="text-subtitle-2 text-medium-emphasis font-weight-regular">Contas a
                        Receber</v-card-title>
                    <v-card-text class="text-h6 font-weight-bold">
                        <v-icon icon="mdi-arrow-up-circle-outline" class="mr-1" color="teal darken-2" />
                        {{ userMonetaryValueFormatter(totalSummary.pending_revenue_amount) }}
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="6" class="pt-0 pb-0">
                <v-card elevation="0" color="grey-lighten-4 mb-2">
                    <v-card-title class="text-subtitle-2 text-medium-emphasis font-weight-regular">Saldo
                        Final</v-card-title>
                    <v-card-text class="text-h6 font-weight-bold" :class="totalSummary.forecast_balance_amount < 0 ? 'text-red' : ''">
                        {{ userMonetaryValueFormatter(totalSummary.forecast_balance_amount) }}
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="6" class="pt-0 pb-0">
                <v-row>
                    <v-col>
                        <v-card elevation="0" color="grey-lighten-4 mb-2">

                            <v-card-text class="pt-0 pb-4">
                                <v-row class="mt-0">
                                    <v-col cols="12">
                                        <v-icon icon="mdi-arrow-up-circle-outline" class="mr-1"
                                            color="teal darken-2" />
                                        {{ userMonetaryValueFormatter(totalSummary.forecast_revenue_amount) }}
                                    </v-col>
                                </v-row>
                                <v-row class="mt-0">
                                    <v-col>
                                        <v-icon icon="mdi-arrow-down-circle-outline" class="mr-1" color="red" />
                                        {{ userMonetaryValueFormatter(totalSummary.forecast_expense_amount) }}
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-card>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useMonetaryValueHandler } from '@/composables/useMonetaryValueHandler';
import { axiosHelper } from "@/helper/axios.helper";
import { useSnackbarStore } from '@/store/snackbar.store';

const { userMonetaryValueFormatter } = useMonetaryValueHandler();
const snackbarStore = useSnackbarStore();

const props = defineProps({
  dueDateRangeFilter: {
    type: Array,
    required: true
  }
});
const loading = ref(false);
const totalSummary = ref(null);

const getTotalSummary = async () => {
  if (props.dueDateRangeFilter.lenght == 0) return;

  loading.value = true;

  const filters = {
    dueDateRange: props.dueDateRangeFilter,
  };
  const url = "/cashflow/transaction/total-summary";
  const res = await axiosHelper.get(url, filters);
  loading.value = false;

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
    return;
  }

  totalSummary.value = res.data.totals;
};


watch(() => props.dueDateRangeFilter, () => {
  getTotalSummary()
})
</script>
