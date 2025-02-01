<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div v-show="!showForm">
          <v-list v-model:selected="selected" select-strategy="leaf">
            <v-list-item
              v-for="costCenter in costCenters" :key="costCenter.id"
              :value="costCenter.id"
              @click.stop="showEditForm(costCenter)"
            >
              <v-list-item-title>{{ costCenter.name }}</v-list-item-title>

              <template v-slot:append>
                <v-btn @click.stop="deleteCostCenter(costCenter.id)" color="red" icon="mdi-delete" variant="text"></v-btn>
              </template>
            </v-list-item>
          </v-list>

          <v-btn @click.prevent="showAddForm()" position="fixed" location="bottom right" class="ma-4" size="large" icon="mdi-plus" color="teal darken-2"/>
        </div>

        <v-form @submit.prevent="saveCostCenter" v-if="showForm" >
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="selectedCostCenter.name" label="Name" variant="outlined" required></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" offset="6" md="3" offset-md="6">
                <v-btn @click="hideForm" variant="text" large block>Cancel</v-btn>
              </v-col>
              <v-col cols="6" md="3">
                <v-btn block color="teal darken-2" type="submit">Save</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { axiosHelper } from "@/helper/axios.helper";
import { useSnackbarStore } from '@/store/snackbar.store';

const snackbarStore = useSnackbarStore()

const costCenters = ref([]);
const loading = ref(true);
const showForm = ref(false);
const selectedCostCenter = ref({ id: null, name: null });

const isEditMode = computed(() => !!selectedCostCenter.value?.id);

const getAllCostCenter = async () => {
  loading.value = true;
  const url = "/settings/cost-center";

  const res = await axiosHelper.get(url);

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
    console.error(res.message);
  }

  costCenters.value = res.data;
  loading.value = false;
};

const deleteCostCenter = async (costCenterId) => {
  const url = `/settings/cost-center/${costCenterId}`;

  const res = await axiosHelper.delete(url);

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
    console.error(res.message);
  }

  getAllCostCenter();
};

const saveCostCenter = async () => {
  const method = isEditMode.value ? "put" : "post";
  const url = isEditMode.value
    ? `/settings/cost-center/${selectedCostCenter.value.id}`
    : "/settings/cost-center";
  const body = {
    name: selectedCostCenter.value.name,
  };

  const res = await axiosHelper[method](url, body);

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
    console.error(res.message);
  }

  getAllCostCenter();
  hideForm();
};

const showAddForm = () => {
  setEmptySelectedCostCenter();
  showForm.value = true;
};

const showEditForm = (costCenter) => {
  selectedCostCenter.value = costCenter;
  showForm.value = true;
};

const hideForm = () => {
  setEmptySelectedCostCenter();
  showForm.value = false;
};

const setEmptySelectedCostCenter = () => {
  selectedCostCenter.value = {
    id: null,
    name: null,
  };
};

onMounted(() => {
  setEmptySelectedCostCenter();
  getAllCostCenter();
});
</script>