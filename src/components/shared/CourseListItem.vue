<template>
  <div
    class="flex flex-col px-8 overflow-x-hidden  md:min-h-21rem lg:overflow-x-visible card card-border card-hoverable hover-shadow-elevation hover:border-transparent"
  >
    <div
      style="margin-left: -21px; margin-right: -21px; margin-top: -21px"
      class="
        flex
        items-start
        md:px-1.25px
        px-0.5
        bg-primary-light bg-opacity-0
        -mt-5
        py-6
        rounded-t
      "
    >
      <span
        class="
          pl-4.5
          mr-2
          font-light
          text-2xl
          material-icons-two-tone
          two-tone-primary
        "
        >book</span
      >
      <h3 style="margin-top: 1.5px" class="mb-0 pr-4.5">
        {{ course.name }}
      </h3>
      <Tooltip
        v-if="course.hidden"
        :textCode="'hidden_course'"
        :placement="'bottom'"
        :noArrow="true"
        class="mt-1 ml-1"
      >
        <span
          class="mr-4 text-lg opacity-50  inline-icon icon-light material-icons-outlined"
        >
          visibility_off
        </span>
      </Tooltip>
    </div>
    <div class="mt-1 -ml-1">
      <div class="flex items-center px-1 mb-1 space-x-1 text-sm">
        <div class="flex items-center space-x-0.5 text-muted">
          <span class="my-auto text-xl material-icons-outlined">person</span>
          <span class="">{{ $t("misc.teacher") }}:</span>
        </div>
        <p>{{ course.creator?.full_name }}</p>
      </div>
      <p
        style="line-height: 1.2rem; font-weight: 400; opacity: 0.8"
        class="px-1.5 mt-4 mb-8 text-sm"
        v-html="course.description"
      ></p>
    </div>
    <div class="flex flex-col items-center mt-auto space-y-2">
      <router-link
        class="w-full"
        :to="{
          name: 'StudentCourseDashboard',
          params: { courseId: course.id },
        }"
      >
        <Btn
          :variant="'primary'"
          :outline="true"
          class="w-full whitespace-nowrap"
        >
          <span class="mr-0.5 mt-0.5 text-lg material-icons-outlined">
            chevron_right
          </span>
          <span class="">{{ $t("courses.go_to_course") }}</span>
        </Btn></router-link
      >
      <router-link
        v-if="canAccessCoursePanel"
        class="w-full"
        :to="{
          name: 'TeacherCourseDashboard',
          params: { courseId: course.id },
        }"
        ><Btn :outline="true" class="w-full">
          <span class="mr-1 text-lg material-icons-two-tone two-tone-primary">
            shield
          </span>
          <span class="">{{ $t("courses.course_panel") }}</span>
        </Btn></router-link
      >
    </div>
  </div>
</template>

<script lang="ts">
//import Card from "@/components/ui/Card.vue";
import Btn from "@/components/ui/Btn.vue";
import { Course } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import Tooltip from "../ui/Tooltip.vue";
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
    //Card,
    Btn,
    Tooltip,
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
