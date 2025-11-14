<template>
  <v-card elevation="0">
    <v-card-title v-if="isFromAI">
      <v-btn
        icon="mdi-arrow-left"
        variant="text"
        color="teal darken-2"
        @click="goBackToAI"
        class="mr-2"
      />
      <v-icon icon="mdi-robot-happy-outline" class="mr-2" />
      Revisar Transação Sugerida pela IA
    </v-card-title>
    <v-card-title v-else-if="isEdit"> Editar Transação </v-card-title>
    <v-card-title v-else> Adicionar Transação </v-card-title>

    <v-form @submit.prevent="saveTransaction">
      <v-card-text class="pb-16">
        <v-row dense>
          <v-col cols="12" class="d-flex justify-center mb-3">
            <TransactionTypeSelector v-model="form.type" />
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="12" md="4">
            <PaymentTypeSelector
              v-model="form.payment_type_id"
              @update:modelValue="nextField('payment_type')"
            />
          </v-col>

          <v-col cols="12" md="4" class="d-flex justify-center mb-3">
            <PaymentStatusSelector v-model="form.status" />
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="12" md="4">
            <DatePicker
              inputLabel="Data da Compra"
              :externalOpenDialog="openedField.purchase_date"
              v-model="form.purchase_date"
              @update:modelValue="nextField('purchase_date')"
            />
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
            <v-text-field
              label="Valor"
              v-model="form.amount"
              prefix="R$"
              prepend-inner-icon="mdi-currency-usd"
              type="number"
              variant="outlined"
              flat
              rounded-sm
              required
            />
          </v-col>

          <v-col cols="6" md="2">
            <NumberStepperInput
              v-model="form.current_installment"
              label="Parcela Atual"
              :hideDetails="false"
            />
          </v-col>

          <v-col cols="6" md="2">
            <NumberStepperInput
              v-model="form.total_installments"
              label="Total de Parcelas"
              :hideDetails="false"
            />
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
              variant="outlined"
              flat
              rounded-sm
            />
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="12" md="4">
            <ClassificationSelector
              v-model="form.classification_id"
              :externalOpenDialog="openedField.classification"
              @update:modelValue="nextField('classification')"
            />
          </v-col>

          <v-col cols="12" md="4">
            <CategorySelector
              v-model="form.category_id"
              :type="form.type"
              :externalOpenDialog="openedField.category"
              @update:modelValue="nextField('category')"
            />
          </v-col>

          <v-col cols="12" md="4">
            <SubCategorySelector
              v-model="form.sub_category_id"
              :categoryId="form.category_id"
              :externalOpenDialog="openedField.sub_category"
            />
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="12">
            <v-btn
              variant="text"
              :text="showNotesFields ? 'OCULTAR OBSERVAÇÕES' : 'EXIBIR OBSERVAÇÕES'"
              color="teal darken-2"
              :prepend-icon="showNotesFields ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
              rounded
              @click="showNotesFields = !showNotesFields"
            />
          </v-col>
        </v-row>

        <v-row dense v-if="showNotesFields">
          <v-col cols="12" md="4">
            <v-textarea
              label="Observação Principal"
              v-model="form.primary_note"
              @input="form.primary_note = form.primary_note.toUpperCase()"
              rows="2"
              variant="outlined"
              flat
              rounded-sm
              :hideDetails="mdAndUp"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-textarea
              label="Observação Secundária"
              v-model="form.secondary_note"
              @input="form.secondary_note = form.secondary_note.toUpperCase()"
              rows="2"
              variant="outlined"
              flat
              rounded-sm
              :hideDetails="mdAndUp"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-textarea
              label="Média de gasto"
              v-model="form.spending_average"
              @input="form.spending_average = form.spending_average.toUpperCase()"
              rows="2"
              variant="outlined"
              flat
              rounded-sm
              :hideDetails="mdAndUp"
            />
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="6">
            <v-switch
              label="Real"
              inset
              color="teal darken-2"
              :true-value="1"
              :false-value="0"
              v-model="form.is_real"
            />
          </v-col>

          <v-col cols="6">
            <v-switch
              label="Conciliado"
              inset
              color="teal darken-2"
              :true-value="1"
              :false-value="0"
              v-model="form.is_reconciled"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="position-fixed bottom-0 left-0 w-100">
        <v-row class="pr-5 pl-5">
          <v-col cols="6" class="bg-white">
            <v-btn block color="grey" @click="close">Cancelar</v-btn>
          </v-col>
          <v-col cols="6" class="bg-white">
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
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { axiosHelper } from '@/helper/axios.helper';
import { useSnackbarStore } from '@/store/snackbar.store';
import DatePicker from '@/components/generics/DatePicker.vue';
import LoaderDialog from '@/components/generics/LoaderDialog.vue';
import NumberStepperInput from '@/components/generics/NumberStepperInput.vue';
import TransactionTypeSelector from '@/components/core/TransactionTypeSelector.vue';
import PaymentTypeSelector from '@/components/core/PaymentTypeSelector.vue';
import PaymentStatusSelector from '@/components/core/PaymentStatusSelector.vue';
import ClassificationSelector from '@/components/core/ClassificationSelector.vue';
import CategorySelector from '@/components/core/CategorySelector.vue';
import SubCategorySelector from '@/components/core/SubCategorySelector.vue';
import { TRANSACTION_TYPE } from '@/enums/transaction_type';
import { PAYMENT_STATUS } from '@/enums/payment_status';

