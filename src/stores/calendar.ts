import Vuex from 'vuex'
import { createModule, mutation, action, extractVuexModule, createProxy } from "vuex-class-component";
import moment from 'moment'

const VuexModule = createModule({
  namespaced: "calendar",
  strict: true,
})

class CalendarStore extends VuexModule {
  private _year: number = CalendarStore.moment.year()
  private _month: number = CalendarStore.moment.month()

  static get moment() {
    return moment().utc()
  }

  get year(): number {
    return this._year
  }

  get month(): number {
    return this._month
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
}

const store = new Vuex.Store({
  modules: {
    ...extractVuexModule(CalendarStore)
  }
})

export default createProxy(store, CalendarStore)
