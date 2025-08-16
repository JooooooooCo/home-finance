<template>
  <v-app class="app-main">
    <router-view />
    <SnackBar />
  </v-app>
</template>

<script setup>
import SnackBar from '@/components/generics/SnackBar.vue';
</script>

<style lang="scss" scoped>
.app-main {
  background-color: #f5f5f5;
}
</style>
