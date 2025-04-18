<template>
  <v-btn-toggle 
    v-model="selectedTransactionType" 
    @update:modelValue="changeSelection" 
    :multiple="multipleChoice"
    :mandatory="!multipleChoice"
    :group="!multipleChoice"
  >
    <v-btn :value="1" color="red" prepend-icon="mdi-arrow-down">
      Despesa
    </v-btn>

    <v-btn :value="2" color="teal darken-2" append-icon="mdi-arrow-up">
      Receita
    </v-btn>
  </v-btn-toggle>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: [Number, Array],
    required: true
  },
  multipleChoice: {
    type: Boolean,
    default: false
  }

})

const selectedTransactionType = ref(!props.multipleChoice ? props.modelValue : []);

const emit = defineEmits(['update:modelValue']);

const changeSelection = (value) => {
  emit('update:modelValue', value);
}
</script>