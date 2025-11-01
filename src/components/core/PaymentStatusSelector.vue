<template>
  <v-btn-toggle
    v-model="selectedItem"
    @update:modelValue="changeSelection"
    :multiple="multipleChoice"
    :mandatory="!multipleChoice"
    :group="!multipleChoice"
    border
    divided
  >
    <v-btn :value="PAYMENT_STATUS.PENDING" color="orange-darken-2" prepend-icon="mdi-alert">
      PENDENTE
    </v-btn>

    <v-btn :value="PAYMENT_STATUS.PAID" color="teal darken-2" prepend-icon="mdi-check">
      PAGO
    </v-btn>
  </v-btn-toggle>
</template>

<script setup>
import { ref, watch } from 'vue';
import { PAYMENT_STATUS } from '@/enums/payment_status';

const props = defineProps({
  modelValue: {
    type: [String, Array],
    required: true,
  },
  multipleChoice: {
    type: Boolean,
    default: false,
  },
});

const selectedItem = ref(props.modelValue);

const emit = defineEmits(['update:modelValue']);

watch(
  () => props.modelValue,
  val => {
    selectedItem.value = val;
  }
);

const changeSelection = value => {
  emit('update:modelValue', value);
};
</script>
