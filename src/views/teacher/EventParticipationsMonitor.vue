<template>
  <div>EventParticipationsMonitor</div>
</template>

<script lang="ts">
import { courseIdMixin, eventIdMixin } from '@/mixins'
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
  name: 'EventParticipationsMonitor',
  props: {
    refreshData: {
      type: Boolean,
      default: true
    },
    allowEditParticipations: {
      type: Boolean,
      default: false
    }
  },
  mixins: [courseIdMixin, eventIdMixin]
})
</script>

<style></style>
