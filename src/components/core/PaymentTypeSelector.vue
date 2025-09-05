<template>
  <SelectPicker
    v-model="selectedItem"
    :items="availableOptions"
    :label="label"
    @update:modelValue="changeSelection"
  />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { axiosHelper } from '@/helper/axios.helper';
import { useSnackbarStore } from '@/store/snackbar.store';
import SelectPicker from '@/components/generics/SelectPicker.vue';

const snackbarStore = useSnackbarStore();
const availableOptions = ref([]);

const props = defineProps({
  modelValue: {
    type: Number,
    default: null,
  },
  autoSelectFirst: {
    type: Boolean,
    default: false,
  },
});

const label = 'Modo de Pagamento';
const selectedItem = ref(props.modelValue);

const emit = defineEmits(['update:modelValue']);

const changeSelection = value => {
  emit('update:modelValue', value);
};

const getAllOptions = async () => {
  const url = '/settings/payment-type';
  const res = await axiosHelper.get(url);

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
    return;
  }

  availableOptions.value = res.data;

  if (props.autoSelectFirst && availableOptions.value.length > 0) {
    selectedItem.value = availableOptions.value[0].id;
    emit('update:modelValue', selectedItem.value);
  }
};

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
