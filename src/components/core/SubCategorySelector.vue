<template>
  <SelectPicker
    v-model="selectedItem"
    :items="availableOptions"
    :externalOpenDialog="externalOpenDialog"
    @update:modelValue="changeSelection"
    :label="label"
    :disabled="!categoryId || loading || availableOptions.length == 0"
    :hideDetails="hideDetails"
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
  categoryId: {
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
  ignoreOptions: {
    type: Array,
    default: [],
  },
  label: {
    type: String,
    default: 'Subcategoria',
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
  if (!props.categoryId) return;
  loading.value = true;

  const body = {
    'category-id': props.categoryId,
  };
  const url = '/settings/sub-category';
  const res = await axiosHelper.get(url, body);

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
    return;
  }

  allOptions.value = res.data;
  loading.value = false;
};

watch(
  () => props.categoryId,
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
