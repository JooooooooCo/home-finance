<template>
  <v-container>
    <TransactionForm :model-value="transaction" @submit="onSubmit" @close="onClose" />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { axiosHelper } from '@/helper/axios.helper';
import { useSnackbarStore } from '@/store/snackbar.store';
import TransactionForm from '@/components/cash_flow/TransactionForm.vue';

const route = useRoute();
const router = useRouter();
const snackbarStore = useSnackbarStore();
const transaction = ref(null);

onMounted(async () => {
  const id = route.params.id;
  if (id) {
    await fetchTransaction(id);
  } else {
    const suggestedTransaction = localStorage.getItem('suggestedTransaction');
    if (suggestedTransaction) {
      const parsedTransaction = JSON.parse(suggestedTransaction);
      transaction.value = parsedTransaction;
    }
  }
});

const fetchTransaction = async id => {
  const url = `/cashflow/transaction/${id}`;
  const res = await axiosHelper.get(url);

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
    router.push({ name: 'cash-flow' });
    return;
  }

  transaction.value = res.data;
};

const onSubmit = () => {
  cleanStoredIaSuggestions();
  router.push({ name: 'transaction-form-ai' });
};

const onClose = () => {
  cleanStoredIaSuggestions();
  router.push({ name: 'cash-flow' });
};

const cleanStoredIaSuggestions = () => {
  localStorage.removeItem('suggestedTransaction');
  localStorage.removeItem('aiDescription');
};
</script>
