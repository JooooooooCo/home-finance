<template>
  <div>
    <v-snackbar v-model="snackbar" color="red">
      {{ text }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { useSnackbarStore } from '@/store/snackbar.store';
import { storeToRefs } from 'pinia';

const snackbarStore = useSnackbarStore();
const { snackbar, text } = storeToRefs(snackbarStore);
</script>