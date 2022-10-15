<template>
  <div class="row">
    <div class="col s12">
      <div class="row mar-top-10 mar-bottom-10 valign-wrapper">
        <div class="col s6 left-align">
          <span style="font-weight: 500; font-size: large">Cost Centers</span>
        </div>
        <div class="col s6 right-align">
          <a class="waves-effect waves-light white btn" v-show="!show_form"
            ><i class="material-icons black-text" @click.prevent="showAddForm()"
              >add</i
            ></a
          >
        </div>
      </div>

      <ul class="collapsible" v-show="!show_form">
        <li v-for="costCenter in costCenters" :key="costCenter.id">
          <div class="collapsible-header">
            <i class="material-icons">chevron_right</i>{{ costCenter.name }}
          </div>
          <div class="collapsible-body">
            <div class="row mar-bottom-0">
              <div class="col s12 right-align">
                <a
                  class="waves-effect waves-light white btn mar-right-5"
                  @click.prevent="showEditForm(costCenter)"
                  ><i class="material-icons black-text">edit</i></a
                >
                <a
                  class="waves-effect waves-light red btn"
                  @click.prevent="deleteCostCenter(costCenter.id)"
                  ><i class="material-icons white-text">delete</i></a
                >
              </div>
            </div>
          </div>
        </li>
      </ul>

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
            <div class="col s6">
              <input
                type="button"
                value="Cancel"
                class="col s12 btn btn-small rounded waves-effect white teal-text text-darken-2"
                @click.prevent="hideForm()"
              />
            </div>
            <div class="col s6">
              <input
                type="submit"
                value="Save"
                class="col s12 btn btn-small rounded waves-effect teal darken-2"
                @click.prevent="saveCostCenter()"
              />
            </div>
          </div>
        </form>
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
        M.toast({ html: res.message, classes: "rounded red" });
        console.error(res.message);
      }

      this.costCenters = res.data;
      this.loading = false;
    },
    async deleteCostCenter(cost_center_id) {
      const url = `/settings/cost-center/${cost_center_id}`;

      const res = await axiosHelper.delete(url);
      const toast_class = res.error ? "rounded red" : "rounded teal darken-2";

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
      const toast_class = res.error ? "rounded red" : "rounded teal darken-2";

      M.toast({ html: res.message, classes: toast_class });

      if (res.error) {
        console.error(res.message);
      }

      this.getAllCostCenter();

      this.hideForm();
    },
    initMaterialize() {
      var collapsibleElem = document.querySelectorAll(".collapsible");
      M.Collapsible.init(collapsibleElem);
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
    this.initMaterialize();
  },
};
</script>

<style lang="scss" scoped></style>
