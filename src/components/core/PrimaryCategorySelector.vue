<template>
  <SelectPicker v-model="selectedItem" :items="availableOptions" @update:modelValue="changeSelection"
    :label="label" :hideDetails="hideDetails"/>
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
  hideDetails: {
    type: Boolean,
    default: false,
  }
})

const label = "Categoria Principal";
const selectedItem = ref(props.modelValue);

const emit = defineEmits(['update:modelValue']);

const changeSelection = (value) => {
  emit('update:modelValue', value);
}

const getAllOptions = async () => {
  const url = "/settings/primary-category";
  const res = await axiosHelper.get(url);

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
    return;
  }

  availableOptions.value = res.data;
};

watch(() => props.modelValue, (val) => {
  selectedItem.value = val;
});

onMounted(() => {
  getAllOptions();
});
</script>
