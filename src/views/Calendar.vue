<template>
  <div class="w-full">
    <div class="my-4">
      <div class="inline-block text-lg mr-8">
        <span class="mr-2">Year</span>
        <span class="border rounded-l p-2 cursor-pointer select-none text-gray-500 hover:text-gray-400"
              @click="decrementYear">&lt;</span>
        <span class="border-t border-b p-2">{{ year }}</span>
        <span class="border rounded-r p-2 cursor-pointer select-none text-gray-500 hover:text-gray-400"
              @click="incrementYear">&gt;</span>
      </div>

      <div class="inline-block text-lg">
        <span class="mr-2">Month</span>
        <span class="border rounded-l p-2 cursor-pointer select-none text-gray-500 hover:text-gray-400"
              @click="decrementMonth">&lt;</span>
        <span class="border-t border-b p-2">{{ month + 1 }}</span>
        <span class="border rounded-r p-2 cursor-pointer select-none text-gray-500 hover:text-gray-400"
              @click="incrementMonth">&gt;</span>
      </div>
    </div>

    <div class="flex flex-wrap">
      <div class="w-1/7 px-2 pb-2 text-gray-600">Sun</div>
      <div class="w-1/7 px-2 pb-2 text-gray-600">Mon</div>
      <div class="w-1/7 px-2 pb-2 text-gray-600">Tue</div>
      <div class="w-1/7 px-2 pb-2 text-gray-600">Wed</div>
      <div class="w-1/7 px-2 pb-2 text-gray-600">Thu</div>
      <div class="w-1/7 px-2 pb-2 text-gray-600">Fri</div>
      <div class="w-1/7 px-2 pb-2 text-gray-600">Sat</div>

      <div
        v-for="(day, index) in monthDays"
        :key="`day-${day.toLocaleString()}`"
        class="w-1/7 h-32 px-2"
        :class="{ 'bg-red-100': index % 7 === 0, 'bg-blue-100': index % 7 === 6 }">
        <div class="h-6 flex items-center border-b border-gray-400">
          <p>{{ day.getDate() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import moment from 'moment'

@Component
export default class Calendar extends Vue {
  year: number = this.moment.year()
  month: number = this.moment.month()

  get monthDays(): Array<Date> {
    const startOfWeek = this.startOfMonth.startOf('week')
    const year = startOfWeek.year()
    const month = startOfWeek.month()
    const startDay = startOfWeek.date()
    return Array.from({ length: 35 }, (v, i) => i)
      .map(i => new Date(Date.UTC(year, month, startDay + i)))
  }

  get moment() {
    return moment().utc()
  }

  get startOfMonth() {
    return this.moment.year(this.year).month(this.month).startOf('month')
  }

  incrementYear(): void {
    const result = this.year + 1
    if (1900 <= result && result < 2200) {
      this.year = result
    }
  }

  decrementYear(): void {
    const result = this.year - 1
    if (1900 <= result && result < 2200) {
      this.year = result
    }
  }

  incrementMonth(): void {
    if (this.month === 11)  {
      this.incrementYear()
      this.month = 0
    } else {
      this.month++
    }
  }

  decrementMonth(): void {
    if (this.month === 0) {
      this.decrementYear()
      this.month = 11
    } else {
      this.month--
    }
  }
}
</script>

<style lang="scss">
.w-1\/7 {
  width: 14.285%;
}
</style>
