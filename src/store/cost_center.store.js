import { defineStore } from "pinia";
import router from "../router";

export const useCostCenterStore = defineStore("cost_center", {
  state: () => {
    return {
      cost_center: JSON.parse(localStorage.getItem("cost_center")),
    };
  },
  getters: {
    isCostCenterSelected: (state) => {
      return state.cost_center ? true : false;
    },
  },
  actions: {
    async setCostCenter(cost_center) {
      this.cost_center = cost_center;

      localStorage.setItem("cost_center", JSON.stringify(this.cost_center));

      router.push("/");
    },
  },
});
