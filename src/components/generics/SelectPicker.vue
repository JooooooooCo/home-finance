<template>
  <div>
    <v-select
      :label="label"
      :items="[]"
      :model-value="selectedLabel"
      variant="solo-filled"
      flat
      rounded-sm
      required
      :menu-props="{ openOnClick: false }"
      @click="dialog = true"
      readonly
      :disabled="disabled"
      :hide-details="hideDetails"
    />

    <v-dialog v-model="dialog" width="400">
      <v-card class="d-flex flex-column">
        <v-card-title>{{ label }}</v-card-title>
        <v-divider />
        <v-card-text class="flex-grow-1 overflow-y-auto">
          <v-list>
            <v-list-item v-for="option in items" :key="option.id">
              <v-btn
                variant="tonal"
                color="blue-grey darken-4"
                large
                block
                @click="selectOption(option)"
              >
                <v-col class="text-wrap">{{ option.name }}</v-col>
              </v-btn>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn text @click="dialog = false">CANCELAR</v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: Number,
    default: null,
  },
  label: {
    type: String,
    default: 'Selecionar',
  },
  disabled: {
    type: Boolean,
    default: false
  },
  hideDetails: {
    type: Boolean,
    default: false,
  }
})

const emit = defineEmits(['update:modelValue'])

const dialog = ref(false)

const selectedLabel = computed(() => {
  const found = props.items.find(item => item.id === props.modelValue)
  return found ? found.name : ''
})

const selectOption = (option) => {
  emit('update:modelValue', option.id)
  dialog.value = false
}
</script>
