<template>
  <div>
    <CourseListItem
      v-for="course in courses"
      :key="'course-' + course.id"
      :course="course"
    ></CourseListItem>
  </div>
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
  async created () {
    await this.$store.dispatch('getCourses')
  },
  computed: {
    ...mapState(['courses'])
  }
})
</script>

<style></style>
