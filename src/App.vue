<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import M from 'materialize-css'

onMounted(() => {
  M.AutoInit()
})
</script>

<style lang="scss"></style>
