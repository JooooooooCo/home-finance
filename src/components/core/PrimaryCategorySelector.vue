<template>
  <SelectPicker
    v-model="selectedItem"
    :items="availableOptions"
    :externalOpenDialog="externalOpenDialog"
    @update:modelValue="changeSelection"
    :label="label"
    :hideDetails="hideDetails"
    :disabled="availableOptions.length == 0"
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
});

const emit = defineEmits(['update:modelValue']);

const label = 'Categoria Principal';
const selectedItem = ref(props.modelValue);
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
  const url = '/settings/primary-category';
  const res = await axiosHelper.get(url);

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
    return;
  }

  allOptions.value = res.data;
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
