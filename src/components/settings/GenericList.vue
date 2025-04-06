<template>
    <div>
      <v-list select-strategy="leaf">
        <v-list-item
          v-for="item in items" :key="item.id"
          :value="item.id"
          @click.stop="emitEditItem(item)"
        >
          <v-list-item-title>{{ item.name }}</v-list-item-title>
  
          <template v-slot:append>
            <v-btn @click.stop="emitDeleteItem(item.id)" color="red" icon="mdi-delete" variant="text"></v-btn>
          </template>
        </v-list-item>
      </v-list>
  
      <v-btn @click.prevent="emitAddItem()" position="fixed" location="bottom right" class="ma-4" size="large" icon="mdi-plus" color="teal darken-2"/>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    items: {
      type: Array,
      required: true,
    },
  });
  
  const emit = defineEmits(['add', 'edit', 'delete']);
  
  const emitAddItem = () => {
    emit('add');
  };
  
  const emitEditItem = (item) => {
    emit('edit', item);
  };
  
  const emitDeleteItem = (itemId) => {
    emit('delete', itemId);
  };
  </script>