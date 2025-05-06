import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSnackbarStore = defineStore('snackbar', () => {
  const snackbar = ref(false);
  const text = ref('');
  const color = ref('');

  function showSnackbar(message, success = false) {
    text.value = message;
    snackbar.value = true;
    color.value = !success ? 'red' : 'teal darken-2';
  }

  return { snackbar, text, color, showSnackbar };
});