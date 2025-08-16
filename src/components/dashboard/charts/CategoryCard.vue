<template>
  <div :class="['category-row', `category-level-${level}`]">
    <!-- Linha principal da categoria -->
    <v-row
      align="center"
      class="category-main-row py-2 px-3"
      :class="{ 'elevated-row': level === 0 }"
      no-gutters
    >
      <!-- Botão de expansão e ícone -->
      <v-col cols="auto" class="pr-2">
        <v-btn
          v-if="hasChildren"
          icon
          x-small
          @click="toggleExpansion"
          :color="level === 0 ? 'primary' : 'grey'"
        >
          <v-icon small>{{ isExpanded ? 'mdi-chevron-down' : 'mdi-chevron-right' }}</v-icon>
        </v-btn>
        <v-icon v-else :color="getCategoryColor()" small class="ml-1">
          {{ getCategoryIcon() }}
        </v-icon>
      </v-col>

      <!-- Nome da categoria -->
      <v-col cols="3" class="pa-1">
        <div class="d-flex align-center">
          <span
            :class="[
              'font-weight-medium category-name',
              level === 0 ? 'text-subtitle-1' : level === 1 ? 'text-body-2' : 'text-caption',
            ]"
          >
            {{ category.name }}
          </span>
          <v-chip
            v-if="category.budget_amount > 0"
            x-small
            :color="getPercentageColor(category.executed_percentage)"
            class="ml-2"
            text-color="white"
          >
            {{ category.executed_percentage.toFixed(1) }}%
          </v-chip>
        </div>
      </v-col>

      <!-- Valores -->
      <v-col cols="2" class="pa-1 text-center">
        <div class="text-caption">
          <div class="font-weight-medium">Orçado</div>
          <div class="primary--text">{{ userMonetaryValueFormatter(category.budget_amount) }}</div>
        </div>
      </v-col>

      <v-col cols="2" class="pa-1 text-center">
        <div class="text-caption">
          <div class="font-weight-medium">Executado</div>
          <div :class="getExecutedAmountColor()">
            {{ userMonetaryValueFormatter(category.executed_amount) }}
          </div>
        </div>
      </v-col>

      <v-col cols="2" class="pa-1 text-center">
        <div class="text-caption">
          <div class="font-weight-medium">{{ getRemainingLabel() }}</div>
          <div :class="getRemainingAmountColor()">
            {{ userMonetaryValueFormatter(getRemainingAmount()) }}
          </div>
        </div>
      </v-col>

      <!-- Barra de progresso -->
      <v-col cols="3" class="pa-1">
        <v-progress-linear
          :value="getProgressValue()"
          :color="getProgressColor()"
          height="24"
          rounded
          class="progress-bar-enhanced"
        >
          <template v-slot:default>
            <div class="d-flex justify-space-between align-center w-100 px-2">
              <span class="text-caption white--text font-weight-bold">
                {{ getProgressValue().toFixed(1) }}%
              </span>
              <span v-if="hasChildren" class="text-caption white--text">
                {{ category.children.length }} sub
              </span>
            </div>
          </template>
        </v-progress-linear>
        <div class="text-caption mt-1 text-center status-text">
          {{ getStatusText() }}
        </div>
      </v-col>
    </v-row>

    <!-- Subcategorias (quando expandido) -->
    <v-expand-transition>
      <div v-if="isExpanded && hasChildren" class="subcategories-container">
        <div v-for="child in category.children" :key="child.id">
          <CategoryCard
            :category="child"
            :level="level + 1"
            @toggle-expand="$emit('toggle-expand', $event)"
          />
        </div>
      </div>
    </v-expand-transition>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useMonetaryValueHandler } from '@/composables/useMonetaryValueHandler';

const { userMonetaryValueFormatter } = useMonetaryValueHandler();

