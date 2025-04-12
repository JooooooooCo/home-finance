<template>
  <v-dialog v-model="dialogPicker" width="auto">
    <template #activator="{ props }">
      <v-text-field :model-value="formattedDate" :label="label" readonly v-bind="props" clearable variant="outlined" />
    </template>

    <v-card>
      <v-date-picker v-model="parsedDate" @update:model-value="closeDatePicker" locale="pt-BR" show-adjacent-months />
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useDate } from 'vuetify';

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  inputLabel: {
    type: String,
    required: true,
  },
});

const dateAdapter = useDate();
const parsedDate = ref(dateAdapter.parseISO(props.modelValue));
const formattedDate = computed(() => {
  if (!parsedDate.value) return '';
  return dateAdapter.format(parsedDate.value, 'keyboardDate');
})

const label = ref(props.inputLabel);
const dialogPicker = ref(false);

const closeDatePicker = () => {
  dialogPicker.value = false;
}
</script>