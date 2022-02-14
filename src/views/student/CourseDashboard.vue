<template>
  <div>
    <div class="mb-8">
      <h2>{{ $t('student_course_dashboard.exams_you_participated_in') }}</h2>
      <div class="grid grid-cols-3 gap-4" v-if="!firstLoading">
        <!-- TODO distinguish between those still open and those turned in, like "Continua esercitazioni" -->
        <EventParticipationPreview
          v-for="participation in examParticipations"
          :key="'exam-participation-' + participation.id"
          :participation="participation"
        ></EventParticipationPreview>
      </div>
      <div class="grid grid-cols-3 gap-4" v-else>
        <SkeletonCard class="h-44"></SkeletonCard>
        <SkeletonCard class="h-44"></SkeletonCard>
        <SkeletonCard class="h-44"></SkeletonCard>
      </div>
    </div>

    <div>
      <h2>{{ $t('student_course_dashboard.your_practice_events') }}</h2>
    </div>
  </div>
</template>

<script lang="ts">
import { courseIdMixin, loadingMixin } from '@/mixins'
import { defineComponent } from '@vue/runtime-core'

import { createNamespacedHelpers } from 'vuex'
import EventParticipationPreview from '@/components/student/EventParticipationPreview.vue'
import SkeletonCard from '../../components/ui/SkeletonCard.vue'
const { mapActions } = createNamespacedHelpers('shared')
const { mapGetters } = createNamespacedHelpers('student')

export default defineComponent({
  components: { EventParticipationPreview, SkeletonCard },
  name: 'CourseDashboard',
  mixins: [courseIdMixin, loadingMixin],
  async created () {
    this.firstLoading = true
    await this.getCourse({ courseId: this.courseId })
    this.firstLoading = false
  },
  data () {
    return {
      firstLoading: false
    }
  },
  methods: {
    ...mapActions(['getCourse'])
  },
  computed: {
    ...mapGetters(['course', 'examParticipations', 'practiceParticipations']),
    currentCourse () {
      return this.course(this.courseId)
    }
  }
})
</script>

<style></style>
