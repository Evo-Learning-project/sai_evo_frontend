<template>
  <Card :hoverable="true" :expandSideOnSmall="true">
    <template v-slot:header>
      <div class="flex md:items-center items-start">
        <span class="mr-2 material-icons-two-tone two-tone-primary">book</span>
        <h3 class="text-base md:text-xl">{{ course.name }}</h3>
      </div>
    </template>
    <template v-if="true || (course.description?.length ?? 0) > 0" v-slot:body>
      <div class="flex items-center px-1">
        <p class="text-sm text-muted" v-html="course.description"></p>
      </div>
      <div class="md:hidden mt-2 flex items-stretch px-1">
        <router-link
          class="w-full"
          :to="{
            name: 'StudentCourseDashboard',
            params: { courseId: course.id },
          }"
        >
          <Btn class="w-full">
            <span class="mr-0.5 text-base material-icons-outlined"> chevron_right </span>
            <span class="text-sm md:text-base">{{ $t("courses.go_to_course") }}</span>
          </Btn></router-link
        >
        <router-link
          v-if="canAccessCoursePanel"
          class="w-full ml-2.5"
          :to="{
            name: 'TeacherCourseDashboard',
            params: { courseId: course.id },
          }"
          ><Btn class="w-full">
            <span class="mr-1 text-base material-icons-outlined"> shield </span>
            <span class="text-sm md:text-base">{{ $t("courses.course_panel") }}</span>
          </Btn></router-link
        >
      </div>
    </template>
    <template v-slot:side>
      <div class="hidden md:flex flex-col items-stretch space-y-2">
        <router-link
          v-if="canAccessCoursePanel"
          :to="{
            name: 'TeacherCourseDashboard',
            params: { courseId: course.id },
          }"
          ><Btn class="w-full">
            <span class="mr-1 text-base material-icons-outlined"> shield </span>
            <span class="text-sm md:text-base">{{ $t("courses.course_panel") }}</span>
          </Btn></router-link
        >
        <router-link
          :to="{
            name: 'StudentCourseDashboard',
            params: { courseId: course.id },
          }"
        >
          <Btn class="w-full">
            <span class="mr-0.5 text-base material-icons-outlined"> chevron_right </span>
            <span class="text-sm md:text-base">{{ $t("courses.go_to_course") }}</span>
          </Btn></router-link
        >
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
import Card from "@/components/ui/Card.vue";
import Btn from "@/components/ui/Btn.vue";
import { Course } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
export default defineComponent({
  name: "CourseListItem",
  props: {
    course: {
      type: Object as PropType<Course>,
      required: true,
    },
  },
  data() {
    return {};
  },
  components: {
    Card,
    Btn,
  },
  computed: {
    canAccessCoursePanel(): boolean {
      return (
        this.course.creator?.id === this.$store.state.user?.id ||
        (this.course.privileges?.length ?? 0) > 0
      );
    },
  },
});
</script>

<style></style>
