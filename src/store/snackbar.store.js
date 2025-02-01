import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSnackbarStore = defineStore('snackbar', () => {
  const snackbar = ref(false);
  const text = ref('');

  function showSnackbar(message) {
    text.value = message;
    snackbar.value = true;
  }

  return { snackbar, text, showSnackbar };
});