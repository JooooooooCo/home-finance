<template>
  <v-card variant="outlined" class="pa-3 border-thin">
    <v-row>
      <v-col cols="12" class="d-flex pb-0">
        <v-btn v-if="hasChildren" icon size="x-small" variant="text" @click="toggleExpansion">
          <v-icon>{{ isExpanded ? 'mdi-chevron-down' : 'mdi-chevron-right' }}</v-icon>
        </v-btn>
        <v-btn v-else icon size="x-small" variant="text">
          <v-icon>mdi-circle-outline</v-icon>
        </v-btn>
        <div class="d-flex align-center">
          <span
            class="text-caption font-weight-medium category-name"
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
            :color="getExecutedColor()"
            class="ml-2"
            text-color="white"
          >
            {{ category.executed_percentage.toFixed(1) }}%
          </v-chip>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="pa-1">
        <v-progress-linear
          :model-value="getExecutedPercentage()"
          :color="getExecutedColor()"
          height="8"
          rounded
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="4" class="pa-1 text-center">
        <div class="text-caption">
          <div class="font-weight-medium">Orçado</div>
          <div class="primary--text">{{ userMonetaryValueFormatter(category.budget_amount) }}</div>
        </div>
      </v-col>

      <v-col cols="4" class="pa-1 text-center">
        <div class="text-caption">
          <div class="font-weight-medium">Executado</div>
          <div :class="getExecutedAmountColor()">
            {{ userMonetaryValueFormatter(category.executed_amount) }}
          </div>
        </div>
      </v-col>

      <v-col cols="4" class="pa-1 text-center">
        <div class="text-caption">
          <div class="font-weight-medium">{{ getRemainingLabel() }}</div>
          <div :class="getRemainingAmountColor()">
            {{ userMonetaryValueFormatter(getRemainingAmount()) }}
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-expand-transition>
          <v-list v-if="isExpanded && hasChildren" class="subcategories-container pa-0">
            <v-list-item v-for="child in category.children" :key="child.id" class="pa-0 pb-2">
              <CategoryCard
                :category="child"
                :level="level + 1"
                @toggle-expand="$emit('toggle-expand', $event)"
              />
            </v-list-item>
          </v-list>
        </v-expand-transition>
      </v-col>
    </v-row>
  </v-card>
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

const noRemainingBudget = () => {
  return getRemainingAmount() < 0;
};

const getExecutedPercentage = () => {
  if (noRemainingBudget()) return 100;
  return props.category.executed_percentage;
};

const getExecutedColor = () => {
  if (noRemainingBudget()) return 'error';

  const percentage = getExecutedPercentage();
  if (percentage <= 80) return 'success';
  if (percentage <= 100) return 'warning';
  return 'error';
};

const getExecutedAmountColor = () => {
  const percentage = getExecutedPercentage();
  if (percentage <= 80) return 'success--text';
  if (percentage <= 100) return 'warning--text';
  return 'error--text';
};

const getRemainingAmountColor = () => {
  const remaining = getRemainingAmount();
  return remaining >= 0 ? 'success--text' : 'error--text';
};

const getStatusText = () => {
  const percentage = getExecutedPercentage();

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
  margin-left: 4px;
}
</style>
