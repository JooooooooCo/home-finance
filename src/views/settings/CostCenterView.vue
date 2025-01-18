<template>
  <div>
    <div class="row">
      <div class="col s12">
        <div v-show="!show_form">
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

        <div class="card-default" v-if="show_form">
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

<script>
import { axiosHelper } from "@/helper/axios.helper";
import M from "materialize-css";

export default {
  name: "CostCenterView",
  data() {
    return {
      costCenters: [],
      cost_center_name: null,
      loading: true,
      show_form: false,
      selectedCostCenter: null,
    };
  },
  computed: {
    isEditMode() {
      return this.selectedCostCenter?.id ? true : false;
    },
  },
  methods: {
    async getAllCostCenter() {
      this.loading = true;
      const url = "/settings/cost-center";

      const res = await axiosHelper.get(url);

      if (res.error) {
        M.toast({ html: res.message, classes: "red" });
        console.error(res.message);
      }

      this.costCenters = res.data;
      this.loading = false;
    },
    async deleteCostCenter(cost_center_id) {
      const url = `/settings/cost-center/${cost_center_id}`;

      const res = await axiosHelper.delete(url);
      const toast_class = res.error ? "red" : "teal darken-2";

      M.toast({ html: res.message, classes: toast_class });

      if (res.error) {
        console.error(res.message);
      }

      this.getAllCostCenter();
    },
    async saveCostCenter() {
      const method = this.isEditMode ? "put" : "post";
      const url = this.isEditMode
        ? `/settings/cost-center/${this.selectedCostCenter.id}`
        : "/settings/cost-center";
      const body = {
        name: this.selectedCostCenter.name,
      };

      const res = await axiosHelper[method](url, body);
      const toast_class = res.error ? "red" : "teal darken-2";

      M.toast({ html: res.message, classes: toast_class });

      if (res.error) {
        console.error(res.message);
      }

      this.getAllCostCenter();

      this.hideForm();
    },
    showAddForm() {
      this.setEmptySelectedCostCenter();
      this.show_form = true;
    },
    showEditForm(costCenter) {
      this.selectedCostCenter = costCenter;
      this.show_form = true;
    },
    hideForm() {
      this.setEmptySelectedCostCenter();
      this.show_form = false;
    },
    setEmptySelectedCostCenter() {
      this.selectedCostCenter = {
        id: null,
        name: null,
      };
    },
  },
  mounted() {
    this.setEmptySelectedCostCenter();
    this.getAllCostCenter();
  },
};
</script>

<style lang="scss" scoped></style>
