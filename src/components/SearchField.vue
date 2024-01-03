<script setup>
import { onMounted, reactive, ref } from 'vue'
import http from '../utils/axios_config'
import { useRouter } from 'vue-router'

// API key
const apiKey = import.meta.env.VITE_API_KEY
const router = useRouter()
const searchInput = reactive({
  input: '',
  timeout: null,
  results: null
})
const savedForecastArr = ref([])
const handleSearch = () => {
  clearTimeout(searchInput.timeout)
  searchInput.timeout = setTimeout(() => {
    if (searchInput.input !== '') {
      http
        .get(`/search.json?key=${apiKey}&q=${searchInput.input}`)
        .then((res) => {
          searchInput.results = res.data
        })
        .catch((error) => {
          console.log(error.message)
          throw new Error('Something wrong is happen, please try again later!')
        })
    } else {
      searchInput.results = ''
    }
  }, 500)
}

// Navigate to details screen for API fetch
const getWeather = (id) => {
  if (id !== null) {
    router.push({ name: 'detail', params: { id } })
  }
}

// Navigate to detials screen for displaying LS data
const handleClick = (forecast, index) => {
  const formatForecast = JSON.stringify(forecast)
  router.push({ name: 'detail', query: { data: formatForecast, index: index } })
}

onMounted(() => {
  const jsonStr = localStorage.getItem('arrayForecast')
  savedForecastArr.value = jsonStr ? JSON.parse(jsonStr) : []
})
</script>

<template>
  <div class="relative">
    <!-- Search field -->
    <form>
      <div
        class="bg-white border border-indigo-600/30 rounded-lg hover:shadow-lg flex items-center"
      >
        <i class="fa-solid fa-magnifying-glass p-2 text-indigo-600"></i>
        <input
          type="text"
          placeholder="Search for a location"
          class="rounded-r-lg p-2 border-0 outline-0 ring-inset w-full"
          v-model="searchInput.input"
          @input="handleSearch"
        />
      </div>
    </form>

    <!-- Search suggestions -->
    <div class="absolute bg-white my-2 rounded-lg shadow-lg z-10 w-full">
      <div v-if="searchInput.results">
        <div v-for="place in searchInput.results" :key="place.id">
          <button
            class="px-3 my-2 hover:text-indigo-600 w-full text-left"
            @click="getWeather(place.id)"
          >
            {{ place.name }}, {{ place.country }} {{ place.region ? '- ' + place.region : '' }}
          </button>
        </div>
      </div>
    </div>


    <div class="py-2 text-2xl underline">
      <p>Saved forecasts ({{ savedForecastArr.length }}): </p>
    </div>
    <!-- List LS forecasts  -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 py-4">
      <div
        v-for="(forecast, index) in savedForecastArr"
        :key="index"
        class="rounded-full cursor-pointer"
        :class="{
          'bg-day': forecast.current.is_day === 1,
          'bg-night': forecast.current.is_day === 0,
          'text-white': forecast.current.is_day === 0,
          'text-gray-500': forecast.current.is_day === 1
        }"
        @click="handleClick(forecast, index)"
      >
        <div class="m-6 flex items-center justify-between">
          <div class="flex items-center">
            <i
              class="fa-solid fa-xl pr-4 pl-1"
              :class="{
                'fa-moon': forecast.current.is_day === 0,
                'fa-sun': forecast.current.is_day === 1
              }"
            ></i>
            <div class="">
              <p class="text-3xl">
                {{ forecast.location.name }}
              </p>
              <p class="italic opacity-[0.7] text-sm">{{ forecast.current.condition.text }}</p>
              <p class="italic opacity-[0.7] text-sm">Updated: {{ forecast.current.last_updated }}</p>
            </div>
          </div>
          <div>
            <p class="text-3xl font-semibold">{{ Math.round(forecast.current.temp_c) }}&deg;</p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="savedForecastArr.length == 0">
    <h1>No current forecast saved. </h1>
    </div>
  </div>
</template>

<style scoped>
.bg-day {
  background-color: #8ec5fc;
  background-image: linear-gradient(62deg, #8ec5fc 0%, #e0c3fc 100%);
}
.bg-night {
  background-color: #07223d;
  background-image: linear-gradient(62deg, #0a2a4a 0%, #270845 100%);
}
</style>
