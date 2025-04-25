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
      :hide-details="hideDetails"
    />

    <v-dialog v-model="dialog" width="400">
      <v-card>
        <v-card-title>{{ label }}</v-card-title>
        <v-divider />
        <v-card-text>
          <v-list>
            <v-list-item v-for="option in items" :key="option.id">
              <v-btn
                :variant="isSelected(option.id) ? 'flat' : 'tonal'"
                large
                block
                :color="isSelected(option.id) ? 'teal darken-2' : ''"
                class="pa-2"
                @click="toggleSelection(option.id)"
              >
                <v-col class="text-wrap">{{ option.name }}</v-col>
              </v-btn>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false">Cancelar</v-btn>
          <v-btn text @click="emitSelection">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: Array,
    default: () => [],
  },
  label: {
    type: String,
    default: 'Selecionar',
  },
  hideDetails: {
    type: Boolean,
    default: true,
  }
})

const emit = defineEmits(['update:modelValue'])

const dialog = ref(false)
const selectedIds = ref([...props.modelValue])

watch(() => props.modelValue, (val) => {
  selectedIds.value = [...(val || [])]
})

const selectedLabel = computed(() => {
  const selectedItems = props.items.filter(i => selectedIds.value.includes(i.id))
  return selectedItems.map(i => i.name).join(', ')
})

const isSelected = (id) => {
  return selectedIds.value.includes(id)
}

const toggleSelection = (id) => {
  const index = selectedIds.value.indexOf(id)
  if (index === -1) {
    selectedIds.value.push(id)
  } else {
    selectedIds.value.splice(index, 1)
  }
}

const emitSelection = () => {
  emit('update:modelValue', [...selectedIds.value])
  dialog.value = false
}
</script>
