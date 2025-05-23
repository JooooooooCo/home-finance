<template>
  <v-dialog v-model="dialogPicker" width="auto">
    <template #activator="{ props }">
      <v-text-field
        :model-value="userFormattedDate"
        :label="label"
        readonly
        tabindex="-1"
        v-bind="props"
        prepend-inner-icon="mdi-calendar"
        clearable
        variant="solo-filled"
        flat
        rounded-sm
        @click.stop.prevent="openDialog"
      />
    </template>

    <v-card>
      <v-date-picker v-if="dialogPicker" v-model="datePickerInicialValue" @update:model-value="selectDate" locale="pt-BR" show-adjacent-months />
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import dayjs from 'dayjs';
import { useDateHandler } from '@/composables/useDateHandler'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  inputLabel: {
    type: String,
    required: true,
  },
  externalOpenDialog: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(['update:modelValue'])
const { userDateFormatter, apiDateFormatter, convertStringToDate } = useDateHandler();

const datePickerInicialValue = computed(() => {
  return selectedDate.value ? new Date(selectedDate.value) : new Date();
});

const userFormattedDate = computed(() => {
  return userDateFormatter(selectedDate.value);
});

const apiFormattedDate = computed(() => {
  return apiDateFormatter(selectedDate.value);
});

const label = ref(props.inputLabel);
const dialogPicker = ref(false);
const selectedDate = ref('');

const selectDate = (date) => {
  selectedDate.value = date;
  emit('update:modelValue', apiFormattedDate.value);
  dialogPicker.value = false;
}

const openDialog = () => {
  dialogPicker.value = true;
}

watch(() => props.modelValue, (val) => {
  selectedDate.value = !val ? '' : dayjs(val, 'YYYY-MM-DD').toDate();
});

watch(() => props.externalOpenDialog, (val) => {
  dialogPicker.value = val;
});

onMounted(() => {
  if (props.modelValue) {
    selectedDate.value = convertStringToDate(props.modelValue);
  }
});
</script>