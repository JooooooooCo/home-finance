<template>
  <label :for="`number-stepper-${label}`" class="v-label text-caption">{{label}}</label>
  <v-text-field :id="`number-stepper-${label}`" :model-value="modelValue" variant="solo-filled" flat rounded-xl 
    @update:model-value="val => emit('update:modelValue', Number(val))">
    <template #prepend-inner>
      <v-btn icon size="small" variant="text" @click="decrement">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
    </template>

    <template #append-inner>
      <v-btn icon size="small" variant="text" @click="increment">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
  </v-text-field>
</template>

<script setup>
import { onMounted } from 'vue'
const props = defineProps({
  modelValue: {
    type: Number,
    default: 1
  },
  label: {
    type: String,
    default: ""
  }
})

const emit = defineEmits(['update:modelValue'])

const increment = () => {
  emit('update:modelValue', props.modelValue + 1)
}

const decrement = () => {
  if (props.modelValue > 1) {
    emit('update:modelValue', props.modelValue - 1)
  }
}

onMounted(() => {
  emit('update:modelValue', props.modelValue)
});
</script>
