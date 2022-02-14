<template>
  <div>
    <div v-if="!firstLoading">
      <!-- TODO add begin/end timestamp and other data -->
      <div
        :class="{
          'pb-0 border-b-0': index === participation.slots.length - 1,
          'px-6 py-2 rounded-md bg-gray-50': true,
          'pb-10': index !== participation.slots.length - 1
        }"
        class=""
        v-for="(slot, index) in participation.slots"
        :key="'p-' + participation.id + '-s-' + slot.id"
      >
        <h4>
          {{ $t('event_participation_page.exercise') }}
          {{ slot.slot_number + 1 }}
        </h4>
        <AbstractEventParticipationSlot
          :modelValue="slot"
        ></AbstractEventParticipationSlot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { courseIdMixin, eventIdMixin, loadingMixin } from '@/mixins'
import { defineComponent } from '@vue/runtime-core'
import AbstractEventParticipationSlot from '@/components/shared/AbstractEventParticipationSlot.vue'

import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions } = createNamespacedHelpers('student')

export default defineComponent({
  name: 'EventParticipationFull',
  mixins: [eventIdMixin, courseIdMixin, loadingMixin],
  props: {
    showScores: {
      type: Boolean,
      default: true
    },
    allowEditScores: {
      type: Boolean,
      default: false
    }
  },
  components: { AbstractEventParticipationSlot },
  async created () {
    this.firstLoading = true
    await this.getEventParticipation({
      courseId: this.courseId,
      eventId: this.eventId,
      participationId: this.participationId
    })
    this.firstLoading = false
  },
  data () {
    return {
      firstLoading: false
    }
  },
  methods: {
    ...mapActions(['getEventParticipation'])
  },
  computed: {
    ...mapState({ participation: 'currentEventParticipation' }),
    participationId (): string {
      return this.$router.currentRoute.value.params.participationId as string
    }
  }
})
</script>

<style></style>
