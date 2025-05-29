<template>
  <v-dialog :model-value="modelValue" max-width="80%" width="300" :persistent="persistent">
    <div class="w-auto d-flex justify-center">
      <LoaderCircular :size="128" :marSize="12" />
    </div>
  </v-dialog>
</template>

<script setup>
import LoaderCircular from './LoaderCircular.vue';
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  persistent: {
    type: Boolean,
    default: true,
  },
});
</script>
