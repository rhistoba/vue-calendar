import Vuex from 'vuex'
import { createModule, mutation, action, extractVuexModule, createProxy } from "vuex-class-component";
import moment from 'moment'
import { Event, EventParams } from '@/types'
import { v4 as uuid } from "uuid"

const VuexModule = createModule({
  namespaced: "calendar",
  strict: true,
})

class CalendarStore extends VuexModule {
  private _year: number = CalendarStore.moment.year()
  private _month: number = CalendarStore.moment.month()
  private _events: Array<Event> = [
    { id: uuid(), title: 'AAA', date: new Date(Date.UTC(2020,1,1, 14)), content: "AAA\nBBB" },
    { id: uuid(), title: 'BBB', date: new Date(Date.UTC(2020,1,2, 18)) },
    { id: uuid(), title: 'CCC', date: new Date(Date.UTC(2020,1,3, 12)) },
    { id: uuid(), title: 'DDD', date: new Date(Date.UTC(2020,1,1, 10, 30)) },
    { id: uuid(), title: 'EEE', date: new Date(Date.UTC(2020,1,5, 13)) },
    { id: uuid(), title: 'FFF', date: new Date(Date.UTC(2020,1,1, 19)) },
    { id: uuid(), title: 'GGG', date: new Date(Date.UTC(2020,1,1, 16)) },
    { id: uuid(), title: 'HHH', date: new Date(Date.UTC(2020,1,1, 17)) },
  ]
  private _eventFormDisplayingDate: Date | null = null

  static get moment() {
    return moment().utc()
  }

  get year(): number {
    return this._year
  }

  get month(): number {
    return this._month
  }

  get today(): Date {
    return CalendarStore.moment.toDate()
  }

  get monthDates(): Array<Date> {
    const startOfWeek = CalendarStore.moment.clone()
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

  get eventsByDate(): Function {
    return (date: Date): Array<Event> => {
      return this._events
        .filter(event => event.date.toUTCString().slice(0,16) === date.toUTCString().slice(0,16))
        .sort((a: Event, b: Event): 0 | 1 | -1 => {
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

  get eventFormDisplayingDate(): Date | null {
    return this._eventFormDisplayingDate
  }

  get isEventFormDisplaying(): Function {
    return (date: Date): boolean => {
      if (this._eventFormDisplayingDate) {
        return (date.getUTCDate() === this._eventFormDisplayingDate.getUTCDate())
          && (date.getUTCMonth() === this._eventFormDisplayingDate.getUTCMonth())
          && (date.getFullYear() === this._eventFormDisplayingDate.getFullYear())
      } else {
        return false
      }
    }
  }

  @action async incrementYear(): Promise<void> {
    this.updateYear(this.year + 1)
  }

  @action async decrementYear(): Promise<void> {
    this.updateYear(this.year - 1)
  }

  @action async incrementMonth(): Promise<void> {
    if (this.month === 11) {
      this.updateYear(this.year + 1)
      this.updateMonth(0)
    } else {
      this.updateMonth(this.month + 1)
    }
  }

  @action async decrementMonth(): Promise<void> {
    if (this.month === 0) {
      this.updateYear(this.year - 1)
      this.updateMonth(11)
    } else {
      this.updateMonth(this.month - 1)
    }
  }

  @action async openEventForm(date: Date): Promise<void> {
    this.updateEventFormDisplayingDate(date)
  }

  @action async closeEventForm(): Promise<void> {
    this.updateEventFormDisplayingDate(null)
  }

  @action async submitEvent(params: EventParams): Promise<void> {
    if (!params.date || params.title.length === 0) return
    if (!params.targetEventId) {
      this.createEvent(params)
    } else {
      this.updateEvent(params)
    }
    this.closeEventForm()
  }

  @mutation updateYear(value: number): void {
    if (1900 <= value && value < 2200) {
      this._year = value
    }
  }

  @mutation updateMonth(value: number): void {
    if (0 <= value && value <= 11) {
      this._month = value
    }
  }

  @mutation updateEventFormDisplayingDate(value: Date | null): void {
    this._eventFormDisplayingDate = value
  }

  @mutation createEvent(params: EventParams): void {
    this._events.push({
      id: uuid(),
      date: params.date,
      title: params.title,
      content: params.content,
    })
  }

  @mutation updateEvent(params: EventParams): void {
    const targetEvent = this._events.find(event => event.id === params.targetEventId)
    if (!targetEvent) return
    targetEvent.date = params.date
    targetEvent.title = params.title
    targetEvent.content = params.content
  }
}

const store = new Vuex.Store({
  modules: {
    ...extractVuexModule(CalendarStore)
  }
})

export default createProxy(store, CalendarStore)
