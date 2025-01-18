import { defineStore } from "pinia";
import { axiosHelper } from "@/helper/axios.helper";
import router from "@/router";
import M from "materialize-css";

export const useAuthStore = defineStore("auth", {
  state: () => {
    return {
      name: JSON.parse(localStorage.getItem("name")),
      email: JSON.parse(localStorage.getItem("email")),
      token: JSON.parse(localStorage.getItem("token")),
    };
  },
  getters: {
    isLoggedIn: (state) => {
      return state.token ? true : false;
    },
  },
  actions: {
    async login(email, password) {
      const auth = { email: email, password: password };
      const url = "/user/login";

      const res = await axiosHelper.post(url, auth);

      if (res.error) {
        M.toast({ html: res.message, classes: "red" });
        return;
      }

      this.name = res.data.user.name;
      this.email = res.data.user.email;
      this.token = res.data.token;

      localStorage.setItem("name", JSON.stringify(this.name));
      localStorage.setItem("email", JSON.stringify(this.email));
      localStorage.setItem("token", JSON.stringify(this.token));

      router.push("/cost-center-selection");
    },
    async logout() {
      const url = "/user/logout";
      const res = await axiosHelper.post(url);

      M.toast({ html: res.message, classes: "red" });

      this.name = null;
      this.email = null;
      this.token = null;

      localStorage.setItem("name", JSON.stringify(this.name));
      localStorage.setItem("email", JSON.stringify(this.email));
      localStorage.setItem("token", JSON.stringify(this.token));

      router.push("/");
    },
  },
});
