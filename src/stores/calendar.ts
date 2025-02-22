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
    { id: uuid(), title: 'AAA', date: new Date(Date.UTC(this._year, this._month,1, 14)), content: "AAA\nBBB" },
    { id: uuid(), title: 'BBB', date: new Date(Date.UTC(this._year, this._month,2, 18)) },
    { id: uuid(), title: 'CCC', date: new Date(Date.UTC(this._year, this._month,3, 12)) },
    { id: uuid(), title: 'DDD', date: new Date(Date.UTC(this._year, this._month,1, 10, 30)) },
    { id: uuid(), title: 'EEE', date: new Date(Date.UTC(this._year, this._month,5, 13)) },
    { id: uuid(), title: 'FFF', date: new Date(Date.UTC(this._year, this._month,1, 19)) },
    { id: uuid(), title: 'GGG', date: new Date(Date.UTC(this._year, this._month,1, 16)) },
    { id: uuid(), title: 'HHH', date: new Date(Date.UTC(this._year, this._month,1, 17)) },
  ]
  private _eventFormDisplayingDate: Date | null = null
  private _form: EventParams = {
    targetEventId: null,
    date: new Date(this.today),
    title: '',
    content: '',
  }

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

  get form() {
    return this._form
  }

  get isValidParams(): boolean {
    return !!this.form.date && this.form.title.length > 0
  }

  get formTitle(): string {
    return this.form.title
  }

  set formTitle(value: string) {
    this._form.title = value
  }

  get formContent(): string {
    return this.form.content
  }

  set formContent(value: string) {
    this._form.content = value
  }

  get formDateHour(): number {
    return this.form.date.getUTCHours()
  }

  set formDateHour(value: number) {
    const newDate = new Date(this._form.date)
    newDate.setUTCHours(value)
    this._form.date = newDate
  }

  get formDateMinute(): number {
    return this.form.date.getUTCMinutes()
  }

  set formDateMinute(value: number) {
    const newDate = new Date(this._form.date)
    newDate.setUTCMinutes(value)
    this._form.date = newDate
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

  @action async closeEventForm(): Promise<void> {
    this.updateEventFormDisplayingDate(null)
  }

  @action async submitEvent(): Promise<void> {
    if (!this.isValidParams) return

    if (!this.form.targetEventId) {
      this.createEvent(this.form)
    } else {
      this.updateEvent(this.form)
    }
    this.closeEventForm()
  }

  @action async removeEvent(targetEvent: Event): Promise<void> {
    this.destroyEvent(targetEvent)
  }

  @action async editEvent(targetEvent: Event): Promise<void> {
    const form = {
      targetEventId: targetEvent.id,
      date: new Date(targetEvent.date),
      title: targetEvent.title,
      content: targetEvent.content ? targetEvent.content : '',
    }
    this.updateForm(form)
    this.updateEventFormDisplayingDate(form.date)
  }

  @action async newEvent(date: Date): Promise<void> {
    const form = {
      targetEventId: null,
      date: new Date(date),
      title: '',
      content: '',
    }
    this.updateForm(form)
    this.updateEventFormDisplayingDate(date)
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
    this._eventFormDisplayingDate = value ? new Date(value) : null
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

  @mutation destroyEvent(targetEvent: Event): void {
    this._events = this._events.filter(event => targetEvent.id !== event.id)
  }

  @mutation updateForm(form: EventParams): void {
    this._form = Object.assign({}, form)
  }
}

const store = new Vuex.Store({
  modules: {
    ...extractVuexModule(CalendarStore)
  }
})

export default createProxy(store, CalendarStore)
