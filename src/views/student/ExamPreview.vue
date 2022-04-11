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
      <div class="mt-auto">
        <div
          class="w-full mb-4 banner banner-danger"
          v-if="!user.is_teacher && !user.mat"
        >
          <div class="w-full">
            <div class="flex items-center space-x-3">
              <span class="material-icons-outlined text-danger-dark">
                school
              </span>
              <div>
                <p class="font-semibold text-danger-dark">
                  {{ $t("mat.missing_mat") }}
                </p>
                <p class="text-danger-dark">
                  {{ $t("mat.insert_your_mat_now") }}
                </p>
              </div>
            </div>
            <div class="flex items-center mt-8 space-x-3">
              <span class="opacity-0 material-icons-outlined"> school </span>
              <NumberInput class="w-96 text-darkText" v-model="dirtyMat"
                >{{ $t("mat.your_mat") }}
              </NumberInput>
              <Btn
                :variant="'icon'"
                :loading="localLoading"
                :disabled="String(dirtyMat).length === 0"
                :outline="true"
                @click="onSaveMat"
              >
                <span
                  class="font-bold material-icons-outlined text-success"
                  style="font-size: 1.25rem"
                >
                  done
                </span>
              </Btn>
            </div>
          </div>
        </div>
        <p
          class="mb-1 mr-auto text-muted text-danger-dark"
          v-if="previewingEvent.state === EventState.PLANNED"
        >
          {{ $t("event_participation_page.exam_not_yet_begun") }}
        </p>
        <p
          class="mb-1 mr-auto text-muted text-danger-dark"
          v-else-if="previewingEvent.state === EventState.CLOSED"
        >
          {{ $t("event_participation_page.exam_is_over") }}
        </p>
        <router-link
          v-if="canParticipate && (user.is_teacher || user.mat)"
          :to="{
            name: 'ExamParticipationPage',
            params: {
              examId: eventId,
            },
          }"
          ><Btn :size="'lg'" class="mr-auto"
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

import { createNamespacedHelpers, mapState, mapActions } from "vuex";
import SlotSkeleton from "@/components/ui/skeletons/SlotSkeleton.vue";
import NumberInput from "@/components/ui/NumberInput.vue";
export default defineComponent({
  name: "ExamPreview",
  mixins: [courseIdMixin, eventIdMixin, loadingMixin],
  components: {
    Timestamp,
    Btn,
    SlotSkeleton,
    NumberInput,
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
      dirtyMat: "",
    };
  },
  methods: {
    ...mapActions("student", ["getEvent"]),
    ...mapActions("shared", ["updateUser"]),
    async onSaveMat() {
      await this.withLocalLoading(async () =>
        this.updateUser({
          userId: this.user.id,
          changes: { mat: this.dirtyMat },
        })
      );
      this.$store.commit("shared/showSuccessFeedback");
    },
  },
  computed: {
    ...mapState("student", ["previewingEvent"]),
    ...mapState("shared", ["user"]),
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
