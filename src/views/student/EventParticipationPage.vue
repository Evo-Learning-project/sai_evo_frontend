<template>
  <div>
    <div
      class="my-4"
      v-for="(slot, index) in proxyModelValue.slots"
      :key="'p-' + proxyModelValue.id + '-s-' + slot.id"
    >
      <h3>{{ $t('event_participation_page.exercise') }} {{ index + 1 }}</h3>
      <AbstractEventParticipationSlot
        :modelValue="slot"
        :allowEditSubmission="true"
      ></AbstractEventParticipationSlot>
    </div>
  </div>
</template>

<script lang="ts">
import AbstractEventParticipationSlot from '@/components/shared/AbstractEventParticipationSlot.vue'
import { courseIdMixin, eventIdMixin } from '@/mixins'
import { EventParticipation } from '@/models'
import { defineComponent } from '@vue/runtime-core'
//import { mapState } from 'vuex'

export default defineComponent({
  components: { AbstractEventParticipationSlot },
  name: 'EventParticipationPage',
  mixins: [courseIdMixin, eventIdMixin],
  async created () {
    await this.$store.dispatch('participateInEvent', {
      courseId: this.courseId,
      eventId: this.eventId
    })
  },
  methods: {
    async onChange (newVal: EventParticipation) {
      console.log(newVal)
    }
  },
  computed: {
    //...mapState(['eventParticipation']),
    proxyModelValue: {
      get (): EventParticipation {
        return this.$store.state.eventParticipation ?? {}
      },
      async set (val: EventParticipation) {
        await this.onChange(val)
      }
    }
  }
})
</script>

<style></style>
