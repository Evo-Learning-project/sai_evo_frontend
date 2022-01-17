<template>
  <div class="relative z-10 border-b-2 border-gray-200 bg-light w-max">
    <!-- <div class="z-10 bg-transparent floating-label"> -->
    <date-picker
      class="z-10 bg-transparent calendar-floating-label"
      @open="onOpen()"
      @close="onClose()"
      v-model:value="proxyModelValue"
      type="datetime"
    >
      <template v-slot:icon-calendar
        ><span class="text-base material-icons-outlined">
          calendar_today
        </span>
      </template>
      <template v-slot:icon-clear
        ><span class="text-base material-icons-outlined">
          close
        </span>
      </template>
    </date-picker>
    <!-- </div> -->
    <label
      class="absolute left-1.5 origin-0 -z-1"
      :class="{
        'calendar-fixed-label': proxyModelValue != null || calendarOpen,
        'bottom-1.5': proxyModelValue == null
      }"
    >
      <slot></slot>
    </label>
    <!-- <date-picker v-model:value="time1" type="datetime"></date-picker>
    <date-picker v-model:value="time2" valueType="format"></date-picker>
    <date-picker v-model:value="time3" range></date-picker> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import DatePicker from 'vue-datepicker-next'
import 'vue-datepicker-next/index.css'
export default defineComponent({
  name: 'CalendarInput',
  components: { DatePicker },
  props: ['modelValue'],
  data () {
    return {
      calendarOpen: false
    }
  },
  methods: {
    onOpen () {
      this.calendarOpen = true
    },
    onClose () {
      this.calendarOpen = false
    }
  },
  computed: {
    proxyModelValue: {
      get () {
        return this.modelValue ? new Date(this.modelValue) : null
      },
      set (val: unknown) {
        this.$emit('update:modelValue', val)
      }
    }
  }
})
</script>

<style>
.mx-input-wrapper,
.mx-input {
  background-color: transparent !important;
}
</style>
