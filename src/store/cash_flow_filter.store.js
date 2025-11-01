import { defineStore } from 'pinia';

const STORAGE_KEY = 'cashFlowFilters';

const emptyFilterObject = {
  type: [],
  paymentTypeIds: [],
  paymentStatuses: [],
  dueDateRange: [],
  paymentDateRange: [],
  purchaseDateRange: [],
  amountMin: '',
  amountMax: '',
  classificationId: null,
  categoryId: null,
  subCategoryId: null,
  description: '',
  reconciled: 1,
  notReconciled: 1,
};

const loadFiltersFromStorage = () => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return { ...emptyFilterObject };

    const parsed = JSON.parse(stored);

    const dateRanges = ['dueDateRange', 'paymentDateRange', 'purchaseDateRange'];
    dateRanges.forEach(rangeKey => {
      if (parsed[rangeKey] && Array.isArray(parsed[rangeKey])) {
        parsed[rangeKey] = parsed[rangeKey]
          .map(dateStr => (dateStr ? new Date(dateStr) : null))
          .filter(date => date !== null);
      }
    });

    return parsed;
  } catch (error) {
    console.warn('Error loading filters from sessionStorage:', error);
    return { ...emptyFilterObject };
  }
};

const saveFiltersToStorage = filtersToSave => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filtersToSave));
  } catch (error) {
    console.warn('Error saving filters to sessionStorage:', error);
  }
};

export const useCashFlowFilterStore = defineStore('cashFlowFilter', {
  state: () => ({
    filters: loadFiltersFromStorage(),
  }),
  getters: {
    getFilters: state => state.filters,
    hasStoredFilters: () => !!sessionStorage.getItem(STORAGE_KEY),
  },
  actions: {
    setFilters(newFilters) {
      this.filters = { ...newFilters };
      saveFiltersToStorage(this.filters);
    },
    updateFilter(key, value) {
      this.filters[key] = value;
      saveFiltersToStorage(this.filters);
    },
    resetFilters() {
      this.filters = { ...emptyFilterObject };
      saveFiltersToStorage(this.filters);
    },
    loadFilters() {
      this.filters = loadFiltersFromStorage();
    },
  },
});
