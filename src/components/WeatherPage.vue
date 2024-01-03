<script setup>
import SearchField from './SearchField.vue'
import { ref } from 'vue'
import HeaderStart from "../views/HeaderStart.vue";
const places = ref([])

const addPlace = (data) => {
  places.value.push(data)
}
</script>

<template>
  <!-- Header -->
  <HeaderStart/>

  <!-- Search -->
  <div class="px-6">
    <SearchField @place-data="addPlace"> </SearchField>
  </div>
  
</template>
