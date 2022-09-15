import { defineStore } from "pinia";
import axios from "axios";
import router from "../router";

const API_URL = process.env.VUE_APP_ROOT_API;

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
      const url = API_URL + "/user-login";

      try {
        const res = await axios.post(url, auth).then((res) => res.data);

        this.name = res.user.name;
        this.email = res.user.email;
        this.token = res.token;

        localStorage.setItem("name", JSON.stringify(this.name));
        localStorage.setItem("email", JSON.stringify(this.email));
        localStorage.setItem("token", JSON.stringify(this.token));

        router.push(this.returnUrl || "/");
      } catch (err) {
        const error_data = err.response.data;
        const error_first_info = error_data.errors
          ? Object.values(error_data.errors)[0][0]
          : null;

        return error_first_info ?? error_data.message;
      }
    },
  },
});
