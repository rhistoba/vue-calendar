<template>
  <div @dblclick="calendar.newEvent(date)">
    <div class="h-6 mb-1 pl-1 mr-2 flex items-center border-b border-gray-600">
      <p>{{ date.getDate() }}</p>
    </div>

    <div class="relative">
      <CalendarEventForm
        v-if="calendar.isEventFormDisplaying(date)"
        class="absolute top-0 z-20"
        :class="{ 'right-0': index % 7 > 4, 'left-0': index % 7 <= 4 }"
      />
    </div>

    <div v-for="event in calendar.eventsByDate(date)"
         :key="`event-${event.id}`"
         class="mb-1 mr-2 text-sm">
      <CalendarEvent :event="event" :index="index" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CalendarEvent from "@/components/CalendarEvent.vue"
import CalendarEventForm from "@/components/CalendarEventForm.vue"
import { PropType } from "vue"
import store from '@/stores'

const Props = Vue.extend({
  props: {
    date: Date as PropType<Date>,
    index: Number as PropType<number>
  }
})

@Component({
  components: {
    CalendarEvent,
    CalendarEventForm
  }
})
export default class CalendarDate extends Props {
  calendar = store.calendar
}
</script>
