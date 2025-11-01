<template>
  <div>
    <v-card variant="outlined" class="pa-4 mb-4" v-for="category in categories" :key="category.id">
      <v-row>
        <v-col class="d-flex justify-space-between align-center">
          <span class="text-caption font-weight-medium">
            {{ `${category.name}` }}
          </span>
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
        <v-col class="pt-0 pb-0">
          <span class="text-caption font-weight-medium">{{
            getFormattedBudgetPercentageAmount(category.budget)
          }}</span>
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
        <SubCategorySelector
          v-model="selected"
          :categoryId="categoryId"
          :ignoreOptions="categories?.map(category => category.id)"
          label="Adicionar Subcategoria"
          @update:modelValue="addCategory"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useMonetaryValueHandler } from '@/composables/useMonetaryValueHandler';
import SubCategorySelector from '@/components/core/SubCategorySelector.vue';

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
  categoryId: {
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
