<template>
  <div class="row mar-bottom-0">
    <div class="col s12" style="min-height: 100vh">
      <div class="col s10 m6 l4 login-card">
        <div class="z-depth-1 row card-default">
          <form>
            <div class="row center-align">
              <i class="material-icons teal-text text-darken-2 large mar-top-20"
                >input</i
              >
            </div>

            <div class="row mar-top-0 center-align">
              <h5 class="teal-text text-darken-2">Select the cost center</h5>
            </div>

            <div class="row center-align">
              <div
                class="chip teal lighten-5"
                v-for="costCenter in costCenters"
                :key="costCenter.id"
                @click.prevent="setCostCenter(costCenter)"
              >
                {{ costCenter.name }}
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

const costCenterStore = useCostCenterStore();

export default {
  name: "CostCenterSelectionView",
  data() {
    return {
      costCenters: [],
    };
  },
  methods: {
    async getAllCostCenter() {
      const url = "/cost-center";

      this.costCenters = await axiosHelper.get(url);
    },
    setCostCenter(costCenter) {
      if (!costCenter) return;

      costCenterStore.setCostCenter(costCenter);
    },
  },
  mounted() {
    this.getAllCostCenter();
  },
};
</script>

<style lang="scss" scoped></style>
