<template>
  <div>
    <div class="flex w-full mb-2">
      <btn @btnClick="onAddExam()" :loading="loading" class="ml-auto"
        ><span class="mr-1 text-base material-icons-outlined">
          add_circle_outline
        </span>
        {{ $t('course_events.new_exam') }}</btn
      >
    </div>
    <div v-if="!firstLoading" class="grid grid-cols-2 gap-4 mt-4">
      <EventEditorPreview
        v-for="(exam, index) in exams"
        :key="exam + '-' + index"
        :event="exam"
      ></EventEditorPreview>
    </div>
    <div class="grid grid-cols-2 gap-4 mt-4" v-else>
      <SkeletonCard :marginLess="true"></SkeletonCard>
      <SkeletonCard :marginLess="true"></SkeletonCard>
      <SkeletonCard :marginLess="true"></SkeletonCard>
      <SkeletonCard :marginLess="true"></SkeletonCard>
      <SkeletonCard :marginLess="true"></SkeletonCard>
      <SkeletonCard :marginLess="true"></SkeletonCard>
    </div>
  </div>
</template>

<script lang="ts">
import EventEditorPreview from '@/components/teacher/EventEditor/EventEditorPreview.vue'
import { Event, getBlankExam } from '@/models'
import Btn from '@/components/ui/Btn.vue'

import { defineComponent } from '@vue/runtime-core'
import { courseIdMixin } from '@/mixins'
import SkeletonCard from '@/components/ui/SkeletonCard.vue'
export default defineComponent({
  components: {
    EventEditorPreview,
    Btn,
    SkeletonCard
  },
  name: 'CourseExams',
  mixins: [courseIdMixin],
  async created () {
    this.firstLoading = true
    await this.$store.dispatch('getEvents', this.courseId)
    this.firstLoading = false
  },
  data () {
    return {
      firstLoading: false,
      loading: false
    }
  },
  methods: {
    async onAddExam () {
      this.loading = true
      const newExam = await this.$store.dispatch('createEvent', {
        courseId: this.courseId,
        event: getBlankExam()
      })
      this.loading = false

      // redirect to exam editor for newly created exam
      this.$router.push({
        name: 'ExamEditor',
        params: { examId: newExam.id }
      })
    }
  },
  computed: {
    exams (): Event[] {
      return this.$store.getters.exams
    }
  }
})
</script>

<style></style>
