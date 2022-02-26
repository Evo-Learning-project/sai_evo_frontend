<template>
  <div>
    <div v-if="!firstLoading">
      <CourseListItem
        v-for="course in courses"
        :key="'course-' + course.id"
        :course="course"
      ></CourseListItem>
    </div>
    <div v-else>
      <SkeletonCard></SkeletonCard>
      <SkeletonCard></SkeletonCard>
      <SkeletonCard></SkeletonCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import CourseListItem from '@/components/shared/CourseListItem.vue'

import { createNamespacedHelpers } from 'vuex'
import { loadingMixin } from '@/mixins'
import SkeletonCard from '@/components/ui/SkeletonCard.vue'
const { mapState } = createNamespacedHelpers('shared')

export default defineComponent({
  name: 'CourseList',
  mixins: [loadingMixin],
  components: {
    CourseListItem,
    SkeletonCard
  },
  async created () {
    await this.withFirstLoading(async () =>
      this.$store.dispatch('shared/getCourses')
    )
  },
  computed: {
    ...mapState(['courses'])
  }
})
</script>

<style></style>
