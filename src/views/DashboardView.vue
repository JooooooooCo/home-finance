<template>
  <v-container class="main-container">
    <DashboardMain v-if="mdAndUp" />
    <DashboardMainMobile v-else />
  </v-container>
</template>

<script setup>
import DashboardMain from '@/components/dashboard/DashboardMain.vue';
import DashboardMainMobile from '@/components/dashboard/DashboardMainMobile.vue';
import { useDisplay } from 'vuetify';

const { mdAndUp } = useDisplay();
</script>

<style lang="css" scoped>
.main-container {
  max-width: 100%;
  width: 100%;
  margin: 0;
}
</style>
