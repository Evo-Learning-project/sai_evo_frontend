<template>
  <div>
    <!--<event-editor v-model="testExam"></event-editor>-->
    <event-editor-preview
      v-for="(exam, index) in exams"
      :key="exam + '-' + index"
      :event="exam"
    ></event-editor-preview>
  </div>
</template>

<script lang="ts">
import EventEditorPreview from '@/components/teacher/EventEditor/EventEditorPreview.vue'
import { Event } from '@/models'
import { defineComponent } from '@vue/runtime-core'
export default defineComponent({
  components: { EventEditorPreview },
  name: 'CourseExams',
  created () {
    this.$store.dispatch('getEvents', this.courseId)
  },
  data () {
    return {
      testExam: {} as Event
    }
  },
  computed: {
    courseId (): string {
      return this.$route.params.courseId as string
    },
    exams (): Event[] {
      return this.$store.getters.exams
    }
  }
})
</script>

<style></style>
