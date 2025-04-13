<template>
  <SelectPicker v-if="!loading" v-model="selectedItem" :items="availableOptions" @update:modelValue="changeSelection"
    :label="label" :disabled="!transactionTypeId"/>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
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
  transactionTypeId: {
    type: Number,
    default: null
  }
})

const label = "Categoria Secundária";
const selectedItem = ref(props.modelValue);
const loading = ref(false);

const emit = defineEmits(['update:modelValue']);

const changeSelection = (value) => {
  emit('update:modelValue', value);
}

const getAllOptions = async () => {
  if (!props.transactionTypeId) return;
  loading.value = true;

  const body = {
    'transaction-type-id': props.transactionTypeId
  };
  const url = "/settings/secondary-category";
  const res = await axiosHelper.get(url, body);

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
  }

  availableOptions.value = res.data;
  loading.value = false;
};

watch(() => props.transactionTypeId, (val) => getAllOptions())

onMounted(() => {
  getAllOptions();
});
</script>
