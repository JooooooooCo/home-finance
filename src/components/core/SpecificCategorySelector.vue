<template>
  <SelectPicker
    v-model="selectedItem"
    :items="availableOptions"
    :externalOpenDialog="externalOpenDialog"
    @update:modelValue="changeSelection"
    :label="label"
    :disabled="!secondaryCategoryId || loading"
    :hideDetails="hideDetails"
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
  secondaryCategoryId: {
    type: Number,
    default: null,
  },
  hideDetails: {
    type: Boolean,
    default: false,
  },
  externalOpenDialog: {
    type: Boolean,
    default: false,
  },
});

const label = 'Categoria Específica';
const selectedItem = ref(props.modelValue);
const loading = ref(false);

const emit = defineEmits(['update:modelValue']);

const changeSelection = value => {
  emit('update:modelValue', value);
};

const getAllOptions = async () => {
  if (!props.secondaryCategoryId) return;
  loading.value = true;

  const body = {
    'secondary-category-id': props.secondaryCategoryId,
  };
  const url = '/settings/specific-category';
  const res = await axiosHelper.get(url, body);

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
    return;
  }

  availableOptions.value = res.data;
  loading.value = false;
};

watch(
  () => props.secondaryCategoryId,
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
