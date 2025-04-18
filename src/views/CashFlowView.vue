<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-list v-if="!showForm">

          <v-card v-for="transaction in transactions" :key="transaction.id" elevation="0" class="mb-4">
            <template v-slot:prepend>
              <v-chip :color="transaction.payment_status.id == 1 ? 'teal darken-2' : 'orange'" class="mr-1">
                <b>{{ transaction.payment_status.name }}</b>
              </v-chip>
              <v-chip v-if="transaction.is_reconciled" color="teal darken-2" class="mr-1">
                <b>CONCILIADO</b>
              </v-chip>
              <v-chip v-else color="orange" class="mr-1">
                <b>NÃO CONCILIADO</b>
              </v-chip>
            </template>

            <v-card-title class="text-subtitle-1">
              <v-row>
                <v-col class="text-wrap text-black">
                  <v-icon icon="mdi-circle" class="mr-1"
                    :color="transaction.transaction_type_id == 1 ? 'red' : 'teal darken-2'" />
                  <b>{{ transaction.description }}</b>
                </v-col>
              </v-row>
            </v-card-title>

            <v-card-subtitle>
              <v-row class="mt-2">
                <v-col class="pb-0 pt-0" cols="8">
                  <v-icon icon="mdi-wallet-bifold-outline" class="mr-1" />
                  {{ transaction.payment_type.name }}
                </v-col>
                <v-col class="pb-0 pt-0 text-right" cols="4">
                  <v-icon icon="mdi-currency-usd" class="mr-1" />
                  <b>{{ transaction.amount }}</b>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="8">
                  <v-icon icon="mdi-calendar-alert" class="mr-1" />
                  VENCIMENTO EM
                </v-col>
                <v-col class="text-right" cols="4">
                  <b>{{ transaction.due_date }}</b>
                </v-col>
              </v-row>
            </v-card-subtitle>

            <v-card-actions>
              <v-btn variant="text" color="red" @click.stop="openDeleteConfirmation(transaction.id)">Excluir</v-btn>
              <v-btn variant="text" @click.stop="showEditForm(transaction)">Editar</v-btn>
              <v-spacer />
              <v-btn :icon="showCardsDetail[transaction.id] ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                @click="showCardsDetail[transaction.id] = !showCardsDetail[transaction.id]" />
            </v-card-actions>

            <v-expand-transition>
              <div v-show="showCardsDetail[transaction.id]">
                <v-divider />

                <v-card-subtitle class="mb-2 mt-4">
                  <v-row class="mt-0">
                    <v-col cols="8">
                      <v-icon icon="mdi-information-outline" class="mr-1" />
                      PARCELA {{ transaction.current_installment }}/{{ transaction.total_installments }}
                    </v-col>
                    <v-col class="text-right" cols="4">
                      <v-icon icon="mdi-key-outline" class="mr-1" />
                      <b>{{ transaction.id }}</b>
                    </v-col>
                  </v-row>
                  <v-row class="mt-0">
                    <v-col cols="8">
                      <v-icon icon="mdi-calendar-blank-outline" class="mr-1" />
                      COMPRA EM
                    </v-col>
                    <v-col class="text-right" cols="4">
                      {{ transaction.purchase_date }}
                    </v-col>
                  </v-row>
                  <v-row class="mt-0 mb-1">
                    <v-col cols="8">
                      <v-icon icon="mdi-calendar-blank-outline" class="mr-1" />
                      PAGAMENTO EM
                    </v-col>
                    <v-col class="text-right" cols="4">
                      {{ transaction.payment_date }}
                    </v-col>
                  </v-row>

                  <v-divider />

                  <v-row class="mt-0">
                    <v-col class="text-wrap" cols="8">
                      <v-chip class="mr-1">
                        <b>{{ transaction.primary_category.name }}</b>
                      </v-chip>
                    </v-col>
                    <v-col class="text-right" cols="4">
                      <v-chip class="mr-1">
                        <b>{{ transaction.is_real ? 'REAL' : 'FAKE' }}</b>
                      </v-chip>
                    </v-col>
                  </v-row>
                  <v-row class="mt-0">
                    <v-col class="text-wrap">
                      <v-chip class="mr-1">
                        <b>{{ transaction.secondary_category.name }}</b>
                      </v-chip>
                    </v-col>
                  </v-row>
                  <v-row class="mt-0 mb-1">
                    <v-col class="text-wrap">
                      <v-chip class="mr-1">
                        <b>{{ transaction.specific_category.name }}</b>
                      </v-chip>
                    </v-col>
                  </v-row>

                  <div v-if="transaction.primary_note || transaction.secondary_note || transaction.spending_average">
                    <v-divider />

                    <v-row class="mt-0" v-if="transaction.primary_note">
                      <v-col class="text-wrap">
                        <v-icon icon="mdi-note-edit-outline" class="mr-1" />
                        {{ transaction.primary_note }}
                      </v-col>
                    </v-row>
                    <v-row class="mt-0" v-if="transaction.secondary_note">
                      <v-col class="text-wrap">
                        <v-icon icon="mdi-note-edit-outline" class="mr-1" />
                        {{ transaction.secondary_note }}
                      </v-col>
                    </v-row>
                    <v-row class="mt-0" v-if="transaction.spending_average">
                      <v-col class="text-wrap">
                        <v-icon icon="mdi-note-edit-outline" class="mr-1" />
                        {{ transaction.spending_average }}
                      </v-col>
                    </v-row>
                  </div>
                </v-card-subtitle>
              </div>
            </v-expand-transition>

            <v-divider />
          </v-card>

        </v-list>

        <TransactionForm v-if="showForm" :model-value="selectedTransaction" @submit="saveTransaction"
          @cancel="hideForm" />
      </v-col>
    </v-row>

    <LoaderDialog :model-value="loading" />

    <ConfirmationDialog :model-value="showConfirmation" :persistent="false" @confirm="deleteTransaction"
      @cancel="resetDeleteConfirmation" />

    <v-btn v-if="!showForm" @click.prevent="showAddForm()" position="fixed" location="bottom right" class="ma-4"
      size="large" icon="mdi-plus" color="teal darken-2" />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { axiosHelper } from "@/helper/axios.helper";
