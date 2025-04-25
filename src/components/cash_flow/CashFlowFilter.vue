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

                <v-col cols="12">
                    <v-row>
                        <v-col cols="12" class="d-flex justify-center mb-3">
                            <TransactionTypeSelector :multiple="true" v-model="filters.transactionTypeIds" />
                        </v-col>
                    </v-row>
    
                    <v-row>
                        <v-col cols="12">
                            <PaymentTypeSelectorMultiple v-model="filters.paymentTypeIds" />
                        </v-col>
                    </v-row>
    
                    <v-row>
                        <v-col cols="12">
                            <PaymentStatusTypeSelectorMultiple v-model="filters.paymentStatusIds" />
                        </v-col>
                    </v-row>
    
                    <v-row>
                        <v-col cols="6">
                            <v-text-field label="Valor Min" v-model="filters.amountMin" prefix="R$" type="number" variant="solo-filled" flat rounded-sm required hideDetails />
                        </v-col>
                        <v-col cols="6">
                            <v-text-field label="Valor Max" v-model="filters.amountMax" prefix="R$" type="number" variant="solo-filled" flat rounded-sm required hideDetails />
                        </v-col>
                    </v-row>
    
                    <v-row>
                        <v-col cols="12">
                            <PrimaryCategorySelector v-model="filters.primaryCategoryId" hideDetails />
                        </v-col>
                    </v-row>
    
                    <v-row>
                        <v-col cols="12">
                            <SecondaryCategorySelector v-model="filters.secondaryCategoryId" :requireTransactionType="false" hideDetails />
                        </v-col>
                    </v-row>
    
                    <v-row>
                        <v-col cols="12">
                            <SpecificCategorySelector v-model="filters.specificCategoryId" :secondaryCategoryId="filters.secondaryCategoryId" hideDetails />
                        </v-col>
                    </v-row>
    
                    <v-row>
                        <v-col cols="12">
                            <v-textarea label="Descrição" v-model="filters.description" required rows="2" auto-grow variant="solo-filled" flat rounded-sm hide-details />
                        </v-col>
                    </v-row>
    
                    <v-row>
                        <v-col cols="6" class="mt-0">
                            <v-checkbox
                                v-model="filters.reconciled"
                                color="teal darken-2"
                                label="Conciliado"
                            />
                        </v-col>
                        <v-col cols="6" class="mt-0">
                            <v-checkbox
                                v-model="filters.notReconciled"
                                color="teal darken-2"
                                label="Não conciliado"
                            />
                        </v-col>
                    </v-row>
    
                    filters: {{ filters }}
                </v-col>

                <v-footer color="teal darken-2">
                    <v-btn icon="mdi-close" variant="text" @click="cancel"></v-btn>
                    <v-spacer />
                    <v-btn prepend-icon="mdi-check" text="Apply filters" variant="text" @click="applyFilters" />
                </v-footer>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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
    transactionTypeIds: [1,2],
    paymentTypeIds: [],
    paymentStatusIds: [],
    amountMin: '',
    amountMax: '',
    primaryCategoryId: null,
    secondaryCategoryId: null,
    specificCategoryId: null,
    description: '',
    reconciled: 1,
    notReconciled: 1,
}
const filters = ref(emptyFilterObject);

const emit = defineEmits(['update:modelValue', 'applyFilters', 'cancel'])

const isOpen = computed({
    get: () => props.modelValue,
    set: val => emit('update:modelValue', val),
})

const applyFilters = () => {
    const selectedFilters = {
        ... filters.value,
        reconciled: filters.value.reconciled ? 1 : 0,
        notReconciled: filters.value.notReconciled ? 1 : 0,
    }
    emit('applyFilters', selectedFilters)
    isOpen.value = false
}

const cancel = () => {
    emit('cancel')
    isOpen.value = false
}

onMounted(() => {
    applyFilters();
});
</script>