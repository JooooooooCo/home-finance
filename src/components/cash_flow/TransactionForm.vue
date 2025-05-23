<template>
  <v-card class="pt-4" variant="text">    
    <v-form @submit.prevent="saveTransaction">
      <v-card-text class="pb-16">
        <v-row dense>
          <v-col cols="12" class="d-flex justify-center mb-3">
            <TransactionTypeSelector v-model="form.transaction_type_id" />
          </v-col>
        </v-row>
  
        <v-row dense>
          <v-col :cols="mdAndUp ? 4 : 12">
            <PaymentTypeSelector v-model="form.payment_type_id" @update:modelValue="nextField('payment_type')" />
          </v-col>
  
          <v-col :cols="mdAndUp ? 3 : 12">
            <PaymentStatusTypeSelector v-model="form.payment_status_id" />
          </v-col>
  
          <v-col v-if="mdAndUp" cols="2" offset="1">
            <v-switch label="Real" color="teal darken-2" :true-value="1" :false-value="0" v-model="form.is_real"/>
          </v-col>
  
          <v-col v-if="mdAndUp" cols="2">
            <v-switch label="Conciliado" color="teal darken-2" :true-value="1" :false-value="0"
              v-model="form.is_reconciled" />
          </v-col>
        </v-row>
  
        <v-row dense>
          <v-col cols="12" md="4">
            <DatePicker inputLabel="Data da Compra" :externalOpenDialog="openField.purchase_date" v-model="form.purchase_date" @update:modelValue="nextField('purchase_date')" />
          </v-col>
  
          <v-col cols="12" md="4">
            <DatePicker inputLabel="Data de Vencimento" v-model="form.due_date" />
          </v-col>
  
          <v-col cols="12" md="4">
            <DatePicker inputLabel="Data de Pagamento" v-model="form.payment_date" />
          </v-col>
        </v-row>
  
        <v-row dense>
          <v-col cols="12" md="4" class="d-flex align-end">
            <v-text-field label="Valor" v-model="form.amount" prefix="R$" prepend-inner-icon="mdi-currency-usd" type="number" variant="solo-filled" flat rounded-sm required />
          </v-col>
  
          <v-col cols="6" md="2">
            <NumberStepperInput v-model="form.current_installment" label="Parcela Atual" />
          </v-col>
  
          <v-col cols="6" md="2">
            <NumberStepperInput v-model="form.total_installments" label="Total de Parcelas" />
          </v-col>
          <v-col cols="12" md="4" class="d-flex align-end mt-0" v-if="form.total_installments > 1">
            <v-checkbox
              v-model="generateBatchTransactionsConfirmation"
              color="teal darken-2"            
              :label="getGenerateBatchTransactionsConfirmationLabel"
            />
          </v-col>
        </v-row>
  
        <v-row dense>
          <v-col cols="12">
            <v-textarea
              label="Descrição"
              v-model="form.description"
              @input="form.description = form.description.toUpperCase()"
              @blur="nextField('description')"
              prepend-inner-icon="mdi-note"
              required
              rows="2"
              auto-grow
              variant="solo-filled"
              flat
              rounded-sm
            />
          </v-col>
        </v-row>
  
        <v-row dense>
          <v-col cols="12" md="4">
            <PrimaryCategorySelector v-model="form.primary_category_id" :externalOpenDialog="openField.primary_category" @update:modelValue="nextField('primary_category')" />
          </v-col>
  
          <v-col cols="12" md="4">
            <SecondaryCategorySelector v-model="form.secondary_category_id" :transactionTypeId="form.transaction_type_id" :externalOpenDialog="openField.secondary_category" @update:modelValue="nextField('secondary_category')" />
          </v-col>
  
          <v-col cols="12" md="4">
            <SpecificCategorySelector v-model="form.specific_category_id" :secondaryCategoryId="form.secondary_category_id" :externalOpenDialog="openField.specific_category" />
          </v-col>
        </v-row>
  
        <v-row dense>
          <v-col cols="12">
            <v-btn variant="text" :text="showNotesFields ? 'OCULTAR OBSERVAÇÕES' : 'EXIBIR OBSERVAÇÕES'" color="teal darken-2"
              :prepend-icon="showNotesFields ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" rounded @click="showNotesFields = !showNotesFields" />
          </v-col>
        </v-row>

        <v-row dense v-if="showNotesFields">
          <v-col cols="12" md="4">
            <v-textarea label="Observação Principal" v-model="form.primary_note" @input="form.primary_note = form.primary_note.toUpperCase()" rows="2" variant="solo-filled" flat rounded-sm :hideDetails="mdAndUp"/>
          </v-col>
  
          <v-col cols="12" md="4">
            <v-textarea label="Observação Secundária" v-model="form.secondary_note" @input="form.secondary_note = form.secondary_note.toUpperCase()" rows="2" variant="solo-filled" flat rounded-sm :hideDetails="mdAndUp"/>
          </v-col>
  
          <v-col cols="12" md="4">
            <v-textarea label="Média de gasto" v-model="form.spending_average" @input="form.spending_average = form.spending_average.toUpperCase()" rows="2" variant="solo-filled" flat rounded-sm :hideDetails="mdAndUp"/>
          </v-col>
        </v-row>
  
        <v-row dense v-if="!mdAndUp">
          <v-col cols="6">
            <v-switch label="Real" inset color="teal darken-2" :true-value="1" :false-value="0" v-model="form.is_real"/>
          </v-col>
  
          <v-col cols="6">
            <v-switch label="Conciliado" inset color="teal darken-2" :true-value="1" :false-value="0"
              v-model="form.is_reconciled" />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="position-fixed bottom-0 left-0 w-100">
        <v-row class="bg-white">
          <v-divider />
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
import { ref, computed, watch, onMounted } from 'vue';
import { useDisplay } from 'vuetify';
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

