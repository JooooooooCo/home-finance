<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="6" class="pt-0">

          <DatePicker inputLabel="Data de Vencimento Inicial" v-model="dueDateStartFilter" />
        </v-col>
        <v-col cols="6">
          <v-btn color="teal darken-2" @click="getAllTransactions" variant="elevated">Carregar Dados</v-btn>
        </v-col>
      </v-row>      
    </v-container>
    
    <PivotTableWrapper
      v-if="!loading && transactions.length > 0"
      :report="report"
      toolbar
    />      

    <LoaderDialog :model-value="loading" />
  </div>
</template> 

<script setup>
import { ref, computed, onMounted } from 'vue';
import { axiosHelper } from "@/helper/axios.helper";
import { useSnackbarStore } from '@/store/snackbar.store';
import LoaderDialog from '@/components/generics/LoaderDialog.vue';
import DatePicker from '@/components/generics/DatePicker.vue';
import PivotTableWrapper from "@/components/generics/PivotTableWrapper.vue";
import { useDateHandler } from '@/composables/useDateHandler'

const snackbarStore = useSnackbarStore();
const { apiDateFormatter } = useDateHandler();
const loading = ref(false);

const currentDate = new Date();
currentDate.setMonth(currentDate.getMonth() - 6);
const dueDateStartFilter = ref(apiDateFormatter(currentDate));
const transactions = ref([]);

const report = computed(() => {
  return {
    dataSource: {
      data: transactions.value
    }
  };
});

const dueDateRangeFilter = computed(() => {  
  return [
    apiDateFormatter(dueDateStartFilter.value),
    apiDateFormatter(new Date())
  ]
});


const getAllTransactions = async () => {
  if (dueDateRangeFilter.value.length == 0) return;

  loading.value = true;
  const url = "/cashflow/transaction";
  const res = await axiosHelper.get(url, {dueDateRange: dueDateRangeFilter.value});
  loading.value = false;

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
    return;
  }

  transactions.value = res.data.transactions;
};

onMounted(() => {
  getAllTransactions();
});
</script>
