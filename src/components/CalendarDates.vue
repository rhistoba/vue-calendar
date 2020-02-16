<template>
  <div>
    <div class="flex flex-wrap">
      <div class="w-1/7 pb-2 text-gray-700">Sun</div>
      <div class="w-1/7 pb-2 text-gray-700">Mon</div>
      <div class="w-1/7 pb-2 text-gray-700">Tue</div>
      <div class="w-1/7 pb-2 text-gray-700">Wed</div>
      <div class="w-1/7 pb-2 text-gray-700">Thu</div>
      <div class="w-1/7 pb-2 text-gray-700">Fri</div>
      <div class="w-1/7 pb-2 text-gray-700">Sat</div>

      <CalendarDate
        :date="date"
        :index="index"
        v-for="(date, index) in calendar.monthDates"
        :key="`day-${date.toUTCString()}`"
        class="w-1/7 min-h-32"
        :class="dayBgAndTextColor(date, index)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import store from '@/stores'
import CalendarDate from '@/components/CalendarDate.vue'

@Component({
  components: {
    CalendarDate
  }
})
export default class CalendarDates extends Vue {
  calendar = store.calendar

  get dayBgAndTextColor(): Function {
    const today = this.calendar.today
    return (date: Date, index: number): string => {
      let color = 'bg-white'
      if (date.getMonth() !== this.calendar.month) {
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
}
</script>

<style scoped lang="scss">
.w-1\/7 {
  width: 14.285%;
}
.min-h-32 {
  min-height: 8rem;
}
</style>
