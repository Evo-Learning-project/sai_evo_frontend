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

import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('shared')

export default defineComponent({
  name: 'CourseList',
  components: {
    CourseListItem
  },
  async created () {
    await this.$store.dispatch('shared/getCourses')
  },
  computed: {
    ...mapState(['courses'])
  }
})
</script>

<style></style>
