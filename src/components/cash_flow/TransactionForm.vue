<template>
  <v-card class="pa-4" variant="text">
    <v-form @submit.prevent="saveTransaction">
      <v-row dense>
        <v-col cols="12" class="d-flex justify-center mb-3">
          <TransactionTypeSelector v-model="form.transaction_type_id" />
        </v-col>

        <v-col cols="12">
          <PaymentTypeSelector v-model="form.payment_type_id" />
        </v-col>

        <v-col cols="12">
          <PaymentStatusTypeSelector v-model="form.payment_status_id" />
        </v-col>

        <v-col cols="12">
          <DatePicker inputLabel="Data da Compra" v-model="form.purchase_date" />
        </v-col>

        <v-col cols="12">
          <DatePicker inputLabel="Data da Vencimento" v-model="form.due_date" />
        </v-col>

        <v-col cols="12">
          <DatePicker inputLabel="Data da Pagamento" v-model="form.payment_date" />
        </v-col>

        <v-col cols="12">
          <v-textarea label="Descrição" v-model="form.description" required rows="2" auto-grow variant="solo-filled" flat rounded-sm />
        </v-col>

        <v-col cols="12">
          <v-text-field label="Valor" v-model="form.amount" prefix="R$" type="number" variant="solo-filled" flat rounded-sm required />
        </v-col>

        <v-col cols="6">
          <NumberStepperInput v-model="form.current_installment" label="Parcela Atual" />
        </v-col>

        <v-col cols="6">
          <NumberStepperInput v-model="form.total_installments" label="Total de Parcelas" />
        </v-col>

        <v-col cols="12" class="mt-0">
          <v-checkbox
            v-model="generateBatchTransactionsConfirmation"
            color="teal darken-2"
            v-show="form.total_installments > 1"
            :label="getGenerateBatchTransactionsConfirmationLabel"
          />
        </v-col>

        <v-col cols="12">
          <PrimaryCategorySelector v-model="form.primary_category_id" />
        </v-col>

        <v-col cols="12">
          <SecondaryCategorySelector v-model="form.secondary_category_id" :transactionTypeId="form.transaction_type_id" />
        </v-col>

        <v-col cols="12">
          <SpecificCategorySelector v-model="form.specific_category_id" :secondaryCategoryId="form.secondary_category_id" />
        </v-col>

        <v-col cols="12">
          <v-textarea label="Observação Principal" v-model="form.primary_note" rows="2" variant="solo-filled" flat rounded-sm />
        </v-col>

        <v-col cols="12">
          <v-textarea label="Observação Secundária" v-model="form.secondary_note" rows="2" variant="solo-filled" flat rounded-sm />
        </v-col>

        <v-col cols="12">
          <v-textarea label="Média de gasto" v-model="form.spending_average" rows="2" variant="solo-filled" flat rounded-sm />
        </v-col>

        <v-col cols="6">
          <v-switch label="Real" inset color="teal darken-2" :true-value="1" :false-value="0" v-model="form.is_real" />
        </v-col>

        <v-col cols="6">
          <v-switch label="Conciliado" inset color="teal darken-2" :true-value="1" :false-value="0"
            v-model="form.is_reconciled" />
        </v-col>
      </v-row>

      <v-card-actions>
        <v-row>
          <v-col cols="6">
            <v-btn block color="grey" @click="close">Cancelar</v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn block color="teal darken-2" type="submit" variant="elevated">Salvar</v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-form>
  </v-card>

  <LoaderDialog :model-value="loading" />
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import dayjs from 'dayjs';
import { axiosHelper } from "@/helper/axios.helper";
import { useSnackbarStore } from '@/store/snackbar.store';
import DatePicker from '@/components/generics/DatePicker.vue'
import LoaderDialog from '@/components/generics/LoaderDialog.vue';
import NumberStepperInput from '@/components/generics/NumberStepperInput.vue'
import TransactionTypeSelector from '@/components/core/TransactionTypeSelector.vue'
import PaymentTypeSelector from '@/components/core/PaymentTypeSelector.vue'
import PaymentStatusTypeSelector from '@/components/core/PaymentStatusTypeSelector.vue'
import PrimaryCategorySelector from '@/components/core/PrimaryCategorySelector.vue'
import SecondaryCategorySelector from '@/components/core/SecondaryCategorySelector.vue'
import SpecificCategorySelector from '@/components/core/SpecificCategorySelector.vue'

