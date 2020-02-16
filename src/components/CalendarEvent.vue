<template>
  <div>
    <div class="bg-blue-500 text-white h-5 px-1 truncate cursor-default">
      <span>
        {{ `${('0' + this.event.date.getUTCHours()).slice(-2)}:${('0' + this.event.date.getUTCMinutes()).slice(-2)}` }}
      </span>
      <span class="ml-1 hidden sm:inline">{{ event.title }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Component, Vue } from 'vue-property-decorator'
import { Event } from '@/types'

const Props = Vue.extend({
  props: {
    event: Object as PropType<Event>
  }
})

@Component
export default class CalendarEvent extends Props {
}
</script>
