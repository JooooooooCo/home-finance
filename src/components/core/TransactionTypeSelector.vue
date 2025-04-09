<template>
  <v-btn-toggle v-model="selectedTransactionType" @update:modelValue="changeSelection" color="teal darken-2" rounded="0" mandatory group>
    <v-btn :value="1">
      Despesa
    </v-btn>

    <v-btn :value="2">
      Receita
    </v-btn>
  </v-btn-toggle>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: Number,
    default: 1
  },
})

const selectedTransactionType = ref(props.modelValue);

const emit = defineEmits(['update:modelValue']);

const changeSelection = (value) => {
  emit('update:modelValue', value);
}
</script>