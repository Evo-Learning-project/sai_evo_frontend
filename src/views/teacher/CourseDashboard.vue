<template>
  <div class="mt-4">
    <div>
      <h3>{{ $t('teacher_course_dashboard.recent_exams') }}</h3>
      <div>
        <div v-if="!firstLoading" class="grid grid-cols-3 gap-4 mt-4">
          <EventEditorPreview
            v-for="(exam, index) in recentExams"
            :key="exam + '-' + index"
            :event="exam"
            :buttonIconsOnly="true"
          ></EventEditorPreview>
        </div>
        <div class="grid grid-cols-3 gap-4 mt-4" v-else>
          <EventEditorPreviewSkeleton></EventEditorPreviewSkeleton>
          <EventEditorPreviewSkeleton></EventEditorPreviewSkeleton>
          <EventEditorPreviewSkeleton></EventEditorPreviewSkeleton>
        </div>
        <div class="flex w-full mt-4">
          <router-link class="mx-auto link" :to="{ name: 'CourseExams' }"
            ><Btn :variant="'primary-borderless'">{{
              $t('teacher_course_dashboard.see_all')
            }}</Btn></router-link
          >
        </div>
      </div>
    </div>
    <div class="mt-8">
      <h3>{{ $t('teacher_course_dashboard.recently_edited_exercises') }}</h3>
      <div v-if="!firstLoading" class="grid grid-cols-2 gap-4 mt-4">
        <MinimalExercisePreview
          v-for="exercise in recentExercises"
          :key="'e-' + exercise.id"
          :exercise="exercise"
          :selectable="false"
        ></MinimalExercisePreview>
      </div>
      <div v-else class="grid grid-cols-2 gap-4">
        <MinimalExercisePreviewSkeleton></MinimalExercisePreviewSkeleton>
        <MinimalExercisePreviewSkeleton></MinimalExercisePreviewSkeleton>
        <MinimalExercisePreviewSkeleton></MinimalExercisePreviewSkeleton>
        <MinimalExercisePreviewSkeleton></MinimalExercisePreviewSkeleton>
      </div>
      <div class="flex w-full mt-4">
        <router-link class="mx-auto link" :to="{ name: 'CourseExercises' }"
          ><Btn :variant="'primary-borderless'">{{
            $t('teacher_course_dashboard.see_all')
          }}</Btn></router-link
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters, mapState } = createNamespacedHelpers('teacher')
import { courseIdMixin, coursePrivilegeMixin, loadingMixin } from '@/mixins'
import EventEditorPreview from '@/components/teacher/EventEditor/EventEditorPreview.vue'
import { Event, Exercise } from '@/models'
import MinimalExercisePreview from '@/components/teacher/ExerciseEditor/MinimalExercisePreview.vue'
import Btn from '@/components/ui/Btn.vue'
import EventEditorPreviewSkeleton from '@/components/ui/skeletons/EventEditorPreviewSkeleton.vue'
import MinimalExercisePreviewSkeleton from '@/components/ui/skeletons/MinimalExercisePreviewSkeleton.vue'

export default defineComponent({
  name: 'CourseDashboard',
  components: {
    EventEditorPreview,
    MinimalExercisePreview,
    Btn,
    EventEditorPreviewSkeleton,
    MinimalExercisePreviewSkeleton
  },
  mixins: [courseIdMixin, loadingMixin, coursePrivilegeMixin],
  async created () {
    await this.withFirstLoading(async () => {
      await this.getEvents(this.courseId)
      await this.getExercises({
        courseId: this.courseId,
        fromFirstPage: true
      })
      //await this.getTags(this.courseId)
    })
  },
  methods: {
    ...mapActions(['getExercises', 'getEvents', 'getTags'])
  },
  computed: {
    ...mapGetters(['exams']),
    ...mapState(['exercises']),
    recentExams (): Event[] {
      return this.exams.slice(0, 3)
    },
    recentExercises (): Exercise[] {
      return this.exercises.slice(0, 4)
    }
  }
})
</script>

<style></style>
