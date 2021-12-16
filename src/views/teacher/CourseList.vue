<template>
  <h1>Corsi</h1>
  <course-list-item
    v-for="course in courses"
    :key="'course-' + course.id"
    :course="course"
  ></course-list-item>
</template>

<script lang="ts">
import { Course } from '@/models'
import { defineComponent } from '@vue/runtime-core'
import CourseListItem from '@/components/teacher/CourseListItem.vue'

export default defineComponent({
  name: 'CourseList',
  components: {
    CourseListItem
  },
  computed: {
    courses (): Course[] {
      return [
        {
          id: 'abc',
          name: 'Programmazione e algoritmica',
          description: 'Test description'
        }
      ]
      //return this.$store.getters.courses
    }
  }
})
</script>

<style></style>
