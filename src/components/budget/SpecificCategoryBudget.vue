<template>
  <div>
    <v-card
      elevation="0"
      color="grey-lighten-2 pt-4"
      class="pa-4 mb-4"
      v-for="category in categories"
      :key="category.id"
    >
      <v-row>
        <v-col class="d-flex justify-space-between align-center">
          <span>
            {{ `${category.name}` }}
          </span>

          <span>{{ getFormattedBudgetPercentageAmount(category.budget) }}</span>

          <v-btn
            variant="text"
            color="red"
            rounded="xl"
            icon="mdi-close-circle-outline"
            @click="removeCategory(category.id)"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-slider
            v-model="category.budget"
            :thumb-size="16"
            :step="1"
            :color="isOverMaxPercentage ? 'red' : ''"
            thumb-label="always"
            hideDetails
          >
            <template v-slot:thumb-label="{ modelValue }">
              {{ `${modelValue}%` }}
            </template>
          </v-slider>
        </v-col>
      </v-row>
    </v-card>

    <v-row>
      <v-col cols="12" md="4">
        <SpecificCategorySelector
          v-model="selected"
          :secondaryCategoryId="secondaryCategoryId"
          :ignoreOptions="categories?.map(category => category.id)"
          bgColor="grey-lighten-2"
          label="Adicionar Categoria Específica"
          @update:modelValue="addCategory"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useMonetaryValueHandler } from '@/composables/useMonetaryValueHandler';
import SpecificCategorySelector from '@/components/core/SpecificCategorySelector.vue';

const { userMonetaryValueFormatter } = useMonetaryValueHandler();

const props = defineProps({
  modelValue: {
    type: Array,
    default: [],
  },
  totalBudget: {
    type: Number,
    required: true,
  },
  secondaryCategoryId: {
    type: Number,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue']);

const categories = ref(props.modelValue);
const selected = ref(null);

const addCategory = (id, category) => {
  category.budget = 0;
  categories.value.push(category);
  selected.value = null;
};

const removeCategory = id => {
  categories.value = categories.value.filter(category => category.id !== id);
  emit('update:modelValue', categories.value);
};

const totalPercentage = computed(() => {
  let totalPercentage = 0;
  categories.value.forEach(category => {
    totalPercentage += category.budget;
  });
  return totalPercentage;
});

const isOverMaxPercentage = computed(() => totalPercentage.value > 100);

const getFormattedBudgetPercentageAmount = percentage =>
  userMonetaryValueFormatter(getBudgetPercentageAmount(percentage));

const getBudgetPercentageAmount = percentage =>
  !percentage ? 0 : (percentage / 100) * props.totalBudget;

watch(
  () => categories.value,
  value => {
    emit('update:modelValue', value);
  },
  { deep: true }
);
</script>