import { useSnackbarStore } from '@/store/snackbar.store';
import LoaderDialog from '@/components/generics/LoaderDialog.vue';
import ConfirmationDialog from '@/components/generics/ConfirmationDialog.vue';
import TransactionForm from '@/components/cash_flow/TransactionForm.vue';

const snackbarStore = useSnackbarStore();
const transactions = ref([]);
const showForm = ref(false);
const loading = ref(false);
const showCardsDetail = ref([]);
const selectedTransaction = ref({ id: null, name: null });
const showConfirmation = ref(false);
const deletedTransactionId = ref(null);

const getAllTransactions = async () => {
  loading.value = true;
  const url = "/cashflow/transaction";
  const res = await axiosHelper.get(url);
  loading.value = false;

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
  }

  transactions.value = res.data;
};

const saveTransaction = async (item) => {
  loading.value = true;
  const method = item.id ? "put" : "post";
  const url = item.id ? `/cashflow/transaction/${item.id}` : "/cashflow/transaction";
  const body = item;

  const res = await axiosHelper[method](url, body);
  loading.value = false;

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
  }

  hideForm();
};

const openDeleteConfirmation = (id) => {
  deletedTransactionId.value = id;
  showConfirmation.value = true;
};

const resetDeleteConfirmation = () => {
  deletedTransactionId.value = null;
  showConfirmation.value = false;
}

const deleteTransaction = async () => {
  showConfirmation.value = false;
  loading.value = true;
  const url = `/cashflow/transaction/${deletedTransactionId.value}`;
  const res = await axiosHelper.delete(url);
  resetDeleteConfirmation();
  loading.value = false;

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
  }

  getAllTransactions();
};

const showAddForm = () => {
  selectedTransaction.value = { id: null, name: null };
  showForm.value = true;
};

const showEditForm = (item) => {
  selectedTransaction.value = item;
  showForm.value = true;
};

const hideForm = () => {
  getAllTransactions();
  showForm.value = false;
};

onMounted(() => {
  getAllTransactions();
});
</script>