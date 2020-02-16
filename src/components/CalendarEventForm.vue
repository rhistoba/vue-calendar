<template>
  <div>
    <form class="flex flex-col justify-between min-h-32 w-64 rounded border border-gray-400 p-2 bg-white text-black select-none">
      <div>
        <label class="text-sm mr-2">time</label>
        <select class="appearance-none rounded px-2 py-1 w-12 border border-gray-400 mr-1 bg-white"
                v-model="calendar.formDateHour">
          <option v-for="hour in Array.from({ length: 24 }, (v,i) => i)"
                  :key="`hour-${hour}`"
                  :value="hour">
            {{ ('0' + hour).slice(-2) }}
          </option>
        </select>
        <span class="mr-1">:</span>
        <select class="appearance-none rounded px-2 py-1 w-12 border border-gray-400 mr-1 bg-white"
                v-model="calendar.formDateMinute">
          <option v-for="minute in Array.from({ length: 12 }, (v,i) => i * 5)"
                  :key="`minute-${minute}`"
                  :value="minute">
            {{ ('0' + minute).slice(-2) }}
          </option>
        </select>
      </div>
      <div>
        <label class="text-sm">title</label>
        <input type="text"
               class="rounded px-2 py-1 w-full border border-gray-400"
               v-model="calendar.formTitle">
      </div>
      <div>
        <label class="text-sm">content</label>
        <textarea rows="2"
                  class="rounded px-2 py-1 w-full border border-gray-400"
                  v-model="calendar.formContent"></textarea>
      </div>
      <div class="flex justify-start mt-2">
        <button type="submit"
                class="px-2 py-1 text-sm rounded bg-blue-500 hover:bg-blue-400 text-white cursor-pointer select-none mr-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
                :disabled="!calendar.isValidParams"
                @click.prevent="calendar.submitEvent">
          {{ calendar.form.targetEventId ? 'update' : 'create' }}
        </button>
        <button type="button"
                class="px-2 py-1 text-sm rounded bg-gray-700 hover:bg-gray-600 text-white cursor-pointer select-none"
                @click="calendar.closeEventForm">
          close
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Component, Vue } from 'vue-property-decorator'
import store from '@/stores'

const Props = Vue.extend({
  props: {
    index: Number as PropType<number>,
    date: Date as PropType<Date>
  }
})

@Component
export default class CalendarEventForm extends Props {
  calendar = store.calendar
}
</script>
