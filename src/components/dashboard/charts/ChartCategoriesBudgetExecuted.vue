<template>
  <v-card elevation="0" class="pa-4">
    <v-row>
      <v-col cols="12" class="pb-0">
        <h3>Orçamento</h3>
      </v-col>
    </v-row>

    <v-row v-if="results && results.length > 0">
      <v-col cols="12" class="pt-0 pb-2">
        <v-card variant="outlined" class="pa-3 border-thin">
          <v-row>
            <v-col cols="6" class="text-center">
              <div class="text-caption">Previsto</div>
              <div class="text-subtitle-1 font-weight-bold">
                {{ userMonetaryValueFormatter(totalBudget) }}
              </div>
            </v-col>
            <v-col cols="6" class="text-center">
              <div class="text-caption">Executado</div>
              <div class="text-subtitle-1 font-weight-bold">
                {{ userMonetaryValueFormatter(totalExecuted) }}
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="pt-0">
              <v-divider />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="text-center pt-0">
              <div class="text-caption" :class="remainingAmount >= 0 ? '' : 'text-red'">
                {{ remainingAmount >= 0 ? 'Disponível' : 'Excedido' }}
              </div>
              <div class="text-h6 font-weight-bold" :class="remainingAmount >= 0 ? '' : 'text-red'">
                {{ userMonetaryValueFormatter(remainingAmount) }}
              </div>
            </v-col>
          </v-row>
          <v-progress-linear
            :model-value="totalExecutedPercentage"
            height="8"
            :color="totalExecutedPercentage > 100 ? 'error' : 'success'"
            class="mt-2"
            rounded
          />
          <div class="text-center text-caption mt-1">
            {{ totalExecutedPercentage.toFixed(1) }}% executado
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="results && results.length > 0">
      <v-col cols="12" class="pt-0 pb-2">
        <v-list>
          <v-list-item v-for="category in processedResults" :key="category.id" class="pa-0 pb-2">
            <CategoryCard :category="category" :level="0" @toggle-expand="toggleExpand" />
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-card>
  <!-- TODO implementar empty state -->
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useMonetaryValueHandler } from '@/composables/useMonetaryValueHandler';
import { axiosHelper } from '@/helper/axios.helper';
import { useSnackbarStore } from '@/store/snackbar.store';
import CategoryCard from './CategoryCard.vue';

const { userMonetaryValueFormatter } = useMonetaryValueHandler();
const snackbarStore = useSnackbarStore();

const props = defineProps({
  dueDateFilter: {
    type: Object,
    required: true,
  },
});

const loading = ref(false);
const results = ref(null);
const expandedCategories = ref(new Set());

// Computed properties para totais
const totalBudget = computed(() => {
  if (!results.value) return 0;
  return results.value.reduce((sum, category) => sum + category.budget_amount, 0);
});

const totalExecuted = computed(() => {
  if (!results.value) return 0;
  return results.value.reduce((sum, category) => sum + category.executed_amount, 0);
});

const remainingAmount = computed(() => {
  return totalBudget.value - totalExecuted.value;
});

const totalExecutedPercentage = computed(() => {
  if (totalBudget.value === 0) return 0;
  return (totalExecuted.value / totalBudget.value) * 100;
});

// Processed results com estado de expansão
const processedResults = computed(() => {
  if (!results.value) return [];

  const processCategory = (category, level = 0) => {
    const processed = {
      ...category,
      expanded: expandedCategories.value.has(category.id),
      children: category.children
        ? category.children.map(child => processCategory(child, level + 1))
        : [],
    };
    return processed;
  };

  return results.value.map(category => processCategory(category));
});

const toggleExpand = categoryId => {
  if (expandedCategories.value.has(categoryId)) {
    expandedCategories.value.delete(categoryId);
  } else {
    expandedCategories.value.add(categoryId);
  }
};

const getResults = async () => {
  if (!props.dueDateFilter || (!props.dueDateFilter.year && !props.dueDateFilter.month)) return;

  loading.value = true;

  const filters = {
    year: props.dueDateFilter.year,
    month: props.dueDateFilter.month,
  };

  const url = '/budget/results';
  const res = await axiosHelper.get(url, filters);
  loading.value = false;

  if (res.error) {
    snackbarStore.showSnackbar(res.message);
    return;
  }

  results.value = res.data;
};

watch(
  () => props.dueDateFilter,
  () => {
    getResults();
  },
  { immediate: true, deep: true }
);
</script>

<style scoped>
.v-progress-linear {
  border-radius: 4px;
}

.table-header {
  background-color: #f5f5f5;
  border-bottom: 2px solid #e0e0e0;
  border-radius: 4px 4px 0 0;
}
</style>