// TODO: refact to use consts or params from db config
const CASH_PAYMENT_TYPE_IDS = [1, 5, 6, 7, 8];

const props = defineProps({
  modelValue: Object,
});

const emit = defineEmits(['update:modelValue', 'submit', 'close']);

const router = useRouter();
const loading = ref(false);
const generateBatchTransactionsConfirmation = ref(false);
const snackbarStore = useSnackbarStore();
const { mdAndUp } = useDisplay();
const isFromAI = ref(false);

const currentDate = dayjs();
const defaultEmptyForm = {
  type: TRANSACTION_TYPE.EXPENSE,
  payment_type_id: null,
  status: PAYMENT_STATUS.PENDING,
  purchase_date: currentDate.format('YYYY-MM-DD'),
  due_date: '',
  payment_date: '',
  amount: null,
  current_installment: 1,
  total_installments: 1,
  description: '',
  classification_id: null,
  category_id: null,
  sub_category_id: null,
  primary_note: '',
  secondary_note: '',
  spending_average: '',
  is_real: 1,
  is_reconciled: 0,
};
const form = ref(props.modelValue ? { ...props.modelValue } : { ...defaultEmptyForm });
const showNotesFields = ref(false);
const openedField = ref({
  purchase_date: false,
  classification: false,
  category: false,
  sub_category: false,
});

watch(
  () => props.modelValue,
  val => {
    form.value = { ...val };
    autoFill();
    isFromAI.value = !!localStorage.getItem('suggestedTransaction');
    if (isFromAI.value && form.value.total_installments > 1) {
      generateBatchTransactionsConfirmation.value = true;
    }
  }
);

const validateForm = () => {
  if (!form.value.type)
    return snackbarStore.showSnackbar('Informe o tipo de transação (receita ou despesa)');
  if (!form.value.payment_type_id) return snackbarStore.showSnackbar('Informe o modo de pagamento');
  if (!form.value.status) return snackbarStore.showSnackbar('Informe a situação de pagamento');
  if (!form.value.purchase_date) return snackbarStore.showSnackbar('Informe a data de compra');
  if (!form.value.due_date) return snackbarStore.showSnackbar('Informe a data de vencimento');
  if (!form.value.payment_date && form.value.status == PAYMENT_STATUS.PAID)
    return snackbarStore.showSnackbar('Informe a data de pagamento');
  if (!form.value.description) return snackbarStore.showSnackbar('Informe a descrição');
  if (!form.value.amount && form.value.amount != 0)
    return snackbarStore.showSnackbar('Informe o valor');
  if (!form.value.current_installment) return snackbarStore.showSnackbar('Informe a parcela atual');
  if (!form.value.total_installments)
    return snackbarStore.showSnackbar('Informe o total de parcelas');
  if (!form.value.classification_id) return snackbarStore.showSnackbar('Informe a classificação');
  if (!form.value.category_id) return snackbarStore.showSnackbar('Informe a categoria');
  if (!form.value.sub_category_id) return snackbarStore.showSnackbar('Informe a subcategoria');
  return true;
};

