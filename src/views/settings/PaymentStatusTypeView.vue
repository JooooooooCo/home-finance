<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <GenericList
          v-if="!showForm"
          :items="paymentStatusTypes"
          @add="showAddForm"
          @edit="showEditForm"
          @delete="deletePaymentStatusType"
        />

        <PaymentStatusTypeForm
          v-if="showForm"
          :item="selectedPaymentStatusType"
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
import PaymentStatusTypeForm from '@/components/settings/PaymentStatusTypeForm.vue';

const snackbarStore = useSnackbarStore();
const paymentStatusTypes = ref([]);
const showForm = ref(false);
const selectedPaymentStatusType = ref({ id: null, name: null });

const getAllPaymentStatusTypes = async () => {
  const url = "/settings/payment-status-type";
  const res = await axiosHelper.get(url);

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
  }

  paymentStatusTypes.value = res.data;
};

const deletePaymentStatusType = async (id) => {
  const url = `/settings/payment-status-type/${id}`;
  const res = await axiosHelper.delete(url);

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
  }

  getAllPaymentStatusTypes();
};

const showAddForm = () => {
  selectedPaymentStatusType.value = { id: null, name: null };
  showForm.value = true;
};

const showEditForm = (item) => {
  selectedPaymentStatusType.value = item;
  showForm.value = true;
};

const hideForm = () => {
  getAllPaymentStatusTypes();
  showForm.value = false;
};

onMounted(() => {
  getAllPaymentStatusTypes();
});
</script>