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
  created () {
    this.$store.dispatch('getCourses')
  },
  computed: {
    courses (): Course[] {
      return this.$store.getters.courses

      /*   return [
        {
          id: 'abc',
          name: 'Programmazione e algoritmica',
          description: 'Test description'
        },
        {
          id: 'def',
          name: 'Analisi matematica',
          description: ''
        },
        {
          id: 'ghi',
          name: 'Laboratorio 1',
          description:
            'Test description Test description Test description Test description Test description Test description Test description Test description Test description Test description Test description Test description Test description Test description Test description '
        },
        {
          id: '1',
          name: 'Programmazione e algoritmica',
          description: 'Test description'
        },
        {
          id: '2',
          name: 'Analisi matematica',
          description: ''
        },
        {
          id: '3',
          name: 'Laboratorio 1',
          description:
            'Test description Test description Test description Test description Test description Test description Test description Test description Test description Test description Test description Test description Test description Test description Test description '
        }
      ]*/
    }
  }
})
</script>

<style></style>
