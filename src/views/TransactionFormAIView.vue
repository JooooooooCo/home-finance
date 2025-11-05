<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="pb-0">
        <v-card elevation="0">
          <v-card-title>
            <v-icon icon="mdi-robot-happy-outline" class="mr-2" />
            Cadastrar Transação com IA
          </v-card-title>
          <v-card-text>
            <v-row dense>
              <v-col cols="12">
                <v-textarea
                  label="Descreva a transação"
                  v-model="description"
                  placeholder="O que foi? Quanto? Quando? Modo de pagamento? Ex: Paguei R$ 50,00 no cartão de crédito pela compra de um café na padaria."
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

    <v-row>
      <v-col cols="12" class="pt-0">
        <v-card elevation="0">
          <v-card-text class="text-center">
            <v-btn variant="text" color="teal darken-2" @click="goToManualForm">
              Ou preencher manualmente
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <LoaderDialog :model-value="loading" />
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { axiosHelper } from '@/helper/axios.helper';
import { useSnackbarStore } from '@/store/snackbar.store';
import LoaderDialog from '@/components/generics/LoaderDialog.vue';

const router = useRouter();
const snackbarStore = useSnackbarStore();

const description = ref('');
const loading = ref(false);
const suggestedTransaction = ref(null);

const savedDescription = localStorage.getItem('aiDescription');
if (savedDescription) {
  description.value = savedDescription;
}

const processTransactionWithAI = async () => {
  if (!description.value.trim()) return;

  loading.value = true;
  const url = '/cashflow/transaction/ai-suggest';
  const body = { description: description.value };

  const res = await axiosHelper.post(url, body);
  loading.value = false;

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
    return;
  }

  suggestedTransaction.value = res.data;
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
