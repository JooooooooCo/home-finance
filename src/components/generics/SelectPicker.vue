<template>
  <div>
    <v-select :label="label" :items="[]" :model-value="selectedName" variant="outlined" required
      :menu-props="{ openOnClick: false }" @click="dialog = true" readonly />

    <v-dialog v-model="dialog" width="400">
      <v-card>
        <v-card-title>{{ label }}</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-list>
            <v-list-item v-for="option in items" :key="option.id" @click="selectOption(option)">
              <v-list-item-title>{{ option.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false">Cancelar</v-btn>
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
})

const emit = defineEmits(['update:modelValue'])

const dialog = ref(false)

const selectedName = computed(() => {
  const found = props.items.find(item => item.id === props.modelValue)
  return found ? found.name : ''
})

const selectOption = (option) => {
  emit('update:modelValue', option.id)
  dialog.value = false
}
</script>
