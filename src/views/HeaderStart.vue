<script setup></script>

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
</template>
