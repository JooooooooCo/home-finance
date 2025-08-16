<template>
  <!-- <v-row> -->
  <v-col cols="12" class="pt-0">
    <v-card elevation="0" class="pa-4">
      <v-row>
        <v-col cols="7">
          <NumberStepperInput v-model="selectedYear" @update:modelValue="emitUpdateModelValue" />
        </v-col>

        <v-col v-if="!mobileView" cols="5" v-for="option in availableOptions" :key="option.id">
          <v-btn
            :color="isSelectedOption(option.id) ? 'teal darken-2' : ''"
            @click="select(option.id)"
            variant="text"
            block
            >{{ option.name }}</v-btn
          >
        </v-col>

        <v-col v-else cols="5">
          <SelectPicker
            v-model="selectedMonth"
            :items="availableOptions"
            label=""
            @update:modelValue="changeSelection"
            hideDetails
          />
        </v-col>
      </v-row>
    </v-card>
  </v-col>
  <!-- </v-row> -->
</template>

<script setup>
import { ref } from 'vue';
import SelectPicker from '@/components/generics/SelectPicker.vue';
import NumberStepperInput from '@/components/generics/NumberStepperInput.vue';
import dayjs from 'dayjs';

const availableOptions = ref([
  { id: 1, name: 'Jan' },
  { id: 2, name: 'Fev' },
  { id: 3, name: 'Mar' },
  { id: 4, name: 'Abr' },
  { id: 5, name: 'Mai' },
  { id: 6, name: 'Jun' },
  { id: 7, name: 'Jul' },
  { id: 8, name: 'Ago' },
  { id: 9, name: 'Set' },
  { id: 10, name: 'Out' },
  { id: 11, name: 'Nov' },
  { id: 12, name: 'Dez' },
]);

const props = defineProps({
  modelValue: {
    type: Object,
    default: {
      year: dayjs().format('YYYY'),
      month: dayjs().format('MM'),
    },
  },
  mobileView: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const selectedYear = ref(parseInt(props.modelValue.year));
const selectedMonth = ref(parseInt(props.modelValue.month));

const isSelectedOption = optionId => selectedMonth.value == optionId;

const changeSelection = optionId => {
  selectedMonth.value = optionId;
  emitUpdateModelValue();
};

const emitUpdateModelValue = () => {
  emit('update:modelValue', {
    year: selectedYear.value,
    month: selectedMonth.value,
  });
};
</script>
