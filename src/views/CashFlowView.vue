<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-list v-if="!showForm">
          <v-card
            v-for="transaction in transactions"
            :key="transaction.id"
            class="mb-4"
            variant="tonal"
          >
            <v-card-title class="d-flex ">
              <div>
                <v-icon v-if="transaction.transaction_type_id == 1" color="error" icon="mdi-arrow-down"></v-icon>
                <v-icon v-else color="success" icon="mdi-arrow-up"></v-icon>
              </div>
              <span class="font-weight-bold">{{ transaction.description }}</span>
            </v-card-title>

            <v-card-text>
              <v-row dense>
                <v-col cols="6"><strong>ID:</strong> {{ transaction.id }}</v-col>
                <v-col cols="6"><strong>Tipo Transação:</strong> {{ transaction.transaction_type_id }}</v-col>
                <v-col cols="6"><strong>Tipo Pagamento:</strong> {{ transaction.payment_type_id }}</v-col>
                <v-col cols="6"><strong>Status Pagamento:</strong> {{ transaction.payment_status_id }}</v-col>
                <v-col cols="6"><strong>Data Compra:</strong> {{ transaction.purchase_date }}</v-col>
                <v-col cols="6"><strong>Data Vencimento:</strong> {{ transaction.due_date }}</v-col>
                <v-col cols="6"><strong>Data Pagamento:</strong> {{ transaction.payment_date }}</v-col>
                <v-col cols="6"><strong>Valor:</strong> R$ {{ transaction.amount }}</v-col>
                <v-col cols="6"><strong>Parcela:</strong> {{ transaction.current_installment }}/{{ transaction.total_installments }}</v-col>
                <v-col cols="6"><strong>Categoria Primária:</strong> {{ transaction.primary_category_id }}</v-col>
                <v-col cols="6"><strong>Categoria Secundária:</strong> {{ transaction.secondary_category_id }}</v-col>
                <v-col cols="6"><strong>Categoria Específica:</strong> {{ transaction.specific_category_id }}</v-col>
                <v-col cols="6"><strong>Observação Primária:</strong> {{ transaction.primary_note ?? '—' }}</v-col>
                <v-col cols="6"><strong>Observação Secundária:</strong> {{ transaction.secondary_note ?? '—' }}</v-col>
                <v-col cols="6"><strong>Média Gasto:</strong> {{ transaction.spending_average ?? '—' }}</v-col>
                <v-col cols="6"><strong>É Real?</strong> {{ transaction.is_real ? 'Sim' : 'Não' }}</v-col>
                <v-col cols="6"><strong>Conciliado?</strong> {{ transaction.is_reconciled ? 'Sim' : 'Não' }}</v-col>
                <v-col cols="6"><strong>Centro de Custo:</strong> {{ transaction.cost_center_id }}</v-col>
                <v-col cols="6"><strong>Criado em:</strong> {{ transaction.created_at }}</v-col>
                <v-col cols="6"><strong>Atualizado em:</strong> {{ transaction.updated_at }}</v-col>
              </v-row>
            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn color="black" @click.stop="showEditForm(transaction)">Editar</v-btn>
              <v-btn color="red" @click.stop="deleteTransaction(transaction.id)">Excluir</v-btn>
            </v-card-actions>
          </v-card>
        </v-list>

        <TransactionForm
          v-if="showForm"
          :model-value="selectedTransaction"
          @submit="saveTransaction"
          @cancel="hideForm"
        />
      </v-col>
    </v-row>

    <v-btn v-if="!showForm" @click.prevent="showAddForm()" position="fixed" location="bottom right" class="ma-4" size="large"
      icon="mdi-plus" color="teal darken-2" />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { axiosHelper } from "@/helper/axios.helper";
import { useSnackbarStore } from '@/store/snackbar.store';
import TransactionForm from '@/components/cash_flow/TransactionForm.vue';

const snackbarStore = useSnackbarStore();
const transactions = ref([]);
const showForm = ref(false);
const selectedTransaction = ref({ id: null, name: null });

const getAllTransactions = async () => {
  const url = "/cashflow/transaction";
  const res = await axiosHelper.get(url);

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
  }

  transactions.value = res.data;
};

const saveTransaction = async (item) => {
  const method = item.id ? "put" : "post";
  const url = item.id ? `/cashflow/transaction/${item.id}` : "/cashflow/transaction";
  const body = item;

  const res = await axiosHelper[method](url, body);

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
  }

  hideForm();
};

const deleteTransaction = async (id) => {
  const url = `/cashflow/transaction/${id}`;
  const res = await axiosHelper.delete(url);

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