<template>
  <div class="row mar-bottom-0">
    <div class="col s12 height-100vh">
      <div class="col s10 m6 l4 login-card">
        <div class="z-depth-1 row card-default">
          <form>
            <div class="row mar-bottom-0 center-align">
              <img
                src="@/assets/logo.png"
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
                <input
                  type="submit"
                  value="Login"
                  class="col s12 btn btn-large bold waves-effect teal darken-2"
                  @click.prevent="login()"
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
import { useAuthStore } from "@/store/auth.store";

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
    login() {
      const authStore = useAuthStore();

      authStore.login(this.user.email, this.user.password);
    },
  },
};
</script>

<style lang="scss" scoped></style>
