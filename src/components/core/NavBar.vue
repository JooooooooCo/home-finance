<template>
  <div>
    <v-app-bar color="teal darken-2" dark>
      <v-app-bar-nav-icon @click="toogleMenu">
        <v-icon>mdi-menu</v-icon>
      </v-app-bar-nav-icon>

      <v-toolbar-title class="brand-logo">{{ title }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items class="hide-on-small-only">
        <v-btn @click="changeCostCenter" prepend-icon="mdi-wallet">{{ getCostCenterName }}</v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list>
        <v-list-item :prepend-avatar="getUserAvatarUrl" :title="user_name" :subtitle="user_email"></v-list-item>
        <v-list-item prepend-avatar="" title="" :subtitle="getCostCenterName"></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item :to="{ name: 'dashboard' }" prepend-icon="mdi-home" title="Dashboard"></v-list-item>
        <v-list-item :to="{ name: 'cash-flow' }" prepend-icon="mdi-layers" title="Transactions"></v-list-item>
        <v-list-item :to="{ name: 'pivot-table' }" prepend-icon="mdi-table-pivot" title="Pivot Table"></v-list-item>
        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-cog" title="Settings"></v-list-item>
          </template>
          <v-list-item :to="{ name: 'settings-payment-type' }" prepend-icon="mdi-cog"
            title="Payment Types"></v-list-item>
          <v-list-item :to="{ name: 'settings-payment-status-type' }" prepend-icon="mdi-cog"
            title="Payment Status Types"></v-list-item>
        </v-list-group>
        <v-list-item :to="{ name: 'cost-center' }" prepend-icon="mdi-wallet" title="Cost Centers"></v-list-item>
      </v-list>

      <template v-slot:append>
        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item @click="changeCostCenter" prepend-icon="mdi-swap-horizontal"
            title="Change Cost Center"></v-list-item>
          <v-list-item @click="logout" prepend-icon="mdi-arrow-left" title="Logout"></v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/store/auth.store";
import { useCostCenterStore } from "@/store/cost_center.store";

const title = ref('Home Finance');
const drawer = ref(false);
const user_name = ref(null);
const user_email = ref(null);
const cost_center_name = ref(null);

const getCostCenterName = computed(() => {
  if (!cost_center_name.value) return;
  return cost_center_name.value.substring(0, 20);
});

const getUserAvatarUrl = computed(() => {
  if (!user_name.value) return;
  const name = user_name.value.replaceAll(" ", "-");
  return `https://ui-avatars.com/api/?size=512&background=00796b&color=fff&name=${name}`;
});

const logout = () => {
  const authStore = useAuthStore();
  authStore.logout();
};

const changeCostCenter = () => {
  const costCenterStore = useCostCenterStore();
  costCenterStore.cleanCostCenter();
};

const fillUserDetails = () => {
  const authStore = useAuthStore();
  const costCenterStore = useCostCenterStore();
  user_name.value = authStore.name;
  user_email.value = authStore.email;
  cost_center_name.value = costCenterStore.name;
};

const toogleMenu = () => {
  drawer.value = !drawer.value;
};

onMounted(() => {
  fillUserDetails();
});
</script>

<style lang="scss" scoped>
.hide-on-small-only {
  @media (max-width: 599px) {
    display: none;
  }
}
</style>