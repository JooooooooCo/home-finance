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
import { ref, watch } from 'vue'
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
const snackbarStore = useSnackbarStore();

const currentDate = dayjs();
const defaultEmptyForm = {
  transaction_type_id: 1,
  purchase_date: currentDate.format('YYYY-MM-DD'),
  due_date: '',
  payment_date: '',
}
const form = ref(props.modelValue? { ...props.modelValue } : defaultEmptyForm)

watch(() => props.modelValue, (val) => {
  form.value = { ...val }
})

const validateForm = () => {
  if (!form.value.transaction_type_id) {
    snackbarStore.showSnackbar('Informe o tipo de transação (receita ou despesa)');
    return false;
  }
  if (!form.value.payment_type_id) {
    snackbarStore.showSnackbar('Informe o modo de pagamento');
    return false;
  }
  if (!form.value.payment_status_id) {
    snackbarStore.showSnackbar('Informe a situação de pagamento');
    return false;
  }
  if (!form.value.purchase_date) {
    snackbarStore.showSnackbar('Informe a data de compra');
    return false;
  }
  if (!form.value.due_date) {
    snackbarStore.showSnackbar('Informe a data de vencimento');
    return false;
  }
  if (!form.value.payment_date && form.value.payment_status_id == 1) {
    snackbarStore.showSnackbar('Informe a data de pagamento');
    return false;
  }
  if (!form.value.description) {
    snackbarStore.showSnackbar('Informe a descrição');
    return false;
  }
  if (!form.value.amount && form.value.amount != 0) {
    snackbarStore.showSnackbar('Informe o valor');
    return false;
  }
  if (!form.value.current_installment) {
    snackbarStore.showSnackbar('Informe a parcela atual');
    return false;
  }
  if (!form.value.total_installments) {
    snackbarStore.showSnackbar('Informe o total de parcelas');
    return false;
  }
  if (!form.value.primary_category_id) {
    snackbarStore.showSnackbar('Informe a categoria principal');
    return false;
  }
  if (!form.value.secondary_category_id) {
    snackbarStore.showSnackbar('Informe a categoria secundária');
    return false;
  }
  if (!form.value.specific_category_id) {
    snackbarStore.showSnackbar('Informe a categoria específica');
    return false;
  }
  return true;
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
