<template>
  <v-btn-toggle 
    v-model="selectedItem" 
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
import { ref, watch } from 'vue';

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

const selectedItem = ref(!props.multipleChoice ? props.modelValue : []);

const emit = defineEmits(['update:modelValue']);

watch(() => props.modelValue, (val) => {
  selectedItem.value = val;
});

const changeSelection = (value) => {
  emit('update:modelValue', value);
}
</script>