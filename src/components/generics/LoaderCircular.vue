<template>
  <v-progress-circular color="teal darken-2" indeterminate :size="size" class="ml-12 mr-12 mt-12 mb-12" />
</template>

<script setup>
const props = defineProps({
  size: {
    type: Number,
    default: 128
  },
});
</script>