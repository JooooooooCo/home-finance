<template>
  <v-card class="pa-4" variant="text">
    <v-form @submit.prevent="submitForm" ref="formRef">
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
          <DatePicker inputLabel="Data da Compra" :modelValue="form.purchase_date" />
        </v-col>

        <v-col cols="12">
          <DatePicker inputLabel="Data da Vencimento" :modelValue="form.due_date" />
        </v-col>

        <v-col cols="12">
          <DatePicker inputLabel="Data da Pagamento" :modelValue="form.payment_date" />
        </v-col>

        <v-col cols="12">
          <v-textarea label="Descrição" v-model="form.description" required rows="2" auto-grow variant="outlined" />
        </v-col>

        <v-col cols="12">
          <v-text-field label="Valor" v-model="form.amount" prefix="R$" type="number" variant="outlined" required />
        </v-col>

        <v-col cols="6">
          <NumberStepperInput v-model="form.current_installment" label="Parcela Atual" />
        </v-col>

        <v-col cols="6">
          <NumberStepperInput v-model="form.total_installments" label="Total de Parcelas" />
        </v-col>

        <v-col cols="12">
          <v-text-field label="Categoria Primária" v-model="form.primary_category_id" type="number"
            variant="outlined" />
        </v-col>

        <v-col cols="12">
          <v-text-field label="Categoria Secundária" v-model="form.secondary_category_id" type="number"
            variant="outlined" />
        </v-col>

        <v-col cols="12">
          <v-text-field label="Categoria Específica" v-model="form.specific_category_id" type="number"
            variant="outlined" />
        </v-col>

        <v-col cols="12">
          <v-textarea label="Observação Primária" v-model="form.primary_note" rows="2" variant="outlined" />
        </v-col>

        <v-col cols="12">
          <v-textarea label="Observação Secundária" v-model="form.secondary_note" rows="2" variant="outlined" />
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
            <v-btn block color="grey" @click="$emit('cancel')">Cancelar</v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn block color="teal darken-2" type="submit" variant="elevated">Salvar</v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script setup>
import DatePicker from '../generics/DatePicker.vue'
import NumberStepperInput from '../generics/NumberStepperInput.vue'
import TransactionTypeSelector from '../core/TransactionTypeSelector.vue'
import PaymentTypeSelector from '../core/PaymentTypeSelector.vue'
import PaymentStatusTypeSelector from '../core/PaymentStatusTypeSelector.vue'
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: Object
})

const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])

const form = ref({ ...props.modelValue })

watch(() => props.modelValue, (val) => {
  form.value = { ...val }
})

const formRef = ref(null)

const submitForm = () => {
  emit('submit', form.value)
}
</script>
