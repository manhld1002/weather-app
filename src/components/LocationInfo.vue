<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import http from '../utils/axios_config'
import WeatherInfo from './WeatherInfo.vue'
import { useRouter } from 'vue-router'

const apiKey = import.meta.env.VITE_API_KEY
const route = useRouter()
const showDetails = ref(false)
const isLocalData = ref(false)
const weatherDetails = reactive({
  results: null,
  detailsStr: null
})

// Details screen
const openDetails = (data) => {
  showDetails.value = true
  weatherDetails.detailsStr = data
}
const closeDetails = () => {
  showDetails.value = false
}

// Navigation
const navigateBack = () => {
  isLocalData.value = false
  route.go(-1)
}

// Only return 6 hours to display
const filteredHours = computed(() => {
  const hoursToShow = [6, 9, 12, 15, 18, 21]
  return hoursToShow.filter(
    (hour) => hour < weatherDetails.results.forecast.forecastday[0].hour.length
  )
})

// active class
const getScreenClasses = computed(() => ({
  blur: showDetails.value,
  'bg-day': weatherDetails.results?.current?.is_day === 1,
  'bg-night': weatherDetails.results?.current?.is_day === 0,
  'text-white': weatherDetails.results?.current?.is_day === 0,
  'text-gray-500': weatherDetails.results?.current?.is_day === 1
}))

// data either from local storage or API
const fetchWeatherData = async () => {
  if (route.currentRoute.value.query.data !== undefined) {
    weatherDetails.results = JSON.parse(route.currentRoute.value.query.data)
    isLocalData.value = true
  } else {
    const id = route.currentRoute.value.params.id
    http
      .get(`/forecast.json?key=${apiKey}&q=id:${id}&days=10&aqi=no&alerts=no`)
      .then((res) => {
        weatherDetails.results = res.data
      })
      .catch((error) => {
        console.log(error.message)
        throw new Error('Something wrong is happen, please try again later!')
      })
  }
}

// Display content
const getLocationInfo = () => {
  return weatherDetails.results.location.region
    ? `${weatherDetails.results.location.region}, ${weatherDetails.results.location.country}`
    : weatherDetails.results.location.country
}

// Save data to local
const saveToLocal = (name, region) => {
  const savedArr = JSON.parse(localStorage.getItem('arrayForecast'))
  const itemName = savedArr.findIndex((item) => item.location.name === name)
  const itemRegion = savedArr.findIndex((item) => item.location.region === region)
  if (itemName == -1 || itemRegion == -1) {
    const savedArr = localStorage.getItem('arrayForecast')
    if (savedArr == null) {
      const savedArr = [weatherDetails.results]
      localStorage.setItem('arrayForecast', JSON.stringify(savedArr))
      alert('Forecast added!')
    } else {
      const existArr = JSON.parse(savedArr)
      existArr.push(weatherDetails.results)
      localStorage.setItem('arrayForecast', JSON.stringify(existArr))
      alert('Forecast added!')
    }
  } else {
    if (confirm('Already have this forecast. Continue add?')) {
      savedArr.splice(itemName, 1)
      savedArr.push(weatherDetails.results)
      localStorage.setItem('arrayForecast', JSON.stringify(savedArr))
      alert('Forecast added!')
    }
  }
}

// Delete data from local
const deleteFromLocal = (name) => {
  if (confirm(`Delete ${name}? `)) {
    const arr = JSON.parse(localStorage.getItem('arrayForecast'))
    arr.splice(route.currentRoute.value.query.index, 1)
    localStorage.setItem('arrayForecast', JSON.stringify(arr))
    alert('Delete completed!')
    route.go(-1)
  }
}

// Before generating view
onMounted(() => {
  fetchWeatherData()
})
</script>

