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

      <div
        v-for="(date, index) in calendar.monthDates"
        :key="`day-${date.toUTCString()}`"
        class="w-1/7 min-h-32 pb-4"
        :class="dayBgAndTextColor(date, index)"
        @dblclick="calendar.openEventForm(date)">
        <div class="h-6 mb-1 pl-1 mr-2 flex items-center border-b border-gray-600">
          <p>{{ date.getDate() }}</p>
        </div>

        <div class="relative">
          <CalendarEventForm
            v-if="calendar.isEventFormDisplaying(date)"
            class="absolute top-0 z-20"
            :class="{ 'right-0': index % 7 > 4, 'left-0': index % 7 <= 4 }"
            :index="index"
            :date="date"
          />
        </div>

        <div v-for="event in calendar.eventsByDate(date)"
             :key="`event-${event.id}`"
             class="mb-1 mr-2 text-sm">
          <CalendarEvent :event="event" :index="index" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import store from '@/stores'
import CalendarEvent from '@/components/CalendarEvent.vue'
import CalendarEventForm from '@/components/CalendarEventForm.vue'

@Component({
  components: {
    CalendarEvent,
    CalendarEventForm
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