const props = defineProps({
  modelValue: Object,
})

const emit = defineEmits(['update:modelValue', 'submit', 'close'])

const loading = ref(false);
const generateBatchTransactionsConfirmation = ref(false);
const snackbarStore = useSnackbarStore();

const currentDate = dayjs();
const defaultEmptyForm = {
  transaction_type_id: 1,
  purchase_date: currentDate.format('YYYY-MM-DD'),
  due_date: '',
  payment_date: '',
}
const form = ref(props.modelValue ? { ...props.modelValue } : defaultEmptyForm)

watch(() => props.modelValue, (val) => {
  form.value = { ...val }
})

const validateForm = () => {
  if (!form.value.transaction_type_id) return snackbarStore.showSnackbar('Informe o tipo de transação (receita ou despesa)');
  if (!form.value.payment_type_id) return snackbarStore.showSnackbar('Informe o modo de pagamento');
  if (!form.value.payment_status_id) return snackbarStore.showSnackbar('Informe a situação de pagamento');
  if (!form.value.purchase_date) return snackbarStore.showSnackbar('Informe a data de compra');
  if (!form.value.due_date) return snackbarStore.showSnackbar('Informe a data de vencimento');
  if (!form.value.payment_date && form.value.payment_status_id == 1) return snackbarStore.showSnackbar('Informe a data de pagamento');
  if (!form.value.description) return snackbarStore.showSnackbar('Informe a descrição');
  if (!form.value.amount && form.value.amount != 0) return snackbarStore.showSnackbar('Informe o valor');
  if (!form.value.current_installment) return snackbarStore.showSnackbar('Informe a parcela atual');
  if (!form.value.total_installments) return snackbarStore.showSnackbar('Informe o total de parcelas');
  if (!form.value.primary_category_id) return snackbarStore.showSnackbar('Informe a categoria principal');
  if (!form.value.secondary_category_id) return snackbarStore.showSnackbar('Informe a categoria secundária');
  if (!form.value.specific_category_id) return snackbarStore.showSnackbar('Informe a categoria específica');
  return true;
}

const getGenerateBatchTransactionsConfirmationLabel = computed(() => {
  if (form.value.amount) {
    const [baseInstallment] = calculateInstallments(form.value.amount, form.value.total_installments);
    return `Gerar ${form.value.total_installments} parcelas de ${baseInstallment} cada?`
  }

  return `Gerar ${form.value.total_installments} parcelas?`;
});


function calculateInstallments(amount, totalInstallments) {
  const baseInstallment = (amount / totalInstallments).toFixed(2);
  const lastInstallment = (amount - (baseInstallment * (totalInstallments - 1))).toFixed(2);
  return [baseInstallment, lastInstallment];
}

function generateBatchTransactions() {
  const installments = [];
  const [baseInstallment, lastInstallment] = calculateInstallments(form.value.amount, form.value.total_installments);
  const baseDate = dayjs(form.value.due_date, 'YYYY-MM-DD');

  for (let i = 1; i <= form.value.total_installments; i++) {
    const installmentDueDate = baseDate.add(i - 1, 'month');
    installments.push({
      ...form.value,
      current_installment: i,
      due_date: installmentDueDate.format('YYYY-MM-DD'),
      amount: i === form.value.total_installments ? lastInstallment : baseInstallment,
    });
  }
  return installments;
}

const saveTransaction = async () => {
  if (!validateForm()) return;
  loading.value = true;
  const res = form.value.id ? await editTransaction() : await createTransaction();
  loading.value = false;

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
    return;
  }

  close();
};

const createTransaction = async () => {
  if (generateBatchTransactionsConfirmation.value) {
    const url = "/cashflow/transaction/batch";
    const body = generateBatchTransactions();
    return await axiosHelper.post(url, body);
  }

  const url = "/cashflow/transaction";
  const body = form.value;
  return await axiosHelper.post(url, body);
};

const editTransaction = async () => {
  const url = `/cashflow/transaction/${form.value.id}`;
  const body = form.value;
  return await axiosHelper.put(url, body);
};

const close = () => emit('close');
</script>