const props = defineProps({
  category: {
    type: Object,
    required: true,
  },
  level: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['toggle-expand']);

const hasChildren = computed(() => {
  return props.category.children && props.category.children.length > 0;
});

const isExpanded = computed(() => {
  return props.category.expanded || false;
});

const toggleExpansion = () => {
  emit('toggle-expand', props.category.id);
};

const getRemainingAmount = () => {
  return props.category.budget_amount - props.category.executed_amount;
};

const getRemainingLabel = () => {
  return getRemainingAmount() >= 0 ? 'Disponível' : 'Excedido';
};

const getProgressValue = () => {
  if (props.category.budget_amount === 0) {
    return props.category.executed_amount > 0 ? 100 : 0;
  }
  return Math.min((props.category.executed_amount / props.category.budget_amount) * 100, 100);
};

const getProgressColor = () => {
  const percentage = getProgressValue();
  if (percentage <= 50) return 'success';
  if (percentage <= 80) return 'warning';
  if (percentage <= 100) return 'orange';
  return 'error';
};

const getPercentageColor = percentage => {
  if (percentage <= 50) return 'success';
  if (percentage <= 80) return 'warning';
  if (percentage <= 100) return 'orange';
  return 'error';
};

const getExecutedAmountColor = () => {
  const percentage = getProgressValue();
  if (percentage <= 80) return 'success--text';
  if (percentage <= 100) return 'warning--text';
  return 'error--text';
};

const getRemainingAmountColor = () => {
  const remaining = getRemainingAmount();
  return remaining >= 0 ? 'success--text' : 'error--text';
};

const getStatusText = () => {
  const percentage = getProgressValue();

  if (props.category.budget_amount === 0) {
    return props.category.executed_amount > 0 ? 'Sem orçamento' : 'Sem movimentação';
  }

  if (percentage <= 50) return 'Dentro do orçamento';
  if (percentage <= 80) return 'Atenção';
  if (percentage <= 100) return 'Próximo do limite';
  return 'Excedido';
};

const getCategoryIcon = () => {
  const name = props.category.name.toLowerCase();

  if (name.includes('alimentacao') || name.includes('supermercado') || name.includes('pao'))
    return 'mdi-food';
  if (name.includes('transporte') || name.includes('combustivel')) return 'mdi-car';
  if (name.includes('moradia') || name.includes('casa') || name.includes('condominio'))
    return 'mdi-home';
  if (name.includes('saude') || name.includes('farmacia') || name.includes('medico'))
    return 'mdi-medical-bag';
  if (name.includes('educacao') || name.includes('escola')) return 'mdi-school';
  if (name.includes('lazer') || name.includes('internet') || name.includes('telefone'))
    return 'mdi-gamepad-variant';
  if (name.includes('vestuario') || name.includes('roupas')) return 'mdi-tshirt-crew';
  if (name.includes('investimento')) return 'mdi-trending-up';
  if (name.includes('reserva') || name.includes('fundo')) return 'mdi-piggy-bank';

  return 'mdi-circle-small';
};

const getCategoryColor = () => {
  const name = props.category.name.toLowerCase();

  if (name.includes('alimentacao')) return 'green';
  if (name.includes('transporte')) return 'blue';
  if (name.includes('moradia')) return 'brown';
  if (name.includes('saude')) return 'red';
  if (name.includes('educacao')) return 'purple';
  if (name.includes('lazer')) return 'orange';
  if (name.includes('vestuario')) return 'pink';
  if (name.includes('investimento')) return 'teal';

  return 'grey';
};
</script>

<style scoped>
.category-row {
  border-bottom: 1px solid #e0e0e0;
}

.category-level-0 .category-main-row {
  background-color: #f8f9fa;
  border-left: 4px solid var(--v-primary-base);
}

.category-level-1 .category-main-row {
  background-color: #fafafa;
  border-left: 3px solid var(--v-secondary-base);
  margin-left: 16px;
}

.category-level-2 .category-main-row {
  background-color: #fcfcfc;
  border-left: 2px solid var(--v-accent-base);
  margin-left: 32px;
}

.elevated-row {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.category-main-row:hover {
  background-color: #f0f0f0 !important;
}

.progress-bar-enhanced {
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.category-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.status-text {
  font-size: 0.7rem;
  color: #666;
}

.subcategories-container {
  border-left: 2px solid #e0e0e0;
  margin-left: 20px;
}

.text-caption {
  font-size: 0.75rem !important;
  line-height: 1.2;
}
</style>
