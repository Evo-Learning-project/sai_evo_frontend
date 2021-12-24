<template>
  <div class="">
    <event-editor v-model="testExam"></event-editor>
  </div>
</template>

<script lang="ts">
import EventEditor from '@/components/teacher/EventEditor/EventEditor.vue'
import { Event, getBlankExam } from '@/models'
import { defineComponent } from '@vue/runtime-core'
export default defineComponent({
  components: { EventEditor },
  name: 'CourseExams',
  created () {
    this.testExam = getBlankExam()
  },
  data () {
    return {
      testExam: {} as Event
    }
  }
})
</script>

<style></style>
