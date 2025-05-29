<template>
  <v-date-input
    :label="inputLabel"
    v-model="model"
    @update:model-value="updateModel"
    @click:clear="resetModel"
    prepend-icon=""
    prepend-inner-icon="mdi-calendar"
    multiple="range"
    variant="solo-filled"
    flat
    clearable
    show-adjacent-months
    hide-details
  >
    <template #input="{ props }">
      <input v-bind="props" readonly class="v-field__input" />
    </template>
  </v-date-input>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
  inputLabel: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const model = ref(props.modelValue);

const updateModel = date => {
  model.value = date;
  emit('update:modelValue', model.value);
};

const resetModel = () => updateModel([]);
</script>
