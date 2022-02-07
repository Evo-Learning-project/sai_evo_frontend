<template>
  <span>{{ formattedValue }}</span>
</template>

<script lang="ts">
import { getFormattedTimestamp } from '@/utils'
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
  name: 'Timestamp',
  props: {
    value: {
      type: String,
      required: true
    },
    dateOnly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    formattedValue (): string {
      return getFormattedTimestamp(this.value, this.dateOnly)
    }
  }
})
</script>

<style></style>
