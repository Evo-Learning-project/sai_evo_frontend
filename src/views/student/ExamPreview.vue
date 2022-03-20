<template>
  <div class="h-full">
    <div v-if="firstLoading" class="mt-4">
      <SlotSkeleton></SlotSkeleton>
      <SlotSkeleton></SlotSkeleton>
    </div>
    <div class="flex flex-col h-full" v-else>
      <h2>{{ previewingEvent.name }}</h2>
      <div
        v-if="previewingEvent.instructions.length > 0"
        class="mb-2 overflow-hidden overflow-ellipsis"
        v-html="previewingEvent.instructions"
      ></div>
      <div class="mt-1 mb-4 space-y-1 text-sm">
        <div class="flex space-x-1" v-if="previewingEvent.begin_timestamp">
          <p class="text-muted">{{ $t("event_editor.begin_timestamp") }}:</p>
          <Timestamp :value="previewingEvent.begin_timestamp"></Timestamp>
        </div>
        <div class="flex space-x-1" v-if="previewingEvent.end_timestamp">
          <p class="text-muted">{{ $t("event_editor.end_timestamp") }}:</p>
          <Timestamp :value="previewingEvent.end_timestamp"></Timestamp>
        </div>
      </div>
      <div class="mt-auto mr-auto">
        <p
          class="mb-1 text-muted text-danger-dark"
          v-if="previewingEvent.state === EventState.PLANNED"
        >
          {{ $t("event_participation_page.exam_not_yet_begun") }}
        </p>
        <p
          class="mb-1 text-muted text-danger-dark"
          v-else-if="previewingEvent.state === EventState.CLOSED"
        >
          {{ $t("event_participation_page.exam_is_over") }}
        </p>
        <router-link
          v-if="canParticipate"
          :to="{
            name: 'ExamParticipationPage',
            params: {
              examId: eventId,
            },
          }"
          ><Btn :size="'lg'"
            ><span class="mr-2 text-xl material-icons-outlined"> login </span
            >{{ $t("event_participation_page.participate") }}</Btn
          >
        </router-link>
        <Btn v-else :size="'lg'" :disabled="true"
          ><span class="mr-2 text-xl material-icons-outlined"> login </span
          >{{ $t("event_participation_page.participate") }}</Btn
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Btn from "@/components/ui/Btn.vue";
import Timestamp from "@/components/ui/Timestamp.vue";
import { courseIdMixin, eventIdMixin, loadingMixin } from "@/mixins";
import { Event, EventState } from "@/models";
import { defineComponent } from "@vue/runtime-core";

import { createNamespacedHelpers } from "vuex";
import SlotSkeleton from "@/components/ui/skeletons/SlotSkeleton.vue";
const { mapState, mapActions } = createNamespacedHelpers("student");
export default defineComponent({
  name: "ExamPreview",
  mixins: [courseIdMixin, eventIdMixin, loadingMixin],
  components: {
    Timestamp,
    Btn,
    SlotSkeleton,
  },
  async created() {
    await this.withFirstLoading(
      async () =>
        await this.getEvent({
          courseId: this.courseId,
          eventId: this.eventId,
        })
    );

    if ((this.previewingEvent as Event).participation_exists) {
      this.$router.push({
        name: "ExamParticipationPage",
        params: {
          examId: this.eventId,
        },
      });
    }
  },
  data() {
    return {
      EventState,
    };
  },
  methods: {
    ...mapActions(["getEvent"]),
  },
  computed: {
    ...mapState(["previewingEvent"]),
    canParticipate(): boolean {
      return (
        this.previewingEvent.state !== EventState.PLANNED &&
        this.previewingEvent.state !== EventState.CLOSED
      );
    },
  },
});
</script>

<style></style>
