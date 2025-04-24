<template>
    <div class="text-center pa-4">
        <v-dialog v-model="isOpen" transition="dialog-bottom-transition" fullscreen>
            <v-card>
                <v-toolbar color="teal darken-2">
                    <v-btn icon="mdi-close" @click="cancel"></v-btn>

                    <v-spacer />

                    <v-toolbar-items>
                        <v-btn prepend-icon="mdi-check" text="Apply filters" variant="text"
                            @click="applyFilters" />
                    </v-toolbar-items>
                </v-toolbar>

                <v-row class="mt-2">
                    <v-col cols="12" class="d-flex justify-center mb-3">
                        <TransactionTypeSelector :multiple="true" v-model="filters.transactionTypeIds" />
                    </v-col>
                </v-row>

                <v-row class="mt-2">
                    <v-col cols="12">
                        <PaymentTypeSelectorMultiple v-model="filters.paymentTypeIds" />
                    </v-col>
                </v-row>

                <v-row class="mt-2">
                    <v-col cols="12">
                        <PaymentStatusTypeSelectorMultiple v-model="filters.paymentStatusIds" />
                    </v-col>
                </v-row>

                <v-row class="mt-2">
                    <v-col cols="12">
                        FILTROS DE DATA E VALOR
                    </v-col>
                </v-row>

                <v-row class="mt-2">
                    <v-col cols="12">
                        <PrimaryCategorySelector v-model="filters.primaryCategoryId" />
                    </v-col>
                </v-row>

                <v-row class="mt-2">
                    <v-col cols="12">
                        <SecondaryCategorySelector v-model="filters.secondaryCategoryId" :requireTransactionType="false" />
                    </v-col>
                </v-row>

                <v-row class="mt-2">
                    <v-col cols="12">
                        <SpecificCategorySelector v-model="filters.specificCategoryId" :secondaryCategoryId="filters.secondaryCategoryId" />
                    </v-col>
                </v-row>

                <v-row class="mt-2">
                    <v-col cols="12">
                        <v-textarea label="Descrição" v-model="filters.description" required rows="2" auto-grow variant="solo-filled" flat rounded-sm />
                    </v-col>
                </v-row>

                <v-row class="mt-2">
                    <v-col cols="12" class="mt-0">
                        <v-checkbox
                            v-model="filters.reconciled"
                            color="teal darken-2"
                            label="Conciliado"
                        />
                    </v-col>
                </v-row>

                <v-row class="mt-2">
                    <v-col cols="12" class="mt-0">
                        <v-checkbox
                            v-model="filters.notReconciled"
                            color="teal darken-2"
                            label="Não conciliado"
                        />
                    </v-col>
                </v-row>

                filters: {{ filters }}
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TransactionTypeSelector from '@/components/core/TransactionTypeSelector.vue';
import PaymentTypeSelectorMultiple from '@/components/core/PaymentTypeSelectorMultiple.vue';
import PaymentStatusTypeSelectorMultiple from '@/components/core/PaymentStatusTypeSelectorMultiple.vue';
import PrimaryCategorySelector from '@/components/core/PrimaryCategorySelector.vue'
import SecondaryCategorySelector from '@/components/core/SecondaryCategorySelector.vue'
import SpecificCategorySelector from '@/components/core/SpecificCategorySelector.vue'
const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
});
const emptyFilterObject = {
    transactionTypeIds: [],
    paymentTypeIds: [],Ids: [],
    primaryCategoryId: null,
    secondaryCategoryId: null,
    specificCategoryId: null,
    description: '',
    reconciled: false,
    notReconciled: false,
}
const filters = ref(emptyFilterObject);

const emit = defineEmits(['update:modelValue', 'applyFilters', 'cancel'])

const isOpen = computed({
    get: () => props.modelValue,
    set: val => emit('update:modelValue', val),
})

function applyFilters() {
    emit('applyFilters', filters.value)
    isOpen.value = false
}

function cancel() {
    emit('cancel')
    isOpen.value = false
}
</script>