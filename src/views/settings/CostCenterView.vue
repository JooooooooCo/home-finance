<template>
  <div>
    <div class="row">
      <div class="col s12">
        <div v-show="!showForm">
          <ul class="collapsible">
            <li v-for="costCenter in costCenters" :key="costCenter.id">
              <div class="collapsible-header remove-click-pointer">
                <div class="col valign-wrapper">
                  <i class="material-icons first-icon">chevron_right </i>
                  {{ costCenter.name }}
                </div>
                <div class="col s4 right-align valign-wrapper">
                  <a
                    class="add-click-pointer"
                    style="margin-left: auto"
                    @click.prevent="showEditForm(costCenter)"
                    ><i class="material-icons grey-text text-darken-3"
                      >mode_edit</i
                    ></a
                  >
                  <a
                    class="add-click-pointer"
                    @click.prevent="deleteCostCenter(costCenter.id)"
                    ><i class="material-icons red-text">delete</i></a
                  >
                </div>
              </div>
            </li>
          </ul>

          <div class="fixed-action-btn">
            <a class="btn-floating btn-large teal darken-2">
              <i class="large material-icons" @click.prevent="showAddForm()"
                >add</i
              >
            </a>
          </div>
        </div>

        <div class="card-default" v-if="showForm">
          <form>
            <div class="row mar-bottom-0">
              <div class="input-field col s12">
                <input
                  type="text"
                  name="cost_center_name"
                  id="cost_center_name"
                  v-model="selectedCostCenter.name"
                />
                <label for="cost_center_name" class="active mar-top-minus5"
                  >Name</label
                >
              </div>
            </div>

            <div class="row mar-bottom-0">
              <div class="col s6 m3 offset-m6">
                <input
                  type="button"
                  value="Cancel"
                  class="col s12 btn waves-effect grey lighten-1 grey-text text-darken-4"
                  @click.prevent="hideForm()"
                />
              </div>
              <div class="col s6 m3">
                <input
                  type="submit"
                  value="Save"
                  class="col s12 btn bold waves-effect teal darken-2"
                  @click.prevent="saveCostCenter()"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { axiosHelper } from "@/helper/axios.helper";
import M from "materialize-css";

const costCenters = ref([]);
const loading = ref(true);
const showForm = ref(false);
const selectedCostCenter = ref({ id: null, name: null });

const isEditMode = computed(() => selectedCostCenter.value?.id ? true : false);

const getAllCostCenter = async () => {
  loading.value = true;
  const url = "/settings/cost-center";

  const res = await axiosHelper.get(url);

  if (res.error) {
    M.toast({ html: res.message, classes: "red" });
    console.error(res.message);
  }

  costCenters.value = res.data;
  loading.value = false;
};

const deleteCostCenter = async (costCenterId) => {
  const url = `/settings/cost-center/${costCenterId}`;

  const res = await axiosHelper.delete(url);
  const toastClass = res.error ? "red" : "teal darken-2";

  M.toast({ html: res.message, classes: toastClass });

  if (res.error) {
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
  const toastClass = res.error ? "red" : "teal darken-2";

  M.toast({ html: res.message, classes: toastClass });

  if (res.error) {
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

<style lang="scss" scoped></style>
