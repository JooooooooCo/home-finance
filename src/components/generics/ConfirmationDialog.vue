<template>
  <v-dialog :model-value="isOpen" max-width="80%" width="300" :persistent="persistent" @afterLeave="cancel">
    <v-card>
      <v-card-title class="text-h6 text-center">
        <v-row>
          <v-col>
            <v-icon color="warning" icon="mdi-alert-circle" size="150" />
          </v-col>
        </v-row>
        <v-row class="mt-0">
          <v-col>
            {{ title }}
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-text>
        {{ message }}
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="cancel">CANCELAR</v-btn>
        <v-btn color="teal darken-2" @click="confirm">CONFIRMAR</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: 'Atenção!'
  },
  message: {
    type: String,
    default: 'Deseja realmente prosseguir?'
  },
  persistent: {
    type: Boolean,
    default: true
  },
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const isOpen = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

function confirm() {
  emit('confirm')
  isOpen.value = false
}

function cancel() {
  emit('cancel')
  isOpen.value = false
}
</script>