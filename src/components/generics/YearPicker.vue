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

const availableOptions = ref(
  Array.from({ length: 2050 - 2015 + 1 }, (_, i) => {
    const year = 2015 + i;
    return { id: year, name: String(year) };
  })
);

const props = defineProps({
  modelValue: {
    type: Number,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue']);

const selectedItem = ref(props.modelValue);

const changeSelection = value => {
  emit('update:modelValue', value);
};
</script>
