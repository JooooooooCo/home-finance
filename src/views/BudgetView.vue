<template>
  <v-container>
    <v-row class="mt-0">
      <YearMonthPicker v-model="dueDateFilter" mobileView />
    </v-row>
    <v-row>
      <v-col>
        <v-card elevation="0" class="pa-4">
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

          <v-row>
            <v-col>
              <PrimaryCategoryBudget
                v-model="budget.categories"
                :totalBudget="forecastRevenueAmount"
              />
            </v-col>
          </v-row>

          <v-row class="bg-white">
            <v-divider />
            <v-col cols="6">
              <v-btn block color="grey" @click="clean">Limpar</v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                block
                color="teal darken-2"
                @click="save"
                type="submit"
                variant="elevated"
                :loading="loading"
                >Salvar</v-btn
              >
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useMonetaryValueHandler } from '@/composables/useMonetaryValueHandler';
import { axiosHelper } from '@/helper/axios.helper';
import { useSnackbarStore } from '@/store/snackbar.store';
import { useDateHandler } from '@/composables/useDateHandler';
import YearMonthPicker from '@/components/generics/YearMonthPicker.vue';
import PrimaryCategoryBudget from '@/components/budget/PrimaryCategoryBudget.vue';
import dayjs from 'dayjs';

const { userMonetaryValueFormatter } = useMonetaryValueHandler();
const snackbarStore = useSnackbarStore();
const { getMonthInitialEndDate, apiDateFormatter } = useDateHandler();

const budget = ref({
  categories: [],
});
const forecastRevenueAmount = ref(0);
const loading = ref(false);
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

const getBudget = async () => {
  const filters = {
    year: dueDateFilter.value.year,
    month: dueDateFilter.value.month,
  };
  const url = '/budget';
  const res = await axiosHelper.get(url, filters);

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
    return;
  }

  budget.value = res.data.id > 0 ? res.data : { categories: [] };
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

const hasCategoryBudgetOverPercentageLimit = categories => {
  let totalPercentage = 0;
  let childrenPercentageOverLimit = false;
  categories.forEach(category => {
    if (category.children?.length > 0) {
      const childrenOverLimit = hasCategoryBudgetOverPercentageLimit(category.children);
      childrenPercentageOverLimit = childrenOverLimit ?? childrenPercentageOverLimit;
    }
    totalPercentage += category.budget;
  });

  if (totalPercentage <= 100 && !childrenPercentageOverLimit) return false;

  snackbarStore.showSnackbar(
    'O percentual somado das categorias destacadas em vermelho está maior que 100%.'
  );
  return true;
};

const validateBudget = () => !hasCategoryBudgetOverPercentageLimit(budget.value.categories);

const clean = () => (budget.value.categories = []);

const save = async () => {
  if (!validateBudget()) return;

  const isEdit = budget.value?.id;
  loading.value = true;
  const res = isEdit ? await editBudget() : await createBudget();
  loading.value = false;

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
    return;
  }

  budget.value.id = res.data.id;
  snackbarStore.showSnackbar(res.message, true);
};

const createBudget = async () => {
  const url = '/budget';
  const body = {
    year: dueDateFilter.value.year,
    month: dueDateFilter.value.month,
    categories: budget.value.categories,
  };
  return await axiosHelper.post(url, body);
};

const editBudget = async () => {
  const url = `/budget/${budget.value.id}/categories`;
  const body = budget.value;
  return await axiosHelper.put(url, body);
};

watch(
  () => dueDateRangeFilter.value,
  () => {
    getTotalSummary();
  }
);

watch(
  () => dueDateFilter.value,
  () => {
    getBudget();
  }
);
</script>
