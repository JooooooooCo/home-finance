<template>
  <GenericForm :item="item" @save="saveCostCenter" @cancel="emitHideForm">
    <template v-slot="{ item }">
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="item.name"
            label="Name"
            variant="solo-filled"
            flat
            rounded-sm
            required
          ></v-text-field>
        </v-col>
      </v-row>
    </template>
  </GenericForm>
  <div></div>
</template>

<script setup>
import { defineProps } from 'vue';
import GenericForm from '@/components/settings/GenericForm.vue';
import { axiosHelper } from '@/helper/axios.helper';
import { useSnackbarStore } from '@/store/snackbar.store';

const snackbarStore = useSnackbarStore();

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['hide-form']);

const saveCostCenter = async item => {
  const method = item.id ? 'put' : 'post';
  const url = item.id ? `/cost-center/${item.id}` : '/cost-center';
  const body = {
    name: item.name,
  };

  const res = await axiosHelper[method](url, body);

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
    return;
  }

  emitHideForm();
};

const emitHideForm = () => {
  emit('hide-form');
};
</script>