// TODO: refact to use consts or params from db config
const CASH_PAYMENT_TYPE_ID = 1;
const PAID_PAYMENT_STATUS_ID = 1;

const props = defineProps({
  modelValue: Object,
})

const emit = defineEmits(['update:modelValue', 'submit', 'close'])

const loading = ref(false);
const generateBatchTransactionsConfirmation = ref(false);
const snackbarStore = useSnackbarStore();
const { mdAndUp } = useDisplay();

const currentDate = dayjs();
const defaultEmptyForm = {
  transaction_type_id: 1,
  payment_type_id: null,
  payment_status_id: null,
  purchase_date: currentDate.format('YYYY-MM-DD'),
  due_date: '',
  payment_date: '',
  amount: null,
  current_installment: 1,
  total_installments: 1,
  description: '',
  primary_category_id: null,
  secondary_category_id: null,
  specific_category_id: null,
  primary_note: '',
  secondary_note: '',
  spending_average: '',
  is_real: 1,
  is_reconciled: 0,
}
const form = ref(props.modelValue ? { ...props.modelValue } : { ...defaultEmptyForm })
const showNotesFields = ref(false);
const openField = ref({
  purchase_date: false,
  primary_category: false,
  secondary_category: false,
  specific_category: false,
});

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

const calculateInstallments = (amount, totalInstallments) => {
  const baseInstallment = (amount / totalInstallments).toFixed(2);
  const lastInstallment = (amount - (baseInstallment * (totalInstallments - 1))).toFixed(2);
  return [baseInstallment, lastInstallment];
}

const generateBatchTransactions = () => {
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
  const isEdit = form.value.id;
  loading.value = true;
  const res = isEdit ? await editTransaction() : await createTransaction();
  loading.value = false;

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
    return;
  }

  snackbarStore.showSnackbar(res.message, true);
  if (isEdit) {
    close();
  } else {
    resetFormKeepingLastPurchaseDate();
  }
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

const resetFormKeepingLastPurchaseDate = () => {
  form.value = { ...defaultEmptyForm, purchase_date: form.value.purchase_date }; 
  scrollTop();
};

const nextField = (from) => {
  if (form.value.payment_type_id != CASH_PAYMENT_TYPE_ID) return

  if (from == 'payment_type') {
    openField.value.purchase_date = true;
    autoFill();
  }

  if (from == 'purchase_date') {
    autoFill();
  }

  if (from == 'description') {
    openField.value.primary_category = true;
  }

  if (from == 'primary_category') {
    openField.value.secondary_category = true;
  }

  if (from == 'secondary_category') {
    openField.value.specific_category = true;
  }
}

const autoFill = () => {
  form.value.payment_status_id = PAID_PAYMENT_STATUS_ID;
  form.value.due_date = form.value.purchase_date;
  form.value.payment_date = form.value.purchase_date;
}

const close = () => emit('close');

const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

onMounted(() => {
  scrollTop();
});
</script>
