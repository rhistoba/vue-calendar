<template>
  <div class="w-full mt-4">
    <CalendarYearMonth class="mb-4"/>
    <CalendarDates class="mb-4"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CalendarYearMonth from '@/components/CalendarYearMonth.vue'
import CalendarDates from '@/components/CalendarDates.vue'

@Component({
  components: {
    CalendarYearMonth,
    CalendarDates
  }
})
export default class Calendar extends Vue {
}
</script>
