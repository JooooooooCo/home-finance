<template>
  <v-progress-circular
    color="teal darken-2"
    indeterminate
    :size="size"
    :width="getWidth"
    :class="`ma-${marSize}`"
  />
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  size: {
    type: Number,
    default: 14,
  },
  marSize: {
    type: Number,
    default: 0,
  },
});

const getWidth = computed(() => props.size / 12);
</script>
