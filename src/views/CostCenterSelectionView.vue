<template>
  <div class="row mar-bottom-0">
    <div class="col s12" style="min-height: 100vh">
      <div class="col s10 m6 l4 login-card">
        <div class="z-depth-1 row card-default rounded" v-if="!loading">
          <form v-if="!enableAddCostCenter">
            <div class="row center-align">
              <i class="material-icons teal-text text-darken-2 large mar-top-20"
                >input</i
              >
            </div>

            <div class="row mar-top-0 center-align">
              <h5 class="teal-text text-darken-2">Choose a cost center</h5>
            </div>

            <div class="row center-align">
              <div
                class="chip teal darken-2"
                v-for="costCenter in costCenters"
                :key="costCenter.id"
                @click.prevent="setCostCenter(costCenter)"
              >
                <span class="white-text">{{ costCenter.name }}</span>
              </div>
            </div>

            <div class="row center-align">
              <a
                class="waves-effect waves-light btn rounded grey lighten-1 grey-text text-darken-4"
                @click.prevent="showAddCostCenter()"
                ><i class="material-icons left">add</i>ADD NEW</a
              >
            </div>
          </form>
          <form v-else>
            <div class="row center-align">
              <i class="material-icons teal-text text-darken-2 large mar-top-20"
                >library_add</i
              >
            </div>

            <div class="row mar-top-0 center-align">
              <h5 class="teal-text text-darken-2">Add new cost center</h5>
            </div>

            <div class="row mar-bottom-0">
              <div class="input-field col s12">
                <input
                  type="text"
                  name="cost_center_name"
                  id="cost_center_name"
                  v-model="cost_center_name"
                />
                <label for="cost_center_name" class="active mar-top-minus5"
                  >Name</label
                >
              </div>
            </div>

            <div class="row mar-bottom-20">
              <div class="col s6" v-if="hasCostCenters">
                <input
                  type="button"
                  value="Cancel"
                  class="col s12 btn rounded waves-effect grey lighten-1 grey-text text-darken-4"
                  @click.prevent="hideAddCostCenter()"
                />
              </div>
              <div :class="hasCostCenters ? 'col s6' : 'col s8 offset-s2'">
                <input
                  type="submit"
                  value="Create"
                  class="col s12 btn bold rounded waves-effect teal darken-2"
                  @click.prevent="createCostCenter()"
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
import { useCostCenterStore } from "@/store/cost_center.store";
import { axiosHelper } from "@/helper/axios.helper";
import M from "materialize-css";

const costCenterStore = useCostCenterStore();

export default {
  name: "CostCenterSelectionView",
  data() {
    return {
      costCenters: [],
      cost_center_name: null,
      loading: true,
      show_add_cost_center: false,
    };
  },
  computed: {
    hasCostCenters() {
      return this.costCenters.length > 0;
    },
    enableAddCostCenter() {
      return !this.hasCostCenters || this.show_add_cost_center;
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
    setCostCenter(costCenter) {
      if (!costCenter) return;

      costCenterStore.setCostCenter(costCenter);
    },
    createCostCenter() {
      if (!this.cost_center_name) return;

      costCenterStore.createCostCenter(this.cost_center_name);
    },
    showAddCostCenter() {
      this.show_add_cost_center = true;
    },
    hideAddCostCenter() {
      this.show_add_cost_center = false;
    },
  },
  mounted() {
    this.getAllCostCenter();
  },
};
</script>

<style lang="scss" scoped></style>
