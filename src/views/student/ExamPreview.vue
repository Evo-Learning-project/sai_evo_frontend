<template>
  <div class="h-full">
    <div v-if="firstLoading">
      <SkeletonCard :borderLess="true"></SkeletonCard>
      <SkeletonCard :borderLess="true"></SkeletonCard>
    </div>
    <div class="flex flex-col h-full" v-else>
      <h2>{{ event.name }}</h2>
      <div
        v-if="event.instructions.length > 0"
        class="mb-2 overflow-hidden overflow-ellipsis"
        v-html="event.instructions"
      ></div>
      <div class="mt-1 mb-4 space-y-1 text-sm">
        <div class="flex space-x-1" v-if="event.begin_timestamp">
          <p class="text-muted">{{ $t('event_editor.begin_timestamp') }}:</p>
          <Timestamp :value="event.begin_timestamp"></Timestamp>
        </div>
        <div class="flex space-x-1" v-if="event.end_timestamp">
          <p class="text-muted">{{ $t('event_editor.end_timestamp') }}:</p>
          <Timestamp :value="event.end_timestamp"></Timestamp>
        </div>
      </div>
      <div class="mt-auto mr-auto">
        <p
          class="mb-1 text-muted text-danger-dark"
          v-if="event.state === EventState.PLANNED"
        >
          {{ $t('event_participation_page.exam_not_yet_begun') }}
        </p>
        <p
          class="mb-1 text-muted text-danger-dark"
          v-else-if="event.state === EventState.CLOSED"
        >
          {{ $t('event_participation_page.exam_is_over') }}
        </p>
        <router-link
          v-if="canParticipate"
          :to="{
            name: 'ExamParticipationPage',
            params: {
              examId: eventId
            }
          }"
          ><Btn :size="'lg'"
            ><span class="mr-2 text-xl material-icons-outlined"> login </span
            >{{ $t('event_participation_page.participate') }}</Btn
          >
        </router-link>
        <Btn v-else :size="'lg'" :disabled="true"
          ><span class="mr-2 text-xl material-icons-outlined"> login </span
          >{{ $t('event_participation_page.participate') }}</Btn
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Btn from '@/components/ui/Btn.vue'
import SkeletonCard from '@/components/ui/SkeletonCard.vue'
import Timestamp from '@/components/ui/Timestamp.vue'
import { courseIdMixin, eventIdMixin } from '@/mixins'
import { Event, EventState } from '@/models'
import { defineComponent } from '@vue/runtime-core'

import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions } = createNamespacedHelpers('student')
export default defineComponent({
  name: 'ExamPreview',
  mixins: [courseIdMixin, eventIdMixin],
  components: {
    SkeletonCard,
    Timestamp,
    Btn
  },
  async created () {
    this.firstLoading = true
    await this.getEvent({
      courseId: this.courseId,
      eventId: this.eventId
    })
    this.firstLoading = false

    if ((this.event as Event).participation_exists) {
      this.$router.push({
        name: 'ExamParticipationPage',
        params: {
          examId: this.eventId
        }
      })
    }
  },
  data () {
    return {
      firstLoading: false,
      EventState
    }
  },
  methods: {
    ...mapActions(['getEvent'])
  },
  computed: {
    ...mapState(['event']),
    canParticipate (): boolean {
      return (
        this.event.state !== EventState.PLANNED &&
        this.event.state !== EventState.CLOSED
        // TODO check username isn't in users_allowed_past_closure
      )
    }
  }
})
</script>

<style></style>
