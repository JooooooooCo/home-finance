<template>
  <v-dialog v-model="isOpen" fullscreen>
    <v-card>
      <v-col cols="12" class="pt-16">
        <v-row class="pt-4">
          <v-col cols="12" sm="6" class="d-flex justify-center">
            <TransactionTypeSelector :multipleChoice="true" v-model="filters.type" />
          </v-col>

          <v-col cols="12" sm="6" class="d-flex justify-center">
            <PaymentStatusSelector :multipleChoice="true" v-model="filters.paymentStatuses" />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <PaymentTypeSelectorMultiple v-model="filters.paymentTypeIds" />
          </v-col>
        </v-row>

        <v-divider class="mt-8 mb-4" />

        <v-row>
          <v-col cols="12">
            <DateRangePicker inputLabel="Data de Vencimento" v-model="filters.dueDateRange" />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <DateRangePicker inputLabel="Data de Pagamento" v-model="filters.paymentDateRange" />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <DateRangePicker inputLabel="Data da Compra" v-model="filters.purchaseDateRange" />
          </v-col>
        </v-row>

        <v-divider class="mt-8 mb-4" />

        <v-row>
          <v-col cols="6">
            <v-text-field
              label="Valor Min"
              v-model="filters.amountMin"
              prefix="R$"
              prepend-inner-icon="mdi-currency-usd"
              type="number"
              variant="outlined"
              flat
              rounded-sm
              required
              hideDetails
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              label="Valor Max"
              v-model="filters.amountMax"
              prefix="R$"
              prepend-inner-icon="mdi-currency-usd"
              type="number"
              variant="outlined"
              flat
              rounded-sm
              required
              hideDetails
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-textarea
              label="Descrição"
              v-model="filters.description"
              required
              rows="2"
              auto-grow
              variant="outlined"
              flat
              rounded-sm
              hide-details
            />
          </v-col>
        </v-row>

        <v-divider class="mt-8 mb-4" />

        <v-row>
          <v-col cols="12">
            <ClassificationSelector v-model="filters.classificationId" hideDetails />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <CategorySelector
              v-model="filters.categoryId"
              :requireTransactionType="false"
              hideDetails
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <SubCategorySelector
              v-model="filters.subCategoryId"
              :categoryId="filters.categoryId"
              hideDetails
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="6" class="mt-0">
            <v-checkbox
              v-model="filters.reconciled"
              color="teal darken-2"
              label="Conciliado"
              :true-value="1"
              :false-value="0"
            />
          </v-col>
          <v-col cols="6" class="mt-0">
            <v-checkbox
              v-model="filters.notReconciled"
              color="teal darken-2"
              label="Não conciliado"
              :true-value="1"
              :false-value="0"
            />
          </v-col>
        </v-row>
      </v-col>

      <v-toolbar color="teal darken-2" class="elevation-2 position-fixed top-0 right-0">
        <v-btn icon="mdi-close" @click="cancel"></v-btn>

        <v-spacer />

        <v-toolbar-items>
          <v-btn
            prepend-icon="mdi-check"
            text="Apply filters"
            variant="text"
            @click="applyFilters"
          />
        </v-toolbar-items>
      </v-toolbar>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useDateHandler } from '@/composables/useDateHandler';
import TransactionTypeSelector from '@/components/core/TransactionTypeSelector.vue';
import DateRangePicker from '@/components/generics/DateRangePicker.vue';
import PaymentTypeSelectorMultiple from '@/components/core/PaymentTypeSelectorMultiple.vue';
import PaymentStatusSelector from '@/components/core/PaymentStatusSelector.vue';
import ClassificationSelector from '@/components/core/ClassificationSelector.vue';
import CategorySelector from '@/components/core/CategorySelector.vue';
import SubCategorySelector from '@/components/core/SubCategorySelector.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});
const emptyFilterObject = {
  type: [],
  paymentTypeIds: [],
  paymentStatuses: [],
  dueDateRange: [],
  paymentDateRange: [],
  purchaseDateRange: [],
  amountMin: '',
  amountMax: '',
  classificationId: null,
  categoryId: null,
  subCategoryId: null,
  description: '',
  reconciled: 1,
  notReconciled: 1,
};
const filters = ref(emptyFilterObject);

const emit = defineEmits(['update:modelValue', 'applyFilters', 'cancel']);

const { apiDateFormatter, getMonthInitialEndDate } = useDateHandler();

const isOpen = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
});

const applyFilters = () => {
  emit('applyFilters', prepareFiltersBeforeApply());
  isOpen.value = false;
};

const prepareFiltersBeforeApply = () => {
  return {
    ...filters.value,
    reconciled: filters.value.reconciled ? 1 : 0,
    notReconciled: filters.value.notReconciled ? 1 : 0,
    dueDateRange: getRangeDateFormatted(filters.value.dueDateRange),
    paymentDateRange: getRangeDateFormatted(filters.value.paymentDateRange),
    purchaseDateRange: getRangeDateFormatted(filters.value.purchaseDateRange),
  };
};

const getRangeDateFormatted = dateRange => {
  return dateRange.length > 0
    ? [apiDateFormatter(dateRange.at(0)), apiDateFormatter(dateRange.at(-1))]
    : [];
};

const cancel = () => {
  emit('cancel');
  isOpen.value = false;
};

onMounted(() => {
  filters.value.dueDateRange = getMonthInitialEndDate(new Date());
  applyFilters();
});
</script>
