<template>
  <div class="mb-4">
    <div class="mb-8" v-if="examParticipations.length > 0">
      <h2>{{ $t("student_course_dashboard.exams_you_participated_in") }}</h2>
      <div class="grid grid-cols-2 gap-4 lg:grid-cols-3" v-if="!firstLoading">
        <EventParticipationPreview
          v-for="participation in examParticipations"
          :key="'exam-participation-' + participation.id"
          :participation="participation"
        ></EventParticipationPreview>
      </div>
      <div class="grid grid-cols-2 gap-4 lg:grid-cols-3" v-else>
        <SkeletonCard class="h-44"></SkeletonCard>
        <SkeletonCard class="h-44"></SkeletonCard>
        <SkeletonCard class="h-44"></SkeletonCard>
      </div>
    </div>

    <div>
      <h2>{{ $t("student_course_dashboard.your_practice_events") }}</h2>
      <div
        class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
        v-if="!firstLoading"
      >
        <div v-if="(currentCourse.unstarted_practice_events?.length ?? 0) > 0">
          <!-- FIXME review shadow - look up all usages of shadow-lg specifically and see if 
        they can all be changed by setting a different value of shadow-box in tailwind config 
        for shadow-lg -->
          <Card
            :hoverable="false"
            :margin-less="true"
            class="relative overflow-hidden text-gray-600 shadow-lg cursor-pointer h-44 bg-light"
            @mousedown="onCardMouseDown"
            @click="onResumePractice(currentCourse.unstarted_practice_events[0])"
          >
            <template v-slot:header>
              <h4 class="text-center opacity-70">
                {{ $t("student_course_dashboard.draft_practice") }}
              </h4>
            </template>
            <template v-slot:body>
              <div class="flex">
                <h1 class="mx-auto mt-1 text-5xl opacity-70 material-icons-outlined">
                  redo
                </h1>
              </div>
            </template>
          </Card>
        </div>
        <Card
          v-else
          :margin-less="true"
          :hoverable="false"
          class="relative overflow-hidden text-gray-600 shadow-lg cursor-pointer h-44 bg-light"
          @mousedown="onCardMouseDown"
          @click="onCreatePractice()"
        >
          <template v-slot:header>
            <h2 class="text-center opacity-70">
              {{ $t("student_course_dashboard.new_practice") }}
            </h2>
          </template>
          <template v-slot:body>
            <div class="flex">
              <h1 class="mx-auto -mt-1 text-5xl opacity-70 material-icons-outlined">
                add_circle_outline
              </h1>
            </div>
          </template>
        </Card>
        <EventParticipationPreview
          v-for="participation in practiceParticipations"
          :key="'practice-participation-' + participation.id"
          :participation="participation"
        ></EventParticipationPreview>
      </div>
      <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4" v-else>
        <SkeletonCard class="h-44"></SkeletonCard>
        <SkeletonCard class="h-44"></SkeletonCard>
        <SkeletonCard class="h-44"></SkeletonCard>
        <SkeletonCard class="h-44"></SkeletonCard>
      </div>
    </div>
    <Dialog
      @no="setEditingEvent(null)"
      @yes="onBeginPractice(editingEvent)"
      :noText="$t('dialog.default_cancel_text')"
      :yesText="$t('practice_template_editor.begin_practice')"
      :large="true"
      :show-dialog="!!editingEvent"
    >
      <template v-slot:title>
        {{
          isResumingUnstartedPractice
            ? $t("student_course_dashboard.resume_practice")
            : $t("student_course_dashboard.new_practice")
        }}
      </template>
      <template v-slot:body>
        <p class="text-muted">
          {{ $t("practice_template_editor.choose_exercises_text") }}
        </p>
        <PracticeTemplateEditor
          class="mt-6"
          v-if="editingEvent"
          :modelValue="editingEvent.template"
        ></PracticeTemplateEditor>
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { courseIdMixin, loadingMixin } from "@/mixins";
import { defineComponent } from "@vue/runtime-core";
import { rippleEffect } from "@/utils";

import { mapGetters, mapActions, mapMutations, mapState } from "vuex";
import EventParticipationPreview from "@/components/student/EventParticipationPreview.vue";
import SkeletonCard from "../../components/ui/SkeletonCard.vue";
import Card from "@/components/ui/Card.vue";
import { Event, getBlankPractice } from "@/models";
import Dialog from "@/components/ui/Dialog.vue";
import PracticeTemplateEditor from "@/components/student/PracticeTemplateEditor.vue";

export default defineComponent({
  components: {
    EventParticipationPreview,
    SkeletonCard,
    Card,
    Dialog,
    PracticeTemplateEditor,
  },
  name: "CourseDashboard",
  mixins: [courseIdMixin, loadingMixin],
  async created() {
    await this.withFirstLoading(async () => {
      await this.getTags(this.courseId);
      await this.getCourse({ courseId: this.courseId });
    });
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions("shared", ["getCourse", "getTags"]),
    ...mapActions("student", ["createEvent"]),
    ...mapMutations("student", ["setEditingEvent"]),
    onCardMouseDown(event: any) {
      rippleEffect(event, "ripple-gray");
    },
    onBeginPractice(event: Event) {
      this.setEditingEvent(null);
      this.$router.push({
        name: "PracticeParticipationPage",
        params: {
          examId: event.id,
        },
      });
    },
    onResumePractice(event: Event) {
      this.setEditingEvent(event);
    },
    async onCreatePractice() {
      if (this.loading) {
        return;
      }
      (this.$store.state as any).shared.loading = true;
      const newPracticeEvent = await this.createEvent({
        courseId: this.courseId,
        event: getBlankPractice(),
      });
      this.setEditingEvent(newPracticeEvent);
      (this.$store.state as any).shared.loading = false;
    },
  },
  computed: {
    ...mapGetters("student", ["examParticipations", "practiceParticipations"]),
    ...mapGetters("shared", ["course"]),
    ...mapState("student", ["editingEvent"]),
    // currentCourse () {
    //   return this.course(this.courseId)
    // },
    isResumingUnstartedPractice(): boolean {
      return (
        this.editingEvent?.id === this.currentCourse.unstarted_practice_events?.[0]?.id
      );
    },
  },
});
</script>

<style></style>
