<template>
  <SelectPicker v-model="selectedItem" :items="availableOptions" :externalOpenDialog="externalOpenDialog" @update:modelValue="changeSelection"
    :label="label" :disabled="(!transactionTypeId && requireTransactionType) || loading" :hideDetails="hideDetails"/>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { axiosHelper } from "@/helper/axios.helper";
import { useSnackbarStore } from '@/store/snackbar.store';
import SelectPicker from '@/components/generics/SelectPicker.vue'

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
  },
  requireTransactionType: {
    type: Boolean,
    default: true
  },
  hideDetails: {
    type: Boolean,
    default: false,
  },
  externalOpenDialog: {
    type: Boolean,
    default: false,
  },
})

const label = "Categoria Secundária";
const selectedItem = ref(props.modelValue);
const loading = ref(false);

const emit = defineEmits(['update:modelValue']);

const changeSelection = (value) => {
  emit('update:modelValue', value);
}

const getAllOptions = async () => {
  loading.value = true;

  const params = {
    'transaction-type-id': props.transactionTypeId
  };
  const url = "/settings/secondary-category";
  const res = await axiosHelper.get(url, params);

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
    return;
  }

  availableOptions.value = res.data;
  loading.value = false;
};

watch(() => props.transactionTypeId, (val) => getAllOptions())

watch(() => props.modelValue, (val) => {
  selectedItem.value = val;
});

onMounted(() => {
  getAllOptions();
});
</script>
