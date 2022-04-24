<template>
  <Card :hoverable="true" :expandSideOnSmall="true">
    <template v-slot:header>
      <div class="flex items-start md:items-center md:px-1.25px px-0.5">
        <span class="mr-2 material-icons-two-tone two-tone-primary">book</span>
        <h3 class="text-base md:text-xl">{{ course.name }}</h3>
        <span
          v-if="course.hidden"
          :title="$t('misc.hidden_to_students')"
          class="my-auto ml-2 text-lg  md:pt-1 opacity-40 material-icons-outlined"
        >
          visibility_off
        </span>
      </div>
    </template>
    <template v-if="true || (course.description?.length ?? 0) > 0" v-slot:body>
      <div class="">
        <div class="flex items-center px-1 mb-1 space-x-1 text-sm">
          <div class="flex items-center space-x-0.5 text-muted">
            <span class="my-auto text-base material-icons light-icon"
              >person</span
            >

            <span class="">{{ $t("misc.teacher") }}:</span>
          </div>
          <p>{{ course.creator?.full_name }}</p>
        </div>
        <p class="text-muted px-1.5" v-html="course.description"></p>
      </div>
      <div class="flex items-stretch px-1 mt-2 md:hidden">
        <router-link
          class="w-full"
          :to="{
            name: 'StudentCourseDashboard',
            params: { courseId: course.id },
          }"
        >
          <Btn class="w-full">
            <span class="mr-0.5 text-base material-icons-outlined">
              chevron_right
            </span>
            <span class="text-sm md:text-base">{{
              $t("courses.go_to_course")
            }}</span>
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
            <span class="text-sm md:text-base">{{
              $t("courses.course_panel")
            }}</span>
          </Btn></router-link
        >
      </div>
    </template>
    <template v-slot:side>
      <div class="flex-col items-stretch hidden space-y-2 md:flex">
        <router-link
          v-if="canAccessCoursePanel"
          :to="{
            name: 'TeacherCourseDashboard',
            params: { courseId: course.id },
          }"
          ><Btn class="w-full">
            <span class="mr-1 text-base material-icons-outlined"> shield </span>
            <span class="text-sm md:text-base">{{
              $t("courses.course_panel")
            }}</span>
          </Btn></router-link
        >
        <router-link
          :to="{
            name: 'StudentCourseDashboard',
            params: { courseId: course.id },
          }"
        >
          <Btn class="w-full">
            <span class="mr-0.5 text-base material-icons-outlined">
              chevron_right
            </span>
            <span class="text-sm md:text-base">{{
              $t("courses.go_to_course")
            }}</span>
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
        this.course.creator?.id === this.$store.state.shared.user?.id ||
        (this.course.privileges?.length ?? 0) > 0
      );
    },
  },
});
</script>

<style></style>
