<template>
  <v-form @submit.prevent="emitSaveItem">
    <v-container>
      <slot :item="item"></slot>

      <v-row>
        <v-col cols="6" md="3" offset-md="6">
          <v-btn @click="emitCancel" variant="text" large block>Cancel</v-btn>
        </v-col>
        <v-col cols="6" md="3">
          <v-btn block color="teal darken-2" type="submit">Save</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['save', 'cancel']);

const emitSaveItem = () => {
  emit('save', props.item);
};

const emitCancel = () => {
  emit('cancel');
};
</script>