<template>
  <div class="w-screen" :class="getScreenClasses">
    <!-- Nav bar -->
    <div class="nav-bar border-solid border-1 border-[#8ec5fc] mb-2 shadow-sm">
      <div class="nav-items flex items-center justify-between gap-x-1 p-3">
        <button class="btn-back flex items-center" @click="navigateBack">
          <i class="fa-solid fa-arrow-left fa-xl p-3"></i>
          <p>Forecast details</p>
        </button>
        <button
          v-if="!isLocalData"
          class="btn-add flex items-center px-6"
          @click="
            saveToLocal(
              weatherDetails.results.location.name,
              weatherDetails.results.location.region
            )
          "
        >
          <i class="fa-solid fa-plus"></i>
          <p class="px-[5px]">Add</p>
        </button>
        <button
          v-if="isLocalData"
          class="btn-add flex items-center px-6"
          @click="deleteFromLocal(weatherDetails.results.location.name)"
        >
          <i class="fa-solid fa-trash"></i>
          <p class="px-[5px]">Remove</p>
        </button>
      </div>
    </div>

    <!-- Body -->
    <div
      v-if="weatherDetails.results"
      :class="weatherDetails.results.current.is_day == 1 ? 'text-gray-500' : 'text-white'"
      class="flex flex-row"
    >
      <!-- General information -->
      <div class="basis-2/3">
        <div class="flex flex-row">
          <div class="basis-4/5 m-6">
            <!-- Location -->
            <div class="flex items-center">
              <div class="px-3 pl-[10px]">
                <i class="fa-solid fa-globe"></i>
              </div>
              <div class="">
                <h1 class="text-4xl font-semibold">{{ weatherDetails.results.location.name }}</h1>
                <p class="text-lg italic opacity-[0.7]">
                  {{ getLocationInfo() }}
                </p>
              </div>
            </div>

            <!-- Lat & Lon -->
            <div class="flex items-center">
              <div class="p-3">
                <i class="fa-solid fa-location-dot"></i>
              </div>
              <div class="pr-[10px] text-lg">
                <p>
                  {{ weatherDetails.results.location.lat }},
                  {{ weatherDetails.results.location.lon }}
                </p>
              </div>
            </div>

            <!-- Current condition -->
            <div class="flex items-center">
              <div class="p-3">
                <i class="fa-solid fa-tornado"></i>
              </div>
              <div class="pr-[10px] text-lg">
                <p>{{ weatherDetails.results.current.condition.text }}</p>
              </div>
            </div>

            <!-- Temperature -->
            <div class="mt-6 ml-3">
              <p class="text-8xl font-semibold">
                {{ Math.round(weatherDetails.results.current.temp_c) }}&deg;
              </p>
            </div>
          </div>
          <div class="basis-2/5 flex justify-center items-center">
            <img :src="weatherDetails.results.current.condition.icon" class="w-3/4 h-2/3" />
          </div>
        </div>

        <!-- Today's forecast -->
        <div
          :class="weatherDetails.results.current.is_day == 1 ? 'bg-sky-50' : 'bg-gray-500'"
          class="m-6 px-6 pb-6 pt-4 rounded-3xl"
        >
          <div class="flex justify-between items-center pb-2">
            <h2 class="pb-2 text-lg opacity-[0.7]">Today's forecast</h2>
            <button
              :class="weatherDetails.results.current.is_day == 1 ? 'bg-sky-200' : 'bg-sky-500'"
              @click="openDetails('tdy')"
              class="rounded-full w-16 text-sm h-8"
            >
              More
            </button>
          </div>

          <!-- Forecast Hourly -->
          <div class="grid grid-cols-6 overflow-auto">
            <div
              v-for="hour in filteredHours"
              :key="hour"
              class="info flex-1 border-white-400 border-r-[1px] flex flex-col justify-center items-center rounded-2xl"
              :class="{
                'hover:bg-blue-100': weatherDetails.results.current.is_day === 1,
                'hover:bg-zinc-600': weatherDetails.results.current.is_day === 0
              }"
            >
              <ul class="">
                <li class="text-center py-4">
                  <h1 class="opacity-[0.7]">
                    {{
                      $globFunc.formatTime(
                        weatherDetails.results.forecast.forecastday[0].hour[hour].time
                      )
                    }}
                    {{ hour < 12 ? 'AM' : 'PM' }}
                  </h1>
                </li>
                <li class="text-center">
                  <img
                    :src="weatherDetails.results.forecast.forecastday[0].hour[hour].condition.icon"
                    class=""
                  />
                </li>
                <li class="text-center pt-4">
                  <h1 class="text-lg font-semibold">
                    {{
                      Math.round(weatherDetails.results.forecast.forecastday[0].hour[hour].temp_c)
                    }}&deg;
                  </h1>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Conditions -->
        <div
          :class="weatherDetails.results.current.is_day == 1 ? 'bg-sky-50' : 'bg-gray-500'"
          class="m-6 px-6 pb-6 pt-4 rounded-3xl"
        >
          <div class="pb-2">
            <div class="flex justify-between items-center pb-2">
              <h2 class="pb-2 text-lg opacity-[0.7]">Other conditions</h2>
              <button
                :class="weatherDetails.results.current.is_day == 1 ? 'bg-sky-200' : 'bg-sky-500'"
                @click="openDetails('cdn')"
                class="rounded-full w-16 text-sm h-8"
              >
                More
              </button>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex items-start justify-start p-2">
                <div class="pr-1">
                  <i class="fa-solid fa-temperature-three-quarters fa-xl"></i>
                </div>
                <div class="info px-1">
                  <p class="text-xl pt-[1px] opacity-[0.7]">Real Feel</p>
                  <p class="text-3xl pt-1 font-semibold">
                    {{ Math.round(weatherDetails.results.current.feelslike_c) }}&deg;
                  </p>
                </div>
              </div>
              <div class="flex justify-start p-2">
                <div class="pr-1">
                  <i class="fa-solid fa-wind fa-xl"></i>
                </div>
                <div class="info px-1">
                  <p class="text-xl pt-[1px] opacity-[0.7]">Wind speed</p>
                  <p class="text-3xl pt-1 font-semibold">
                    {{ weatherDetails.results.current.wind_kph }} km/h
                  </p>
                </div>
              </div>
              <div class="flex justify-start p-2">
                <div class="pr-1">
                  <i class="fa-solid fa-cloud-rain fa-xl"></i>
                </div>
                <div class="info px-1">
                  <p class="text-xl pt-[1px] opacity-[0.7]">Chance of rain</p>
                  <p class="text-3xl pt-1 font-semibold">
                    {{ weatherDetails.results.forecast.forecastday[0].day.daily_chance_of_rain }}%
                  </p>
                </div>
              </div>
              <div class="flex justify-start p-2">
                <div class="pr-1">
                  <i class="fa-solid fa-cloud fa-xl"></i>
                </div>
                <div class="info px-1">
                  <p class="text-xl pt-[1px] opacity-[0.7]">Cloud cover</p>
                  <p class="text-3xl pt-1 font-semibold">
                    {{ weatherDetails.results.current.cloud }}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- n-days forecast -->
      <div
        :class="weatherDetails.results.current.is_day == 1 ? 'bg-sky-50' : 'bg-gray-500'"
        class="basis-1/3 p-5 rounded-3xl mr-5 mb-5"
      >
        <h1 class="opacity-[0.7] text-lg pb-2 scroll-auto">
          {{ weatherDetails.results.forecast.forecastday.length }}-Days Forecast
        </h1>

        <!-- Forecast of days -->
        <div
          v-for="day in weatherDetails.results.forecast.forecastday"
          :key="day"
          class="rounded-2xl x-2 px-2 py-1"
          :class="{
            'hover:bg-blue-100': weatherDetails.results.current.is_day === 1,
            'hover:bg-zinc-600': weatherDetails.results.current.is_day === 0
          }"
        >
          <div class="grid grid-cols-3 gap-6">
            <div class="flex items-center justify-start">
              <h1>
                {{
                  new Date(day.date).getDate() == new Date().getDate()
                    ? 'Today'
                    : new Date(day.date).toLocaleDateString('en-us', { weekday: 'long' })
                }}
              </h1>
            </div>

            <div class="icon flex items-center justify-start">
              <img :src="day.day.condition.icon" class="" />
              <p class="pl-2">{{ day.day.condition.text }}</p>
            </div>

            <div class="flex items-center justify-end">
              <p>{{ Math.round(day.day.maxtemp_c) }}&deg;</p>
              <p class="opacity-[0.7]">/{{ Math.round(day.day.mintemp_c) }}&deg;</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p v-if="weatherDetails.results" class="text-center pb-2 italic opacity-[0.5]">
      Updated at: {{ weatherDetails.results?.current.last_updated }}
    </p>
  </div>

  <!-- In-depth details -->
  <Transition name="fade">
    <div v-show="showDetails">
      <WeatherInfo :condition="weatherDetails" @close-info="closeDetails" />
    </div>
  </Transition>
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

/* Transition effect */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
