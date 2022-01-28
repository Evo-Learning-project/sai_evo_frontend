<template>
  <!-- <h1>Corsi</h1> -->
  <CourseListItem
    v-for="course in courses"
    :key="'course-' + course.id"
    :course="course"
  ></CourseListItem>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import CourseListItem from '@/components/shared/CourseListItem.vue'
import { mapState } from 'vuex'

export default defineComponent({
  name: 'CourseList',
  components: {
    CourseListItem
  },
  created () {
    this.$store.dispatch('getCourses')
  },
  computed: {
    ...mapState(['courses'])
  }
})
</script>

<style></style>
