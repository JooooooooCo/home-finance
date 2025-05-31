<template>
  <SelectPicker
    v-model="selectedItem"
    :items="availableOptions"
    :externalOpenDialog="externalOpenDialog"
    @update:modelValue="changeSelection"
    :label="label"
    :disabled="
      (!transactionTypeId && requireTransactionType) || loading || availableOptions.length == 0
    "
    :hideDetails="hideDetails"
    :bgColor="bgColor"
  />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { axiosHelper } from '@/helper/axios.helper';
import { useSnackbarStore } from '@/store/snackbar.store';
import SelectPicker from '@/components/generics/SelectPicker.vue';

const snackbarStore = useSnackbarStore();

const props = defineProps({
  modelValue: {
    type: Number,
    default: null,
  },
  transactionTypeId: {
    type: Number,
    default: null,
  },
  requireTransactionType: {
    type: Boolean,
    default: true,
  },
  hideDetails: {
    type: Boolean,
    default: false,
  },
  externalOpenDialog: {
    type: Boolean,
    default: false,
  },
  ignoreOptions: {
    type: Array,
    default: [],
  },
  bgColor: {
    type: String,
    default: null,
  },
  label: {
    type: String,
    default: 'Categoria Secundária',
  },
});

const emit = defineEmits(['update:modelValue']);

const selectedItem = ref(props.modelValue);
const loading = ref(false);
const allOptions = ref([]);

const availableOptions = computed(() =>
  allOptions.value.filter(option => !props.ignoreOptions.includes(option.id))
);

const changeSelection = value => {
  const optionObject = getSelectedOptionObject(value);
  emit('update:modelValue', value, optionObject);
};

const getSelectedOptionObject = id => allOptions.value.find(option => option.id === id);

const getAllOptions = async () => {
  loading.value = true;

  const params = {
    'transaction-type-id': props.transactionTypeId,
  };
  const url = '/settings/secondary-category';
  const res = await axiosHelper.get(url, params);

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
    return;
  }

  allOptions.value = res.data;
  loading.value = false;
};

watch(
  () => props.transactionTypeId,
  val => getAllOptions()
);

watch(
  () => props.modelValue,
  val => {
    selectedItem.value = val;
  }
);

onMounted(() => {
  getAllOptions();
});
</script>
