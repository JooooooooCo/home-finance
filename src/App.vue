<template>
  <router-view />
</template>

<script>
import M from "materialize-css";

export default {
  mounted() {
    M.AutoInit();
  },
};
</script>

<style lang="scss"></style>
