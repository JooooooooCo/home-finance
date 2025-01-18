<template>
  <div>
    <NavBar />
    <MainContentView />
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import MainContentView from "@/views/MainContentView.vue";

export default {
  name: "MainLayoutView",
  components: {
    NavBar,
    MainContentView,
  },
};
</script>

<style lang="scss" scoped></style>
