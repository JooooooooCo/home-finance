<template>
  <div>
    <SelectPicker
      v-model="selectedItem"
      :items="availableOptions"
      label=""
      @update:modelValue="changeSelection"
      hideDetails
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SelectPicker from '@/components/generics/SelectPicker.vue';

const availableOptions = ref([
  { id: 1, name: 'Janeiro' },
  { id: 2, name: 'Fevereiro' },
  { id: 3, name: 'Março' },
  { id: 4, name: 'Abril' },
  { id: 5, name: 'Maio' },
  { id: 6, name: 'Junho' },
  { id: 7, name: 'Julho' },
  { id: 8, name: 'Agosto' },
  { id: 9, name: 'Setembro' },
  { id: 10, name: 'Outubro' },
  { id: 11, name: 'Novembro' },
  { id: 12, name: 'Dezembro' },
]);

const props = defineProps({
  modelValue: {
    type: Number,
    default: null
  },
});

const emit = defineEmits(['update:modelValue']);

const selectedItem = ref(props.modelValue);

const changeSelection = (value) => {
  emit('update:modelValue', value);
};
</script>
