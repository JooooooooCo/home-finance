<template>
  <v-app>
    <router-view />
    <SnackBar />
  </v-app>
</template>

<script setup>
import SnackBar from "@/components/generics/SnackBar.vue";
</script>