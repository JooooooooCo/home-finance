<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <GenericList
          v-if="!showForm"
          :items="paymentTypes"
          @add="showAddForm"
          @edit="showEditForm"
          @delete="deletePaymentType"
        />

        <PaymentTypeForm
          v-if="showForm"
          :item="selectedPaymentType"
          @hide-form="hideForm"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { axiosHelper } from "@/helper/axios.helper";
import { useSnackbarStore } from '@/store/snackbar.store';
import GenericList from '@/components/settings/GenericList.vue';
import PaymentTypeForm from '@/components/settings/PaymentTypeForm.vue';

const snackbarStore = useSnackbarStore();
const paymentTypes = ref([]);
const showForm = ref(false);
const selectedPaymentType = ref({ id: null, name: null });

const getAllPaymentTypes = async () => {
  const url = "/settings/payment-type";
  const res = await axiosHelper.get(url);

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
    return;
  }

  paymentTypes.value = res.data;
};

const deletePaymentType = async (id) => {
  const url = `/settings/payment-type/${id}`;
  const res = await axiosHelper.delete(url);

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
    return;
  }

  getAllPaymentTypes();
};

const showAddForm = () => {
  selectedPaymentType.value = { id: null, name: null };
  showForm.value = true;
};

const showEditForm = (item) => {
  selectedPaymentType.value = item;
  showForm.value = true;
};

const hideForm = () => {
  getAllPaymentTypes();
  showForm.value = false;
};

onMounted(() => {
  getAllPaymentTypes();
});
</script>