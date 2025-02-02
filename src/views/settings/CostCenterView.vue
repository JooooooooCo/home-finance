<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <GenericList
          v-if="!showForm"
          :items="costCenters"
          @add="showAddForm"
          @edit="showEditForm"
          @delete="deleteCostCenter"
        />

        <CostCenterForm
          v-if="showForm"
          :item="selectedCostCenter"
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
import GenericList from '@/components/GenericList.vue';
import CostCenterForm from '@/components/settings/CostCenterForm.vue';

const snackbarStore = useSnackbarStore();
const costCenters = ref([]);
const showForm = ref(false);
const selectedCostCenter = ref({ id: null, name: null });

const getAllCostCenter = async () => {
  const url = "/settings/cost-center";
  const res = await axiosHelper.get(url);

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
  }

  costCenters.value = res.data;
};

const deleteCostCenter = async (costCenterId) => {
  const url = `/settings/cost-center/${costCenterId}`;
  const res = await axiosHelper.delete(url);

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
  }

  getAllCostCenter();
};

const showAddForm = () => {
  selectedCostCenter.value = { id: null, name: null };
  showForm.value = true;
};

const showEditForm = (item) => {
  selectedCostCenter.value = item;
  showForm.value = true;
};

const hideForm = () => {
  getAllCostCenter();
  showForm.value = false;
};

onMounted(() => {
  getAllCostCenter();
});
</script>