<template>
  <div class="w-full">
    <div class="my-4">
      <div class="inline-block text-lg mr-8">
        <span class="mr-2 text-gray-700">Year</span>
        <span class="border rounded-l p-2 cursor-pointer select-none text-gray-500 hover:text-gray-400"
              @click="decrementYear">&lt;</span>
        <span class="border-t border-b p-2">{{ year }}</span>
        <span class="border rounded-r p-2 cursor-pointer select-none text-gray-500 hover:text-gray-400"
              @click="incrementYear">&gt;</span>
      </div>

      <div class="inline-block text-lg">
        <span class="mr-2 text-gray-700">Month</span>
        <span class="border rounded-l p-2 cursor-pointer select-none text-gray-500 hover:text-gray-400"
              @click="decrementMonth">&lt;</span>
        <span class="border-t border-b p-2">{{ month + 1 }}</span>
        <span class="border rounded-r p-2 cursor-pointer select-none text-gray-500 hover:text-gray-400"
              @click="incrementMonth">&gt;</span>
      </div>
    </div>

    <div class="flex flex-wrap">
      <div class="w-1/7 px-2 pb-2 text-gray-700">Sun</div>
      <div class="w-1/7 px-2 pb-2 text-gray-700">Mon</div>
      <div class="w-1/7 px-2 pb-2 text-gray-700">Tue</div>
      <div class="w-1/7 px-2 pb-2 text-gray-700">Wed</div>
      <div class="w-1/7 px-2 pb-2 text-gray-700">Thu</div>
      <div class="w-1/7 px-2 pb-2 text-gray-700">Fri</div>
      <div class="w-1/7 px-2 pb-2 text-gray-700">Sat</div>

      <div
        v-for="(date, index) in monthDates"
        :key="`day-${date.toLocaleString()}`"
        class="w-1/7 h-32 px-2"
        :class="dayBgAndTextColor(date, index)">
        <div class="h-6 flex items-center border-b border-gray-600">
          <p>{{ date.getDate() }}</p>
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

  get monthDates(): Array<Date> {
    const startOfWeek = this.moment.clone()
      .year(this.year)
      .month(this.month)
      .startOf('month')
      .startOf('week')
    const year = startOfWeek.year()
    const month = startOfWeek.month()
    const startDay = startOfWeek.date()
    return Array.from({ length: 42 }, (v, i) => i)
      .map(i => new Date(Date.UTC(year, month, startDay + i)))
  }

  get moment() {
    return moment().utc()
  }

  get dayBgAndTextColor() {
    const today = this.moment.clone().toDate()
    return (date: Date, index: number) => {
      let color = 'bg-white'
      if (date.getMonth() !== this.month) {
        if (index % 7 === 0) {
          color = 'bg-red-100'
        } else if (index % 7 === 6) {
          color = 'bg-blue-100'
        } else {
          color = 'bg-gray-200'
        }
        color += ' text-gray-500'
      } else {
        if (today.toLocaleDateString() === date.toLocaleDateString()) {
          color = 'bg-yellow-200'
        } else if (index % 7 === 0) {
          color = 'bg-red-200'
        } else if (index % 7 === 6) {
          color = 'bg-blue-200'
        }
      }
      return color
    }
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
