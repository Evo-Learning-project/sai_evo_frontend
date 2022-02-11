<template>
  <Card class="transition-all duration-75 hover:bg-gray-50">
    <template v-slot:header>
      <div class="flex items-center">
        <span class="mr-2 opacity-50 material-icons-outlined"
          >space_dashboard</span
        >
        <h3>{{ course.name }}</h3>
      </div>
    </template>
    <template v-if="course.description?.length > 0" v-slot:body>
      <div class="flex items-center">
        <p class="text-sm text-muted">{{ course.description }}</p>
      </div>
    </template>
    <template v-slot:side>
      <div class="flex flex-col items-stretch space-y-2">
        <router-link
          :to="{ name: 'CourseDashboard', params: { courseId: course.id } }"
          ><Btn v-if="canAccessCoursePanel" class="w-full">
            <span class="mr-1 text-base material-icons-outlined">
              shield
            </span>
            {{ $t('courses.course_panel') }}
          </Btn></router-link
        >
        <Btn>
          <span class="mr-1 text-base material-icons-outlined">
            chevron_right
          </span>
          {{ $t('courses.go_to_course') }}
        </Btn>
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
import Card from '@/components/ui/Card.vue'
import Btn from '@/components/ui/Btn.vue'
import { Course } from '@/models'
import { defineComponent, PropType } from '@vue/runtime-core'
export default defineComponent({
  name: 'CourseListItem',
  props: {
    course: {
      type: Object as PropType<Course>,
      required: true
    }
  },
  data () {
    return {}
  },
  components: {
    Card,
    Btn
  },
  computed: {
    canAccessCoursePanel (): boolean {
      return (
        this.course.creator?.id === this.$store.state.user?.id ||
        (this.course.privileges?.length ?? 0) > 0
      )
    }
  }
})
</script>

<style></style>
