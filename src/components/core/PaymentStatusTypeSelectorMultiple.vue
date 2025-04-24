<template>
  <SelectPickerMultiple
    v-model="selectedItems"
    :items="availableOptions"
    :label="label"
    @update:modelValue="changeSelection"
  />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { axiosHelper } from "@/helper/axios.helper";
import { useSnackbarStore } from '@/store/snackbar.store';
import SelectPickerMultiple from '../generics/SelectPickerMultiple.vue';

const snackbarStore = useSnackbarStore();
const availableOptions = ref([]);

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
});

const emit = defineEmits(['update:modelValue']);

const label = "Situação de Pagamento";
const selectedItems = ref([...props.modelValue]);

watch(() => props.modelValue, (val) => {
  selectedItems.value = [...val];
});

const changeSelection = (value) => {
  emit('update:modelValue', value);
};

const getAllOptions = async () => {
  const url = "/settings/payment-status-type";
  const res = await axiosHelper.get(url);

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
    return;
  }

  availableOptions.value = res.data;
};

onMounted(() => {
  getAllOptions();
});
</script>
