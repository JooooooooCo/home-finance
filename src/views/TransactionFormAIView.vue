<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="pb-0">
        <v-card elevation="0">
          <v-card-title>Cadastrar Transação</v-card-title>
          <v-card-text>
            <v-row dense>
              <v-col cols="12" class="d-flex justify-center mb-3">
                <TransactionTypeSelector v-model="transactionType" />
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12" md="6">
                <PaymentTypeSelector v-model="paymentTypeId" autoSelectFirst />
              </v-col>
              <v-col cols="12" md="6">
                <DatePicker v-model="purchaseDate" input-label="Data da Compra" />
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12">
                <v-textarea
                  label="Descreva a transação"
                  v-model="description"
                  rows="4"
                  variant="outlined"
                  flat
                  rounded-sm
                  required
                />
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-row>
              <v-col cols="6">
                <v-btn block color="grey" @click="cancel"> Cancelar </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  block
                  color="teal darken-2"
                  variant="elevated"
                  @click="processTransactionWithAI"
                  :disabled="!description.trim()"
                >
                  Próximo
                  <v-icon icon="mdi-arrow-right" class="mr-2" />
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <LoaderDialog :model-value="loading" />
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { axiosHelper } from '@/helper/axios.helper';
import { useSnackbarStore } from '@/store/snackbar.store';
import LoaderDialog from '@/components/generics/LoaderDialog.vue';
import TransactionTypeSelector from '@/components/core/TransactionTypeSelector.vue';
import PaymentTypeSelector from '@/components/core/PaymentTypeSelector.vue';
import DatePicker from '@/components/generics/DatePicker.vue';
import { TRANSACTION_TYPE } from '@/enums/transaction_type';

const router = useRouter();
const snackbarStore = useSnackbarStore();
const currentDate = dayjs();

const description = ref('O que?\nQuanto?\nFoi parcelado?\n');
const loading = ref(false);
const suggestedTransaction = ref(null);
const transactionType = ref(TRANSACTION_TYPE.EXPENSE);
const paymentTypeId = ref(null);
const purchaseDate = ref(currentDate.format('YYYY-MM-DD'));

const savedDescription = localStorage.getItem('aiDescription');
if (savedDescription) {
  description.value = savedDescription;
}

const processTransactionWithAI = async () => {
  if (!description.value.trim()) return;

  loading.value = true;
  const url = '/cashflow/transaction/ai-suggest';
  const body = {
    description: description.value,
    transactionType: transactionType.value,
  };

  const res = await axiosHelper.post(url, body);
  loading.value = false;

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
    return;
  }

  suggestedTransaction.value = res.data;
  suggestedTransaction.value.type = transactionType.value;
  suggestedTransaction.value.payment_type_id = paymentTypeId.value;
  suggestedTransaction.value.purchase_date = purchaseDate.value;

  localStorage.setItem('suggestedTransaction', JSON.stringify(suggestedTransaction.value));
  localStorage.setItem('aiDescription', description.value);
  router.push({ name: 'transaction-form' });
};

const goToManualForm = () => {
  router.push({ name: 'transaction-form' });
};

const cancel = () => {
  cleanStoredIaSuggestions();
  router.push({ name: 'cash-flow' });
};

const cleanStoredIaSuggestions = () => {
  localStorage.removeItem('suggestedTransaction');
  localStorage.removeItem('aiDescription');
};
</script>
