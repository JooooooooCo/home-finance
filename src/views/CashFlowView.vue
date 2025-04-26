<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-list v-if="!showForm">
          <v-card elevation="0">
            <v-card-actions>
              <v-row>
                <v-col class="mb-2 d-flex justify-space-between">
                  <h3>Transactions</h3>
                  <v-btn
                    :disabled="showFilter"
                    variant="text"
                    text="Filters"
                    color="teal darken-2"
                    prepend-icon="mdi-filter-menu-outline"
                    rounded
                    @click="showFilter = !showFilter"
                  />
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>

          <v-card v-for="transaction in transactions" :key="transaction.id" elevation="0" class="mb-4">
            <template v-slot:prepend>
              <v-chip v-if="transaction.payment_status.id == paidStatus.id" color="teal darken-2" class="mr-1">
                <v-icon icon="mdi-check" class="mr-1" color="teal-lighten-2" />
                <b>{{ transaction.payment_status.name }}</b>
              </v-chip>
              <v-chip v-else @click="markAsPaid(transaction.id)" color="orange" class="mr-1">
                <v-icon icon="mdi-alert" class="mr-1" color="orange" />
                <b>{{ transaction.payment_status.name }}</b>
                <LoaderCircular v-if="loadingMarkAsPaid[transaction.id]" class="ml-1" />
              </v-chip>
              <v-chip v-if="transaction.is_reconciled" @click="toogleReconciled(transaction.id)" color="teal darken-2" class="mr-1">
                <v-icon icon="mdi-check" class="mr-1" color="teal-lighten-2" />
                <b>CONCILIADO</b>
                <LoaderCircular v-if="loadingToogleReconciled[transaction.id]" class="ml-1" />
              </v-chip>
              <v-chip v-else @click="toogleReconciled(transaction.id)" color="orange" class="mr-1">
                <v-icon icon="mdi-alert" class="mr-1" color="orange" />
                <b>NÃO CONCILIADO</b>
                <LoaderCircular v-if="loadingToogleReconciled[transaction.id]" class="ml-1" />
              </v-chip>
            </template>

            <v-card-title class="text-subtitle-1">
              <v-row>
                <v-col class="text-wrap text-black">
                  <v-icon icon="mdi-circle" class="mr-1"
                    :color="transaction.transaction_type_id == 1 ? 'red-lighten-2' : 'teal-lighten-2'" />
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
                  <b>{{ userMonetaryValueFormatter(transaction.amount) }}</b>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="8">
                  <v-icon icon="mdi-calendar-alert" class="mr-1" />
                  VENCIMENTO EM
                </v-col>
                <v-col class="text-right" cols="4">
                  <b>{{ userDateFormatter(transaction.due_date) }}</b>
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
                      {{ userDateFormatter(transaction.purchase_date) }}
                    </v-col>
                  </v-row>
                  <v-row class="mt-0 mb-1">
                    <v-col cols="8">
                      <v-icon icon="mdi-calendar-blank-outline" class="mr-1" />
                      PAGAMENTO EM
                    </v-col>
                    <v-col class="text-right" cols="4">
                      {{ userDateFormatter(transaction.payment_date) }}
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

        <TransactionForm v-if="showForm" :model-value="selectedTransaction" @close="hideForm" />
      </v-col>
    </v-row>

    <CashFlowFilter :model-value="showFilter" @applyFilters="applyFilters" @cancel="resetFilters" />

    <LoaderDialog :model-value="loading" />

    <ConfirmationDialog :model-value="showConfirmation" :persistent="false" @confirm="deleteTransaction"
      @cancel="resetDeleteConfirmation" />

    <v-btn v-if="!showForm" @click.prevent="showAddForm()" position="fixed" location="bottom right" class="ma-4"
      size="large" icon="mdi-plus" color="teal darken-2" />
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { axiosHelper } from "@/helper/axios.helper";
import { useDateHandler } from '@/composables/useDateHandler'
import { useMonetaryValueHandler } from '@/composables/useMonetaryValueHandler'
import { useSnackbarStore } from '@/store/snackbar.store';
import LoaderDialog from '@/components/generics/LoaderDialog.vue';
import LoaderCircular from '@/components/generics/LoaderCircular.vue';
import ConfirmationDialog from '@/components/generics/ConfirmationDialog.vue';
import CashFlowFilter from '@/components/cash_flow/CashFlowFilter.vue';
import TransactionForm from '@/components/cash_flow/TransactionForm.vue';

const paidStatus = {id: 1, name: 'PAGO'};
const { userDateFormatter, apiDateFormatter } = useDateHandler();
const { userMonetaryValueFormatter } = useMonetaryValueHandler();
const snackbarStore = useSnackbarStore();
const transactions = ref([]);
const filters = ref(null);
const showForm = ref(false);
const showFilter = ref(false);
const loading = ref(false);
const loadingToogleReconciled = ref([]);
const loadingMarkAsPaid = ref([]);
const showCardsDetail = ref([]);
const selectedTransaction = ref(null);
const showConfirmation = ref(false);
const deletedTransactionId = ref(null);

const applyFilters = (newFilters) => {
  filters.value = newFilters;
  showFilter.value = false;
  getAllTransactions();
}

const resetFilters = () => {
  showFilter.value = false;
  filters.value = null
}

const getAllTransactions = async () => {
  loading.value = true;
  const url = "/cashflow/transaction";
  const res = await axiosHelper.get(url, filters.value);
  loading.value = false;

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
  }

  transactions.value = res.data;
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

const toogleReconciled = async (id) => {
  const index = transactions.value.findIndex(item => item.id === id);
  const isReconciled = transactions.value[index].is_reconciled;
  loadingToogleReconciled.value[id] = true;
  const url = `/cashflow/transaction/${id}`;
  const payload = {
    is_reconciled: !isReconciled
  }
  const res = await axiosHelper.put(url, payload);
  loadingToogleReconciled.value[id] = false;

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
    return;
  }

  transactions.value[index].is_reconciled = !isReconciled;
};

const markAsPaid = async (id) => {
  const index = transactions.value.findIndex(item => item.id === id);
  const paymentDate = apiDateFormatter(new Date());

  loadingMarkAsPaid.value[id] = true;
  const url = `/cashflow/transaction/${id}`;
  const payload = {
    payment_status_id: paidStatus.id,
    payment_date: paymentDate,
  }
  const res = await axiosHelper.put(url, payload);
  loadingMarkAsPaid.value[id] = false;

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
    return;
  }

  transactions.value[index].payment_status.id = paidStatus.id;
  transactions.value[index].payment_status.name = paidStatus.name;
  transactions.value[index].payment_date = paymentDate;
};

// TODO UNIFICAR METODOS
const showAddForm = () => {
  selectedTransaction.value = null;
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
</script>