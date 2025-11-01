<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="pt-0">
        <v-row class="mt-0">
          <v-col>
            <v-card elevation="0">
              <v-card-actions>
                <v-row>
                  <v-col class="d-flex justify-space-between">
                    <v-btn
                      v-if="mdAndUp"
                      variant="text"
                      :text="showSummaryTotals ? 'OCULTAR TOTAIS' : 'EXIBIR TOTAIS'"
                      color="teal darken-2"
                      :prepend-icon="showSummaryTotals ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                      rounded="xl"
                      @click="showSummaryTotals = !showSummaryTotals"
                    />
                    <v-btn
                      v-else
                      size="large"
                      color="teal darken-2"
                      :icon="showSummaryTotals ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
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
          </v-col>
        </v-row>
        <v-row class="mt-0">
          <v-col>
            <v-card elevation="0" class="pa-4" v-if="!loading && showSummaryTotals">
              <v-row>
                <v-col cols="6" class="pt-2 pb-2 pr-1">
                  <v-card variant="outlined" class="border-thin">
                    <v-card-title class="text-caption text-medium-emphasis font-weight-regular"
                      >Saldo Inicial</v-card-title
                    >
                    <v-card-text
                      class="text-subtitle-1 font-weight-bold"
                      :class="summaryTotals.executed_history_balance_amount < 0 ? 'text-red' : ''"
                    >
                      {{
                        userMonetaryValueFormatter(summaryTotals.executed_history_balance_amount)
                      }}
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="6" class="pt-2 pb-2 pl-1">
                  <v-card variant="outlined" class="border-thin">
                    <v-card-title class="text-caption text-medium-emphasis font-weight-regular"
                      >Saldo Atual</v-card-title
                    >
                    <v-card-text
                      class="text-subtitle-1 font-weight-bold"
                      :class="summaryTotals.executed_balance_amount < 0 ? 'text-red' : ''"
                    >
                      {{ userMonetaryValueFormatter(summaryTotals.executed_balance_amount) }}
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="6" class="pt-0 pb-2 pr-1">
                  <v-card variant="outlined" class="border-thin">
                    <v-card-title class="text-caption text-medium-emphasis font-weight-regular"
                      >Saldo Final</v-card-title
                    >
                    <v-card-text
                      class="text-subtitle-1 font-weight-bold"
                      :class="summaryTotals.forecast_balance_amount < 0 ? 'text-red' : ''"
                    >
                      {{ userMonetaryValueFormatter(summaryTotals.forecast_balance_amount) }}
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="6" class="pt-0 pb-2 pl-1">
                  <v-row>
                    <v-col>
                      <v-card variant="outlined" class="border-thin">
                        <v-card-text class="pt-0 pb-0">
                          <v-row class="mt-0">
                            <v-col cols="12">
                              <v-icon
                                icon="mdi-arrow-up-circle-outline"
                                class="mr-1"
                                color="teal darken-2"
                              />
                              {{ userMonetaryValueFormatter(summaryTotals.forecast_income_amount) }}
                            </v-col>
                          </v-row>
                          <v-row class="mt-0">
                            <v-col>
                              <v-icon
                                icon="mdi-arrow-down-circle-outline"
                                class="mr-1"
                                color="red"
                              />
                              {{
                                userMonetaryValueFormatter(summaryTotals.forecast_expense_amount)
                              }}
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <v-row
          v-if="transactions.length > 0"
          v-for="transaction in transactions"
          :key="transaction.id"
          class="mt-0"
        >
          <v-col>
            <v-card elevation="0">
              <template v-slot:prepend>
                <v-chip
                  v-if="transaction.status == PAYMENT_STATUS.PAID"
                  color="teal darken-2"
                  class="mr-1"
                >
                  <v-icon icon="mdi-check" class="mr-1" color="teal-lighten-2" />
                  <b>PAGO</b>
                </v-chip>
                <v-chip v-else @click="markAsPaid(transaction.id)" color="orange" class="mr-1">
                  <v-icon icon="mdi-alert" class="mr-1" color="orange" />
                  <b>PENDENTE</b>
                  <LoaderCircular v-if="loadingMarkAsPaid[transaction.id]" class="ml-1" />
                </v-chip>
                <v-chip
                  v-if="transaction.is_reconciled"
                  @click="toogleReconciled(transaction.id)"
                  color="teal darken-2"
                  class="mr-1"
                >
                  <v-icon icon="mdi-check" class="mr-1" color="teal-lighten-2" />
                  <b>CONCILIADO</b>
                  <LoaderCircular v-if="loadingToogleReconciled[transaction.id]" class="ml-1" />
                </v-chip>
                <v-chip
                  v-else
                  @click="toogleReconciled(transaction.id)"
                  color="orange"
                  class="mr-1"
                >
                  <v-icon icon="mdi-alert" class="mr-1" color="orange" />
                  <b>NÃO CONCILIADO</b>
                  <LoaderCircular v-if="loadingToogleReconciled[transaction.id]" class="ml-1" />
                </v-chip>
              </template>

              <v-card-title class="text-subtitle-1">
                <v-row>
                  <v-col class="text-wrap text-black">
                    <v-icon
                      :icon="
                        transaction.type == TRANSACTION_TYPE.EXPENSE
                          ? 'mdi-arrow-down-circle'
                          : 'mdi-arrow-up-circle'
                      "
                      class="mr-1"
                      :color="
                        transaction.type == TRANSACTION_TYPE.EXPENSE ? 'red' : 'teal darken-2'
                      "
                    />
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
                <v-btn
                  variant="text"
                  color="red"
                  @click.stop="openDeleteConfirmation(transaction.id)"
                  >Excluir</v-btn
                >
                <v-btn variant="text" @click.stop="showEditForm(transaction)">Editar</v-btn>
                <v-spacer />
                <v-btn
                  :icon="showCardsDetail[transaction.id] ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                  @click="showCardsDetail[transaction.id] = !showCardsDetail[transaction.id]"
                />
              </v-card-actions>

              <v-expand-transition>
                <div v-show="showCardsDetail[transaction.id]">
                  <v-card-subtitle class="mb-2 mt-4">
                    <v-row class="mt-0">
                      <v-col cols="8">
                        <v-icon icon="mdi-information-outline" class="mr-1" />
                        PARCELA {{ transaction.current_installment }}/{{
                          transaction.total_installments
                        }}
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
                          <b>{{ transaction.classification.name }}</b>
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
                          <b>{{ transaction.category.name }}</b>
                        </v-chip>
                      </v-col>
                    </v-row>
                    <v-row class="mt-0 mb-1">
                      <v-col class="text-wrap">
                        <v-chip class="mr-1">
                          <b>{{ transaction.sub_category.name }}</b>
                        </v-chip>
                      </v-col>
                    </v-row>

                    <div
                      v-if="
                        transaction.primary_note ||
                        transaction.secondary_note ||
                        transaction.spending_average
                      "
                    >
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
          </v-col>
        </v-row>
        <v-row v-else class="mt-0">
          <v-col>
            <v-card elevation="0" height="100%" class="pt-16 pb-16">
              <v-row>
                <v-col class="d-flex justify-center">
                  <v-icon size="128" color="orange-darken-2">mdi-text-box-search-outline</v-icon>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex justify-center">
                  <span> Nenhum resultado </span>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <CashFlowFilter :model-value="showFilter" @applyFilters="applyFilters" @cancel="resetFilters" />

    <LoaderDialog :model-value="loading" />

    <ConfirmationDialog
      :model-value="showConfirmation"
      :persistent="false"
      @confirm="deleteTransaction"
      @cancel="resetDeleteConfirmation"
    />

    <v-btn
      @click.prevent="showAddForm()"
      position="fixed"
      location="bottom right"
      class="ma-4"
      size="large"
      icon="mdi-plus"
      color="teal darken-2"
    />
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useDisplay } from 'vuetify';
import { useRouter } from 'vue-router';
import { axiosHelper } from '@/helper/axios.helper';
import { useDateHandler } from '@/composables/useDateHandler';
import { useMonetaryValueHandler } from '@/composables/useMonetaryValueHandler';
import { useSnackbarStore } from '@/store/snackbar.store';
import LoaderDialog from '@/components/generics/LoaderDialog.vue';
import LoaderCircular from '@/components/generics/LoaderCircular.vue';
import ConfirmationDialog from '@/components/generics/ConfirmationDialog.vue';
import CashFlowFilter from '@/components/cash_flow/CashFlowFilter.vue';
import { TRANSACTION_TYPE } from '@/enums/transaction_type';
import { PAYMENT_STATUS } from '@/enums/payment_status';

