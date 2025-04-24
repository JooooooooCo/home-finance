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
import { axiosHelper } from '@/helper/axios.helper';
import { useSnackbarStore } from '@/store/snackbar.store';
import SelectPickerMultiple from '../generics/SelectPickerMultiple.vue';

const snackbarStore = useSnackbarStore();
const availableOptions = ref([]);

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
})

const emit = defineEmits(['update:modelValue']);

const label = "Modo de Pagamento";
const selectedItems = ref([...props.modelValue]);

watch(() => props.modelValue, (newVal) => {
  selectedItems.value = [...newVal];
});

const changeSelection = (values) => {
  emit('update:modelValue', values);
}

const getAllOptions = async () => {
  const url = "/settings/payment-type";
  const res = await axiosHelper.get(url);

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
    return;
  }

  availableOptions.value = res.data;
}

onMounted(() => {
  getAllOptions();
})
</script>
