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
                        <TransactionTypeSelector :multipleChoice="true" v-model="filters.transactionTypeIds" />
                    </v-col>
                </v-row>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TransactionTypeSelector from '../core/TransactionTypeSelector.vue';
const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
});
const emptyFilterObject = {
    transactionTypeIds: []
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