const { userDateFormatter, apiDateFormatter } = useDateHandler();
const { userMonetaryValueFormatter } = useMonetaryValueHandler();
const snackbarStore = useSnackbarStore();
const { mdAndUp } = useDisplay();
const router = useRouter();
const transactions = ref([]);
const summaryTotals = ref({});
const filters = ref(null);
const showFilter = ref(false);
const showSummaryTotals = ref(true);
const loading = ref(false);
const loadingToogleReconciled = ref([]);
const loadingMarkAsPaid = ref([]);
const showCardsDetail = ref([]);
const showConfirmation = ref(false);
const deletedTransactionId = ref(null);

const applyFilters = newFilters => {
  filters.value = newFilters;
  showFilter.value = false;
  getAllTransactions();
};

const resetFilters = () => {
  showFilter.value = false;
  filters.value = null;
};

const getAllTransactions = async () => {
  loading.value = true;
  const url = '/cashflow/transaction';
  const res = await axiosHelper.get(url, filters.value);
  loading.value = false;

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
    showSummaryTotals.value = false;
    transactions.value = [];
    summaryTotals.value = {};
    return;
  }

  transactions.value = res.data.transactions;
  summaryTotals.value = res.data.totals;
};

const exportList = async () => {
  loading.value = true;
  const url = '/cashflow/transaction/export';
  const reqType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  const options = {
    responseType: 'blob',
    headers: {
      Accept: reqType,
    },
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

const openDeleteConfirmation = id => {
  deletedTransactionId.value = id;
  showConfirmation.value = true;
};

const resetDeleteConfirmation = () => {
  deletedTransactionId.value = null;
  showConfirmation.value = false;
};

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

const toogleReconciled = async id => {
  const index = transactions.value.findIndex(item => item.id === id);
  const isReconciled = transactions.value[index].is_reconciled;
  loadingToogleReconciled.value[id] = true;
  const url = `/cashflow/transaction/${id}`;
  const payload = {
    is_reconciled: !isReconciled,
  };
  const res = await axiosHelper.put(url, payload);
  loadingToogleReconciled.value[id] = false;

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
    return;
  }

  transactions.value[index].is_reconciled = !isReconciled;
};

const markAsPaid = async id => {
  const index = transactions.value.findIndex(item => item.id === id);
  const paymentDate = apiDateFormatter(new Date());

  loadingMarkAsPaid.value[id] = true;
  const url = `/cashflow/transaction/${id}`;
  const payload = {
    status: PAYMENT_STATUS.PAID,
    payment_date: paymentDate,
  };
  const res = await axiosHelper.put(url, payload);
  loadingMarkAsPaid.value[id] = false;

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
    return;
  }

  transactions.value[index].status = PAYMENT_STATUS.PAID;
  transactions.value[index].payment_date = paymentDate;
};

// TODO UNIFICAR METODOS
const showAddForm = () => {
  router.push({ name: 'transaction-form' });
};

const showEditForm = item => {
  router.push({ name: 'transaction-form', params: { id: item.id } });
};
</script>
