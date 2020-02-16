<template>
  <div>
    <div class="flex flex-col justify-between w-64 min-h-32 p-2 rounded bg-white text-black border border-gray-400">
      <div>
        <p class="text-xs font-thin">{{ event.date.toUTCString() }}</p>
        <p class="text-xl font-bold break-all mb-1 border-b border-black">{{ event.title }}</p>
        <p class="w-full break-all whitespace-pre-wrap">{{ event.content }}</p>
      </div>
      <div class="mt-2">
        <button type="button"
                class="px-2 py-1 mr-2 text-sm rounded bg-teal-500 hover:bg-teal-400 text-white cursor-pointer select-none">
          edit
        </button>
        <button type="button"
                class="px-2 py-1 text-sm rounded bg-red-500 hover:bg-red-400 text-white cursor-pointer select-none"
                v-show="!isDisplayReallyRemove"
                @click="confirmRemoveEvent">
          remove
        </button>
        <button type="button"
                class="px-2 py-1 text-sm rounded bg-white text-red-500 cursor-pointer select-none"
                v-show="isDisplayReallyRemove"
                @click="removeEvent">
          really?
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Component, Vue } from 'vue-property-decorator'
import { Event } from '@/types'
import store from '@/stores'

const Props = Vue.extend({
  props: {
    event: Object as PropType<Event>
  }
})

@Component
export default class CalendarEventInfo extends Props {
  calendar = store.calendar
  isDisplayReallyRemove = false

  confirmRemoveEvent(): void {
    this.isDisplayReallyRemove = true
  }

  removeEvent(): void {
    this.calendar.removeEvent(this.event)
    this.isDisplayReallyRemove = false
  }
}
</script>
