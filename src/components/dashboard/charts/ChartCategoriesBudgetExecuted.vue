<template>
  <v-card elevation="0" class="pb-2" v-if="results">
    <v-row>
      <v-col cols="12" class="pb-0">
        <h3>Despesas planejado X executado</h3>
      </v-col>
      <v-divider class="mb-4" />
    </v-row>
    <v-row>
      <v-col cols="2">
        <span>Categoria</span>
      </v-col>
      <v-col cols="10" class="d-flex">
        <div class="w-50 d-flex justify-center">
          <span>Valor Gasto</span>
        </div>
        <div class="w-50 d-flex justify-center">
          <span>Valor Disponível</span>
        </div>
      </v-col>
    </v-row>
    <CategoriesBudgetExecutedBar :results="results" />
  </v-card>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useMonetaryValueHandler } from '@/composables/useMonetaryValueHandler';
import { axiosHelper } from '@/helper/axios.helper';
import { useSnackbarStore } from '@/store/snackbar.store';
import CategoriesBudgetExecutedBar from './CategoriesBudgetExecutedBar.vue';

const { userMonetaryValueFormatter } = useMonetaryValueHandler();
const snackbarStore = useSnackbarStore();

const props = defineProps({
  dueDateFilter: {
    type: Array,
    required: true,
  },
});
const loading = ref(false);
const results = ref(null);

const getResults = async () => {
  if (props.dueDateFilter.lenght == 0) return;

  loading.value = true;

  const filters = {
    year: props.dueDateFilter.year,
    month: props.dueDateFilter.month,
  };
  const url = '/budget/results';
  const res = await axiosHelper.get(url, filters);
  loading.value = false;

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
    return;
  }

  results.value = res.data;
};

watch(
  () => props.dueDateFilter,
  () => {
    getResults();
  }
);
</script>
