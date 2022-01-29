<template>
  <div>EventParticipationPage</div>
</template>

<script lang="ts">
import { courseIdMixin, eventIdMixin } from '@/mixins'
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
  name: 'EventParticipationPage',
  mixins: [courseIdMixin, eventIdMixin],
  computed: {}
})
</script>

<style></style>
