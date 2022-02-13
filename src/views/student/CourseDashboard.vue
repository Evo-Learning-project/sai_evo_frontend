<template>
  <div>CourseDashboard</div>
</template>

<script lang="ts">
import { courseIdMixin } from '@/mixins'
import { defineComponent } from '@vue/runtime-core'

import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('shared')

export default defineComponent({
  name: 'CourseDashboard',
  mixins: [courseIdMixin],
  async created () {
    await this.getCourse({ courseId: this.courseId })
  },
  methods: {
    ...mapActions(['getCourse'])
  },
  computed: {
    ...mapGetters(['course']),
    currentCourse () {
      return this.course(this.courseId)
    }
  }
})
</script>

<style></style>
