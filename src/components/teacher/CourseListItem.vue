<template>
  <router-link :to="{ name: 'CourseDashboard', params: { id: course.id } }">
    <Card class="transition-all duration-75 hover:bg-light hover:shadow-md">
      <template v-slot:header>
        <div class="flex items-center">
          <span class="mr-2 opacity-50 material-icons-outlined"
            >space_dashboard</span
          >
          <h3>{{ course.name }}</h3>
          <!-- <btn :size="'sm'"
            ><span class="mr-1 text-sm material-icons-outlined"
              >space_dashboard</span
            >
            Pannello</btn
          > -->
        </div>
      </template>
      <template v-if="course.description?.length > 0" v-slot:body>
        <div class="flex items-center">
          <p class="text-sm text-muted">{{ course.description }}</p>
        </div>
      </template>
    </Card>
  </router-link>
</template>

<script lang="ts">
import Card from '@/components/ui/Card.vue'
// import Btn from '@/components/ui/Btn.vue'
import { Course } from '@/models'
import { defineComponent, PropType } from '@vue/runtime-core'
export default defineComponent({
  name: 'CourseListItem',
  props: {
    course: {
      type: Object as PropType<Course>
    }
  },
  components: {
    Card
    //Btn
  }
})
</script>

<style></style>
