<template>
  <v-card elevation="0" class="pb-2" v-if="results && results.length > 0">
    <v-row>
      <v-col cols="12" class="pb-0">
        <h3>Despesas planejado X executado</h3>
      </v-col>
      <v-divider class="mb-4" />
    </v-row>

    <!-- Resumo geral -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card outlined class="pa-3">
          <v-row>
            <v-col cols="4" class="text-center">
              <div class="text-h6 primary--text">{{ userMonetaryValueFormatter(totalBudget) }}</div>
              <div class="text-caption">Orçado Total</div>
            </v-col>
            <v-col cols="4" class="text-center">
              <div class="text-h6 success--text">
                {{ userMonetaryValueFormatter(totalExecuted) }}
              </div>
              <div class="text-caption">Executado Total</div>
            </v-col>
            <v-col cols="4" class="text-center">
              <div class="text-h6" :class="remainingAmount >= 0 ? 'success--text' : 'error--text'">
                {{ userMonetaryValueFormatter(remainingAmount) }}
              </div>
              <div class="text-caption">{{ remainingAmount >= 0 ? 'Disponível' : 'Excedido' }}</div>
            </v-col>
          </v-row>
          <v-progress-linear
            :value="totalExecutedPercentage"
            height="8"
            :color="totalExecutedPercentage > 100 ? 'error' : 'success'"
            class="mt-2"
          />
          <div class="text-center text-caption mt-1">
            {{ totalExecutedPercentage.toFixed(1) }}% executado
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Cabeçalho da tabela -->
    <v-row class="table-header py-2 px-3 mb-2" no-gutters>
      <v-col cols="auto" class="pr-2">
        <!-- Espaço para botão de expansão -->
      </v-col>
      <v-col cols="3" class="pa-1">
        <span class="font-weight-bold text-body-2">Categoria</span>
      </v-col>
      <v-col cols="2" class="pa-1 text-center">
        <span class="font-weight-bold text-body-2">Orçado</span>
      </v-col>
      <v-col cols="2" class="pa-1 text-center">
        <span class="font-weight-bold text-body-2">Executado</span>
      </v-col>
      <v-col cols="2" class="pa-1 text-center">
        <span class="font-weight-bold text-body-2">Saldo</span>
      </v-col>
      <v-col cols="3" class="pa-1 text-center">
        <span class="font-weight-bold text-body-2">Progresso</span>
      </v-col>
    </v-row>

    <!-- Categorias principais -->
    <div v-for="category in processedResults" :key="category.id">
      <CategoryCard :category="category" :level="0" @toggle-expand="toggleExpand" />
    </div>
  </v-card>

  <v-card v-else-if="loading" class="pa-4 text-center">
    <v-progress-circular indeterminate color="primary" />
    <div class="mt-2">Carregando dados...</div>
  </v-card>

  <v-card v-else class="pa-4 text-center">
    <v-icon size="48" color="grey">mdi-chart-bar</v-icon>
    <div class="mt-2 text-subtitle-1">Nenhum dado encontrado</div>
    <div class="text-caption">Selecione um período para visualizar os dados</div>
  </v-card>
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
      expanded: expandedCategories.value.has(category.id) || level === 0,
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
