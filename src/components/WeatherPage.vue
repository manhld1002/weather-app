<script setup>
import SearchField from './SearchField.vue'
import { ref } from 'vue'

const places = ref([])

const addPlace = (data) => {
  places.value.push(data)
}
</script>

<template>
  <div class="text-center px-6 py-2">
    <h1 class="text-3xl">Welcome to weather forecast</h1>
  </div>

  <div class="text-center mb-6 px-6">
    {{
      new Date().toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }}
  </div>

  <!-- Search -->
  <div class="px-6">
    <SearchField @place-data="addPlace"> </SearchField>
  </div>
</template>
