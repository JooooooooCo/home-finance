<template>
  <div class="row mar-bottom-0">
    <div class="col s12" style="min-height: 100vh">
      <div class="col s10 m6 l4 login-card">
        <div class="z-depth-1 row card-default">
          <form>
            <div class="row mar-bottom-0 center-align">
              <img
                src="../assets/logo.png"
                class="col s4 offset-s4 mar-top-20"
                alt="logo"
              />
            </div>

            <div class="row mar-top-10 mar-bottom-0">
              <div class="input-field col s12">
                <input
                  type="text"
                  name="email"
                  id="email"
                  autocomplete="username"
                  v-model="user.email"
                />
                <label for="email" class="active mar-top-minus5">Email</label>
              </div>
            </div>

            <div class="row mar-bottom-0">
              <div class="input-field col s12">
                <input
                  type="password"
                  name="password"
                  id="password"
                  autocomplete="current-password"
                  v-model="user.password"
                />
                <label for="password" class="active mar-top-minus5"
                  >Password</label
                >
              </div>
            </div>

            <div class="row mar-bottom-20">
              <div class="col s8 offset-s2">
                <button
                  class="col s12 btn btn-large rounded waves-effect teal darken-2"
                  @click.prevent="login()"
                >
                  Login
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/store/auth.store";
import M from "materialize-css";

const authStore = useAuthStore();

export default {
  name: "LoginView",
  data() {
    return {
      user: {
        email: null,
        password: null,
      },
    };
  },
  methods: {
    async login() {
      const auth_error = await authStore.login(
        this.user.email,
        this.user.password
      );

      M.toast({ html: auth_error, classes: "rounded red" });
    },
  },
};
</script>

<style lang="scss" scoped>
.login-card {
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
}
</style>
