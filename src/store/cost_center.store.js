import { defineStore } from "pinia";
import { axiosHelper } from "@/helper/axios.helper";
import router from "../router";
import M from "materialize-css";

export const useCostCenterStore = defineStore("cost_center", {
  state: () => {
    return {
      id: JSON.parse(localStorage.getItem("cost_center_id")),
      name: JSON.parse(localStorage.getItem("cost_center_name")),
    };
  },
  getters: {
    isCostCenterSelected: (state) => {
      return state.id ? true : false;
    },
  },
  actions: {
    async setCostCenter(costCenter) {
      this.id = costCenter.id;
      this.name = costCenter.name;

      localStorage.setItem("cost_center_id", JSON.stringify(this.id));
      localStorage.setItem("cost_center_name", JSON.stringify(this.name));

      const url = "/user/current-cost-center";
      const res = await axiosHelper.post(url);

      if (res.error) {
        M.toast({ html: res.message, classes: "red" });
        this.cleanCostCenter();
        return;
      }

      router.push("/");
    },
    cleanCostCenter() {
      this.id = null;
      this.name = null;

      localStorage.setItem("cost_center_id", JSON.stringify(this.id));
      localStorage.setItem("cost_center_name", JSON.stringify(this.name));

      router.push("/cost-center-selection");
    },
    async createCostCenter(cost_center_name) {
      const body = { name: cost_center_name };
      const url = "/settings/cost-center";

      const res = await axiosHelper.post(url, body);

      if (res.error) {
        M.toast({ html: res.message, classes: "red" });
        return;
      }

      this.setCostCenter(res.data);
    },
  },
});
