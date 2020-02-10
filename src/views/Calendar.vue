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
        :key="`day-${date.toUTCString()}`"
        class="w-1/7 min-h-32 px-1 pb-4"
        :class="dayBgAndTextColor(date, index)"
        @dblclick="openEventForm(date)">
        <div class="h-6 mb-1 flex items-center border-b border-gray-600">
          <p>{{ date.getDate() }}</p>
        </div>

        <div class="relative">
          <div class="absolute top-0 z-20"
               :class="{ 'right-0': index % 7 > 4, 'left-0': index % 7 <= 4 }"
               v-if="isEventFormDisplaying(date)">
            <div class="flex flex-col justify-between min-h-32 w-64 rounded border border-gray-400 p-2 bg-white text-black select-none">
              <div>
                <label class="text-sm mr-2">time</label>
                <select class="appearance-none rounded px-2 py-1 w-12 border border-gray-400 mr-1 bg-white"
                        v-model="form.hour"
                        @change="setFormDateHour">
                  <option v-for="hour in Array.from({ length: 24 }, (v,i) => i)"
                          :key="`hour-${hour}`"
                          :value="hour"
                  >{{ ('0' + hour).slice(-2) }}</option>
                </select>
                <span class="mr-1">:</span>
                <select class="appearance-none rounded px-2 py-1 w-12 border border-gray-400 mr-1 bg-white"
                        v-model="form.minute"
                        @change="setFormDateMinute">
                  <option v-for="minute in Array.from({ length: 12 }, (v,i) => i * 5)"
                          :key="`minute-${minute}`"
                          :value="minute"
                  >{{ ('0' + minute).slice(-2) }}</option>
                </select>
              </div>
              <div>
                <label class="text-sm">title</label>
                <input type="text"
                       class="rounded px-2 py-1 w-full border border-gray-400"
                       v-model="form.title">
              </div>
              <div>
                <label class="text-sm">content</label>
                <textarea rows="2"
                          class="rounded px-2 py-1 w-full border border-gray-400"
                          v-model="form.content"></textarea>
              </div>
              <div class="flex justify-start mt-2">
                <button type="button"
                        class="px-2 py-1 text-sm rounded bg-blue-500 hover:bg-blue-400 text-white cursor-pointer select-none mr-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
                        :disabled="!isValidParams"
                        @click="addEvent">
                  add
                </button>
                <button type="button"
                        class="px-2 py-1 text-sm rounded bg-gray-700 hover:bg-gray-600 text-white cursor-pointer select-none"
                        @click="closeEventForm">
                  close
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-for="event in eventsByDate(date)"
             :key="`event-${event.id}`"
             class="mb-1 text-sm"
             @mouseover="openEventInfo(event)"
             @mouseleave="closeEventInfo">
          <div class="bg-blue-500 text-white h-5 px-1 truncate cursor-default">
            <span class="mr-1 hidden lg:inline">
              {{ `${('0' + event.date.getUTCHours()).slice(-2)}:${('0' + event.date.getUTCMinutes()).slice(-2)}` }}
            </span>
            <span>{{ event.title }}</span>
          </div>

          <div class="relative">
            <div class="absolute top-0"
                 :class="{ 'right-0': index % 7 > 4, 'left-0': index % 7 <= 4 }"
                 v-if="isEventInfoDisplaying(event)">
              <div class="w-64 min-h-32 px-2 py-1 rounded bg-white text-black border border-gray-400">
                <p class="text-sm font-thin mb-1">{{ event.date.toUTCString() }}</p>
                <p class="text-xl font-bold break-all mb-2">{{ event.title }}</p>
                <p class="w-full break-all">{{ event.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import moment from 'moment'
import { v4 as uuid } from 'uuid'

@Component
export default class Calendar extends Vue {
  year: number = this._moment.year()
  month: number = this._moment.month()
  events = [
    { id: uuid(), title: 'AAA', date: new Date(Date.UTC(2020,1,1, 14)), content: "AAA\nBBB" },
    { id: uuid(), title: 'BBB', date: new Date(Date.UTC(2020,1,2, 18)) },
    { id: uuid(), title: 'CCC', date: new Date(Date.UTC(2020,1,3, 12)) },
    { id: uuid(), title: 'DDD', date: new Date(Date.UTC(2020,1,1, 10, 30)) },
    { id: uuid(), title: 'EEE', date: new Date(Date.UTC(2020,1,5, 13)) },
    { id: uuid(), title: 'FFF', date: new Date(Date.UTC(2020,1,1, 19)) },
    { id: uuid(), title: 'GGG', date: new Date(Date.UTC(2020,1,1, 16)) },
    { id: uuid(), title: 'HHH', date: new Date(Date.UTC(2020,1,1, 17)) },
  ]
  eventInfoDisplayingId = null
  eventFormDisplayingDate: Date | null = null
  form: { date: Date; hour: number; minute: number; title: string; content: string } = {
    date: new Date,
    hour: 0,
    minute: 0,
    title: '',
    content: ''
  }

  get eventsByDate() {
    return (date: Date) => {
      return this.events
        .filter(event => event.date.toUTCString().slice(0,16) === date.toUTCString().slice(0,16))
        .sort((a, b): 0 | 1 | -1 => {
          const aHours = a.date.getUTCHours()
          const bHours = b.date.getUTCHours()
          if (aHours > bHours) {
            return 1
          } else if (aHours < bHours) {
            return -1
          } else {
            const aMinutes = a.date.getUTCMinutes()
            const bMinutes = b.date.getUTCMinutes()
            return aMinutes >= bMinutes ? 1 : -1
          }
        })
    }
  }

  get isEventInfoDisplaying(): Function {
    return (event: any): boolean => event.id === this.eventInfoDisplayingId
  }

  get isEventFormDisplaying(): Function {
    return (date: Date): boolean => {
      if (this.eventFormDisplayingDate) {
        return (date.getUTCDate() === this.eventFormDisplayingDate.getUTCDate())
          && (date.getUTCMonth() === this.eventFormDisplayingDate.getUTCMonth())
          && (date.getFullYear() === this.eventFormDisplayingDate.getFullYear())
      } else {
        return false
      }
    }
  }

  get monthDates(): Array<Date> {
    const startOfWeek = this._moment.clone()
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

  get _moment() {
    return moment().utc()
  }

  get dayBgAndTextColor() {
    const today = this._moment.clone().toDate()
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

  openEventInfo(event: any): void {
    this.eventInfoDisplayingId = event.id
  }

  closeEventInfo(): void {
    this.eventInfoDisplayingId = null
  }

  openEventForm(date: Date): void {
    this.eventFormDisplayingDate = date
    this.form.date = new Date(date)
  }

  closeEventForm(): void {
    this.eventFormDisplayingDate = null
    this.form.date = new Date
  }

  setFormDateHour(): void {
    if (this.form.date) {
      this.form.date.setUTCHours(this.form.hour)
    }
  }

  setFormDateMinute(): void {
    if (this.form.date) {
      this.form.date.setUTCMinutes(this.form.minute)
    }
  }

  addEvent(): void {
    if (this.isValidParams) {
      this.events.push({
        id: uuid(),
        date: this.form.date,
        title: this.form.title,
        content: this.form.content,
      })
      this.closeEventForm()
      this.form = {
        date: new Date,
        hour: 0,
        minute: 0,
        title: '',
        content: ''
      }
    }
  }

  get isValidParams(): boolean {
    const params = this.form
    return !!params.date && params.title.length > 0
  }
}
</script>

<style lang="scss">
.w-1\/7 {
  width: 14.285%;
}
.min-h-32 {
  min-height: 8rem;
}
</style>
