<template>
  <SelectPicker v-model="selectedItem" :items="availableOptions" @update:modelValue="changeSelection"
    :label="label" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { axiosHelper } from "@/helper/axios.helper";
import { useSnackbarStore } from '@/store/snackbar.store';
import SelectPicker from '../generics/SelectPicker.vue'

const snackbarStore = useSnackbarStore();
const availableOptions = ref([]);

const props = defineProps({
  modelValue: {
    type: Number,
    default: null
  },
})

const label = "Modo de Pagamento";
const selectedItem = ref(props.modelValue);

const emit = defineEmits(['update:modelValue']);

const changeSelection = (value) => {
  emit('update:modelValue', value);
}

const getAllOptions = async () => {
  const url = "/settings/payment-type";
  const res = await axiosHelper.get(url);

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
  }

  availableOptions.value = res.data;
};

onMounted(() => {
  getAllOptions();
});
</script>