const getGenerateBatchTransactionsConfirmationLabel = computed(() => {
  if (form.value.amount) {
    const [baseInstallment] = calculateInstallments(
      form.value.amount,
      form.value.total_installments
    );
    return `Gerar ${form.value.total_installments} parcelas de ${baseInstallment} cada?`;
  }

  return `Gerar ${form.value.total_installments} parcelas?`;
});

const calculateInstallments = (amount, totalInstallments) => {
  const baseInstallment = (amount / totalInstallments).toFixed(2);
  const lastInstallment = (amount - baseInstallment * (totalInstallments - 1)).toFixed(2);
  return [baseInstallment, lastInstallment];
};

const generateBatchTransactions = () => {
  const installments = [];
  const [baseInstallment, lastInstallment] = calculateInstallments(
    form.value.amount,
    form.value.total_installments
  );
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
};

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
    return;
  }

  if (isFromAI) {
    submit();
  }

  resetFormKeepingLastPurchaseDate();
};

const createTransaction = async () => {
  if (generateBatchTransactionsConfirmation.value) {
    const url = '/cashflow/transaction/batch';
    const body = generateBatchTransactions();
    return await axiosHelper.post(url, body);
  }

  const url = '/cashflow/transaction';
  const body = form.value;
  return await axiosHelper.post(url, body);
};

const editTransaction = async () => {
  const url = `/cashflow/transaction/${form.value.id}`;
  const body = form.value;
  return await axiosHelper.put(url, body);
};

const resetOpenedFields = () => {
  Object.keys(openedField.value).forEach(key => {
    openedField.value[key] = false;
  });
};

const resetFormKeepingLastPurchaseDate = () => {
  form.value = { ...defaultEmptyForm, purchase_date: form.value.purchase_date };
  scrollTop();
};

const nextField = from => {
  resetOpenedFields();

  if (from == 'payment_type') {
    openedField.value.purchase_date = true;
    autoFill();
  }

  if (from == 'purchase_date') {
    autoFill();
  }

  if (from == 'description' && !form.value.classification_id) {
    openedField.value.classification = true;
  }

  if (from == 'classification' && !form.value.category_id) {
    openedField.value.category = true;
  }

  if (from == 'category' && !form.value.sub_category_id) {
    openedField.value.sub_category = true;
  }
};

const autoFill = () => {
  if (CASH_PAYMENT_TYPE_IDS.includes(form.value.payment_type_id)) {
    autoFillCashPayment();
    return;
  }
  autoFillCreditPayment();
};

const autoFillCashPayment = () => {
  form.value.status = PAYMENT_STATUS.PAID;
  form.value.due_date = form.value.purchase_date;
  form.value.payment_date = form.value.purchase_date;
};

const autoFillCreditPayment = () => {
  form.value.status = PAYMENT_STATUS.PENDING;
  form.value.payment_date = null;
  const purchase = form.value.purchase_date ? dayjs(form.value.purchase_date, 'YYYY-MM-DD') : null;

  if (!purchase || !purchase.isValid()) {
    form.value.due_date = null;
    return;
  }

  const day = purchase.date();

  if (day >= 1 && day <= 7) {
    const due = purchase.date(15);
    form.value.due_date = due.format('YYYY-MM-DD');
    return;
  }

  if (day >= 8 && day <= 10) {
    form.value.due_date = null;
    return;
  }

  const dueNextMonth = purchase.add(1, 'month').date(15);
  form.value.due_date = dueNextMonth.format('YYYY-MM-DD');
};

const close = () => emit('close');

const submit = () => emit('submit');

const goBackToAI = () => {
  router.push({ name: 'transaction-form-ai' });
};

const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

onMounted(() => {
  scrollTop();
});
</script>
