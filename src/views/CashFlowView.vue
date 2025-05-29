<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="pt-0">
        <v-list v-if="!showForm">
          <v-card elevation="0">
            <v-card-actions>
              <v-row>
                <v-col class="pt-0 d-flex justify-space-between">
                  <v-btn
                    v-if="mdAndUp"
                    variant="text"
                    :text="showSummaryTotals ? 'OCULTAR TOTAIS' : 'EXIBIR TOTAIS'"
                    color="teal darken-2"
                    :prepend-icon="showSummaryTotals? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                    rounded="xl"
                    @click="showSummaryTotals = !showSummaryTotals"
                  />
                  <v-btn
                    v-else
                    size="large"
                    color="teal darken-2"
                    :icon="showSummaryTotals? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                    rounded="xl"
                    @click="showSummaryTotals = !showSummaryTotals"
                  />
                  
                  <v-btn
                    v-if="mdAndUp"
                    variant="text"
                    text="EXPORTAR"
                    color="teal darken-2"
                    prepend-icon="mdi-download"
                    rounded="xl"
                    @click="exportList"
                  />
                  <v-btn
                    v-else
                    size="large"
                    color="teal darken-2"
                    icon="mdi-download"
                    rounded="xl"
                    @click="exportList"
                  />
                  
                  <v-btn
                    v-if="mdAndUp"
                    variant="text"
                    text="FILTROS"
                    color="teal darken-2"
                    prepend-icon="mdi-filter-menu-outline"
                    rounded="xl"
                    @click="showFilter = !showFilter"
                  />
                  <v-btn
                    v-else
                    size="large"
                    color="teal darken-2"
                    icon="mdi-filter-menu-outline"
                    rounded="xl"
                    @click="showFilter = !showFilter"
                  />
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>

          <v-card elevation="0" v-if="!loading && showSummaryTotals" class="pb-2">
            <v-row>
              <v-col cols="6" class="pt-0 pb-0">
                <v-card elevation="0">
                  <v-card-title class="text-subtitle-2 text-medium-emphasis font-weight-regular">Saldo Inicial</v-card-title>
                  <v-card-text class="text-h6 font-weight-bold" :class="summaryTotals.executed_history_balance_amount < 0 ? 'text-red' : ''">
                    {{ userMonetaryValueFormatter(summaryTotals.executed_history_balance_amount) }}
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="6" class="pt-0 pb-0">
                <v-card elevation="0">
                  <v-card-title class="text-subtitle-2 text-medium-emphasis font-weight-regular">Saldo Atual</v-card-title>
                  <v-card-text class="text-h6 font-weight-bold" :class="summaryTotals.executed_balance_amount < 0 ? 'text-red' : ''">
                    {{ userMonetaryValueFormatter(summaryTotals.executed_balance_amount) }}
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="6" class="pt-0 pb-0">
                <v-card elevation="0">
                  <v-card-title class="text-subtitle-2 text-medium-emphasis font-weight-regular">Saldo Final</v-card-title>
                  <v-card-text class="text-h6 font-weight-bold" :class="summaryTotals.forecast_balance_amount < 0 ? 'text-red' : ''">
                    {{ userMonetaryValueFormatter(summaryTotals.forecast_balance_amount) }}
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="6" class="pt-0 pb-0">
                <v-row>
                  <v-col>
                    <v-card elevation="0">

                      <v-card-text class="pt-0 pb-0">
                        <v-row class="mt-0">
                          <v-col cols="12">
                            <v-icon icon="mdi-arrow-up-circle-outline" class="mr-1" color="teal darken-2" />
                            {{ userMonetaryValueFormatter(summaryTotals.forecast_revenue_amount) }}
                          </v-col>
                        </v-row>
                        <v-row class="mt-0">
                          <v-col>
                            <v-icon icon="mdi-arrow-down-circle-outline" class="mr-1" color="red" />
                            {{ userMonetaryValueFormatter(summaryTotals.forecast_expense_amount) }}
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-divider class="mt-4" />
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
                  <v-icon :icon="transaction.transaction_type_id == 1 ? 'mdi-arrow-down-circle-outline' : 'mdi-arrow-up-circle-outline'" class="mr-1"
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
      </v-col>
    </v-row>

    <TransactionForm v-if="showForm" :model-value="selectedTransaction" @close="hideForm" />

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
import { useDisplay } from 'vuetify';
import { axiosHelper } from "@/helper/axios.helper";
import { useDateHandler } from '@/composables/useDateHandler'
import { useMonetaryValueHandler } from '@/composables/useMonetaryValueHandler'
import { useSnackbarStore } from '@/store/snackbar.store';
import LoaderDialog from '@/components/generics/LoaderDialog.vue';
import LoaderCircular from '@/components/generics/LoaderCircular.vue';
import ConfirmationDialog from '@/components/generics/ConfirmationDialog.vue';
import CashFlowFilter from '@/components/cash_flow/CashFlowFilter.vue';
import TransactionForm from '@/components/cash_flow/TransactionForm.vue';

const paidStatus = { id: 1, name: 'PAGO' };
const { userDateFormatter, apiDateFormatter } = useDateHandler();
const { userMonetaryValueFormatter } = useMonetaryValueHandler();
const snackbarStore = useSnackbarStore();
const { mdAndUp } = useDisplay();
const transactions = ref([]);
const summaryTotals = ref({});
const filters = ref(null);
const showForm = ref(false);
const showFilter = ref(false);
const showSummaryTotals = ref(true);
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
    showSummaryTotals.value = false;
    return;
  }

  transactions.value = res.data.transactions;
  summaryTotals.value = res.data.totals;
};

const exportList = async () => {
  loading.value = true;
  const url = "/cashflow/transaction/export";
  const reqType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  const options = {
    responseType: 'blob',
    headers: {
      Accept: reqType
    }
  };
  const res = await axiosHelper.get(url, filters.value, options);
  loading.value = false;

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
    showSummaryTotals.value = false;
    return;
  }
  
  const blob = new Blob([res], { type: reqType });
  const urlDownload = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = urlDownload;
  link.setAttribute('download', 'transactions.xlsx');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(urlDownload);
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
    return;
  }

  snackbarStore.showSnackbar(res.message, true);
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
  showForm.value = false;
  getAllTransactions();
};
</script>