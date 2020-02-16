<template>
  <div>
    <div @mouseenter="openEventInfo" @mouseleave="closeEventInfo">
      <div class="bg-blue-500 text-white h-5 px-1 truncate cursor-default">
      <span>
        {{ `${('0' + this.event.date.getUTCHours()).slice(-2)}:${('0' + this.event.date.getUTCMinutes()).slice(-2)}` }}
      </span>
        <span class="ml-1 hidden sm:inline">{{ event.title }}</span>
      </div>

      <div class="relative">
        <CalendarEventInfo
          class="absolute top-0 z-10"
          :class="{ 'right-0': index % 7 > 4, 'left-0': index % 7 <= 4 }"
          :event="event"
          v-if="isEventInfoDisplaying"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Component, Vue } from 'vue-property-decorator'
import { Event } from '@/types'
import CalendarEventInfo from '@/components/CalendarEventInfo.vue'

const Props = Vue.extend({
  props: {
    event: Object as PropType<Event>,
    index: Number as PropType<number>
  }
})

@Component({
  components: {
    CalendarEventInfo
  }
})
export default class CalendarEvent extends Props {
  isEventInfoDisplaying = false

  openEventInfo(): void {
    this.isEventInfoDisplaying = true
  }

  closeEventInfo(): void {
    this.isEventInfoDisplaying = false
  }
}
</script>
