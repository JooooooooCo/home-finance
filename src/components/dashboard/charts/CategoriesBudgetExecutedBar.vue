<template>
  <!-- <div> -->
  <!-- <div v-for="result in results" :key="result.id"> -->
  <v-row v-for="result in results" :key="result.id">
    <v-col cols="2" class="pt-0 d-flex flex-column">
      <span>{{ result.name }}</span>
      <span class="text-subtitle-2">{{ userMonetaryValueFormatter(result.budget_amount) }}</span>
    </v-col>
    <v-col cols="10" class="pt-0">
      <v-progress-linear
        v-model="result.executed_percentage"
        height="50"
        color="teal darken-2"
        rounded
      >
        <template v-slot:default="">
          <div class="d-flex justify-space-between w-75">
            <span>{{ userMonetaryValueFormatter(result.executed_amount) }}</span>
            <span>
              <strong>{{ result.executed_percentage }}%</strong>
            </span>
            <span>{{
              userMonetaryValueFormatter(result.budget_amount - result.executed_amount)
            }}</span>
          </div>
        </template>
      </v-progress-linear>
    </v-col>
  </v-row>
  <!-- </div> -->
  <!-- </div> -->
</template>

<script setup>
// import { ref, watch } from 'vue';
import { useMonetaryValueHandler } from '@/composables/useMonetaryValueHandler';

const { userMonetaryValueFormatter } = useMonetaryValueHandler();

const props = defineProps({
  results: {
    type: Array,
    default: [],
  },
});
</script>
