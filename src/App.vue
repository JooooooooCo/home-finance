<template>
  <NavBar v-if="enableNavBar" />
  <router-view />
</template>

<script>
import M from "materialize-css";
import NavBar from "@/components/NavBar.vue";

export default {
  components: {
    NavBar,
  },
  computed: {
    enableNavBar() {
      const disabledNavRoutes = ["login", "cost-center-selection"];
      return disabledNavRoutes.indexOf(this.$route.name) === -1;
    },
  },
  mounted() {
    M.AutoInit();
  },
};
</script>

<style lang="scss"></style>
