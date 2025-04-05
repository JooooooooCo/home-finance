<template>
  <v-card class="pa-4" outlined>
    <v-card-title>
      {{ isEdit ? 'Editar Transação' : 'Nova Transação' }}
    </v-card-title>

    <v-form @submit.prevent="submitForm" ref="form">
      <v-row dense>
        <v-col cols="12">
          <v-text-field
            label="Descrição"
            v-model="form.description"
            required
          />
        </v-col>

        <v-col cols="6">
          <v-text-field
            label="Valor"
            v-model="form.amount"
            prefix="R$"
            type="number"
            required
          />
        </v-col>

        <v-col cols="6">
          <v-select
            label="Tipo de Transação"
            :items="[1, 2]"
            v-model="form.transaction_type_id"
            required
          />
        </v-col>

        <v-col cols="6">
          <v-select
            label="Tipo de Pagamento"
            :items="[1, 2, 3]"
            v-model="form.payment_type_id"
          />
        </v-col>

        <v-col cols="6">
          <v-select
            label="Status do Pagamento"
            :items="[1, 2, 3]"
            v-model="form.payment_status_id"
          />
        </v-col>

        <v-col cols="4">
          <v-text-field
            label="Data da Compra"
            v-model="form.purchase_date"
            type="date"
          />
        </v-col>

        <v-col cols="4">
          <v-text-field
            label="Data de Vencimento"
            v-model="form.due_date"
            type="date"
          />
        </v-col>

        <v-col cols="4">
          <v-text-field
            label="Data de Pagamento"
            v-model="form.payment_date"
            type="date"
          />
        </v-col>

        <v-col cols="6">
          <v-text-field
            label="Parcela Atual"
            v-model="form.current_installment"
            type="number"
          />
        </v-col>

        <v-col cols="6">
          <v-text-field
            label="Total de Parcelas"
            v-model="form.total_installments"
            type="number"
          />
        </v-col>

        <v-col cols="4">
          <v-text-field
            label="Categoria Primária"
            v-model="form.primary_category_id"
            type="number"
          />
        </v-col>

        <v-col cols="4">
          <v-text-field
            label="Categoria Secundária"
            v-model="form.secondary_category_id"
            type="number"
          />
        </v-col>

        <v-col cols="4">
          <v-text-field
            label="Categoria Específica"
            v-model="form.specific_category_id"
            type="number"
          />
        </v-col>

        <v-col cols="12">
          <v-textarea
            label="Nota Primária"
            v-model="form.primary_note"
            rows="2"
          />
        </v-col>

        <v-col cols="12">
          <v-textarea
            label="Nota Secundária"
            v-model="form.secondary_note"
            rows="2"
          />
        </v-col>

        <v-col cols="6">
          <v-switch
            label="É Real?"
            v-model="form.is_real"
          />
        </v-col>

        <v-col cols="6">
          <v-switch
            label="Está Conciliado?"
            v-model="form.is_reconciled"
          />
        </v-col>

        <v-col cols="12">
          <v-text-field
            label="Centro de Custo"
            v-model="form.cost_center_id"
            type="number"
          />
        </v-col>
      </v-row>

      <v-card-actions>
        <v-spacer />
        <v-btn color="grey" @click="$emit('cancel')">Cancelar</v-btn>
        <v-btn color="blue" type="submit">{{ isEdit ? 'Salvar' : 'Criar' }}</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
export default {
  props: {
    modelValue: Object,
    isEdit: Boolean
  },
  emits: ['update:modelValue', 'submit', 'cancel'],
  data () {
    return {
      form: { ...this.modelValue }
    }
  },
  watch: {
    modelValue (val) {
      this.form = { ...val }
    }
  },
  methods: {
    submitForm () {
      this.$emit('submit', this.form)
    }
  }
}
</script>
