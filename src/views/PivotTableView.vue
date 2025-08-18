<template>
  <div>
    <v-container>
      <v-row class="mt-2">
        <v-col cols="3" class="pt-0">
          <v-select
            label="Selecione a Visualização"
            :items="pivotConfigOptions"
            v-model="selectedPivotConfig"
            variant="outlined"
            flat
            rounded-sm
            :hide-details="true"
          />
        </v-col>
        <v-col cols="3" class="pt-0">
          <DatePicker inputLabel="Data de Vencimento Inicial" v-model="dueDateStartFilter" />
        </v-col>
        <v-col cols="3" class="pt-0">
          <DatePicker inputLabel="Data de Vencimento Final" v-model="dueDateEndFilter" />
        </v-col>
        <v-col cols="3">
          <v-btn color="teal darken-2" @click="getAllTransactions" variant="elevated"
            >Carregar Dados</v-btn
          >
        </v-col>
      </v-row>
    </v-container>

    <PivotTableWrapper v-if="!loading && transactions.length > 0" :report="report" toolbar />

    <LoaderDialog :model-value="loading" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { axiosHelper } from '@/helper/axios.helper';
import { useSnackbarStore } from '@/store/snackbar.store';
import LoaderDialog from '@/components/generics/LoaderDialog.vue';
import DatePicker from '@/components/generics/DatePicker.vue';
import PivotTableWrapper from '@/components/generics/PivotTableWrapper.vue';
import { useDateHandler } from '@/composables/useDateHandler';

const snackbarStore = useSnackbarStore();
const { apiDateFormatter } = useDateHandler();

const pivotConfigOptions = [
  {
    title: 'Categorias por Mês',
    value: {
      slice: {
        reportFilters: [
          {
            uniqueName: 'transaction_type_name',
            filter: {
              members: ['transaction_type_name.DESPESA'],
            },
          },
        ],
        rows: [
          {
            uniqueName: 'secondary_category_name',
          },
          {
            uniqueName: 'specific_category_name',
          },
        ],
        columns: [
          {
            uniqueName: 'Measures',
          },
          {
            uniqueName: 'due_date.Year',
          },
          {
            uniqueName: 'due_date.Month',
          },
        ],
        measures: [
          {
            uniqueName: 'amount',
            aggregation: 'sum',
          },
        ],
        expands: {
          expandAll: true,
        },
      },
      formats: [
        {
          name: '',
          thousandsSeparator: '.',
          decimalSeparator: ',',
          decimalPlaces: 2,
          currencySymbol: 'R$ ',
          currencySymbolAlign: 'left',
          nullValue: '',
          textAlign: 'right',
          isPercent: false,
        },
      ],
    },
  },
  {
    title: 'Modo de Pagamento por Mês',
    value: {
      slice: {
        rows: [
          {
            uniqueName: 'transaction_type_name',
          },
          {
            uniqueName: 'payment_type_name',
            filter: {
              members: ['payment_type_name.DINHEIRO DEBITO VA'],
              negation: true,
            },
          },
        ],
        columns: [
          {
            uniqueName: 'Measures',
          },
          {
            uniqueName: 'due_date.Year',
          },
          {
            uniqueName: 'due_date.Month',
          },
        ],
        measures: [
          {
            uniqueName: 'amount',
            aggregation: 'sum',
          },
        ],
        expands: {
          expandAll: true,
        },
      },
      formats: [
        {
          name: '',
          thousandsSeparator: '.',
          decimalSeparator: ',',
          decimalPlaces: 2,
          currencySymbol: 'R$ ',
          currencySymbolAlign: 'left',
          nullValue: '',
          textAlign: 'right',
          isPercent: false,
        },
      ],
    },
  },
];

const loading = ref(false);
const transactions = ref([]);
const defaultStartDate = new Date();
defaultStartDate.setMonth(defaultStartDate.getMonth() - 6);
const defaultEndDate = new Date();
const dueDateStartFilter = ref(apiDateFormatter(defaultStartDate));
const dueDateEndFilter = ref(apiDateFormatter(defaultEndDate));
const selectedPivotConfig = ref(pivotConfigOptions[0]);

const report = computed(() => {
  return {
    ...selectedPivotConfig.value,
    dataSource: {
      dataSourceType: 'json',
      data: transactions.value,
    },
  };
});

const dueDateRangeFilter = computed(() => {
  return [apiDateFormatter(dueDateStartFilter.value), apiDateFormatter(dueDateEndFilter.value)];
});

const getAllTransactions = async () => {
  if (dueDateRangeFilter.value.length == 0) return;

  loading.value = true;
  const url = '/cashflow/transaction';
  const res = await axiosHelper.get(url, { dueDateRange: dueDateRangeFilter.value });
  loading.value = false;

  if (res.error) {
    transactions.value = [];
    snackbarStore.showSnackbar(res.message);
    return;
  }

  transactions.value = flattenAndRemoveNestedObjects(res.data.transactions);
};

const flattenAndRemoveNestedObjects = transactions => {
  return transactions.map(transaction => {
    const newTransaction = { ...transaction };

    Object.entries(transaction).forEach(([key, value]) => {
      if (value && typeof value === 'object' && 'name' in value && typeof value.name === 'string') {
        newTransaction[`${key}_name`] = value.name;
        delete newTransaction[key];
      }
    });

    return newTransaction;
  });
};

onMounted(() => {
  getAllTransactions();
});
</script>
