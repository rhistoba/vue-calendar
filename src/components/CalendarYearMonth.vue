<template>
  <div>
    <div class="inline-block text-lg mr-8">
      <span class="mr-2 text-gray-700">Year</span>
      <span class="border rounded-l p-2 cursor-pointer select-none text-gray-500 hover:text-gray-400"
            @click="calendar.decrementYear()">&lt;</span>
      <span class="border-t border-b p-2">{{ calendar.year }}</span>
      <span class="border rounded-r p-2 cursor-pointer select-none text-gray-500 hover:text-gray-400"
            @click="calendar.incrementYear()">&gt;</span>
    </div>

    <div class="inline-block text-lg">
      <span class="mr-2 text-gray-700">Month</span>
      <span class="border rounded-l p-2 cursor-pointer select-none text-gray-500 hover:text-gray-400"
            @click="calendar.decrementMonth()">&lt;</span>
      <span class="border-t border-b p-2">{{ calendar.month + 1 }}</span>
      <span class="border rounded-r p-2 cursor-pointer select-none text-gray-500 hover:text-gray-400"
            @click="calendar.incrementMonth()">&gt;</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import store from '@/stores'

@Component
export default class CalendarYearMonth extends Vue {
  calendar = store.calendar
}
</script>
