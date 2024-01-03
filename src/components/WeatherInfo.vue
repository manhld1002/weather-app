<script setup>
const { condition } = defineProps(['condition'])
const emit = defineEmits(['close-info'])
</script>

<template>
  <div
    class="absolute bg-white/80 blur-none backdrop-blur-xl text-slate-900 inset-y-1/3 inset-x-1/3 rounded-lg p-2"
    v-if="condition.results"
  >
    <!-- Close button -->
    <div class="flex justify-between mb-5 p-1">
      <p>
        {{
          new Date(condition.results.current.last_updated).toLocaleDateString('en-us', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        }}
      </p>
      <button @click="emit('close-info')">
        <i class="fa-solid fa-xmark text-xl"></i>
      </button>
    </div>

    <!-- Other condition -->
    <div v-if="condition.detailsStr == 'cdn'" class="grid grid-cols-3 gap-2">
      <!-- Wind speed -->
      <div class="text-center flex-1 " >
        <i class="fa-solid fa-wind mb text-2xl"></i>
        <p class="text-xl font-bold">
          {{ Math.round(condition.results.forecast.forecastday[0].day.maxtemp_c) }}&deg; /
          <span class="opacity-[0.5]"
            >{{ Math.round(condition.results.forecast.forecastday[0].day.mintemp_c) }}&deg;</span
          >
        </p>
        <p>max/min temperature</p>
      </div>
      <!-- Humidity level -->
      <div class="text-center flex-1 " >
        <i class="fa-solid fa-droplet mb text-2xl"></i>
        <p class="text-xl font-bold">
          {{ condition.results.forecast.forecastday[0].day.avghumidity }}%
        </p>
        <p>Avg humidity</p>
      </div>
      <!-- Precipitation -->
      <div class="text-center flex-1 " >
        <i class="fa-solid fa-umbrella mb text-2xl"></i>
        <p class="text-xl font-bold">
          {{ condition.results.forecast.forecastday[0].day.totalprecip_mm }} mm
        </p>
        <p>precipitation</p>
      </div>
      <!-- Wind direction -->
      <div class="text-center flex-1 " >
        <i class="fa-solid fa-fan mb text-2xl"></i>
        <p class="text-xl font-bold">{{ condition.results.current.wind_dir }}</p>
        <p>Wind direction</p>
      </div>
      <!-- Feels like -->
      <div class="text-center flex-1 " >
        <i class="fa-solid fa-temperature-half mb text-2xl"></i>
        <p class="text-xl font-bold">
          {{ condition.results.forecast.forecastday[0].day.avgvis_km }} km/h
        </p>
        <p>Vision</p>
      </div>
      <!-- UV -->
      <div class="text-center flex-1 " >
        <i class="fa-solid fa-sun mb text-2xl"></i>
        <p class="text-xl font-bold">{{ condition.results.forecast.forecastday[0].day.uv }}</p>
        <p>UV index</p>
      </div>
      <div class="mb-20"></div>
    </div>

    <!-- Hourly forecast of today -->
    <div v-if="condition.detailsStr == 'tdy'" class="max-h-56 overflow-y-auto">
      <ul
        v-for="hour in condition.results.forecast.forecastday[0].hour"
        :key="hour"
        class="divide-gray-300 p-1"
      >
        <li class="py-2 " >
          <div class="gen-info overflow-y-auto">
            <div class="grid grid-cols-4 gap-6">
              <div class="flex items-center justify-start">
                <h1>
                  {{ $globFunc.formatTime(hour.time) }}
                  {{ new Date(hour.time).getHours() > 12 ? 'PM' : 'AM' }}
                </h1>
              </div>
              <div class="col-span-2">
                <div class="icon flex items-center justify-start">
                  <img :src="hour.condition.icon" />
                  <p class="pl-2">{{ hour.condition.text }}</p>
                </div>
              </div>
              <div class="flex items-center justify-end">
                <p>{{ Math.round(hour.temp_c) }}&deg;</p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
