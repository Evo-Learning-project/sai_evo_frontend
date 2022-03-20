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
      <CourseListItemSkeleton></CourseListItemSkeleton>
      <CourseListItemSkeleton></CourseListItemSkeleton>
      <CourseListItemSkeleton></CourseListItemSkeleton>
      <CourseListItemSkeleton></CourseListItemSkeleton>
      <CourseListItemSkeleton></CourseListItemSkeleton>
    </div>
    <div
      class="flex flex-col w-full text-center select-none mt-28"
      v-if="!firstLoading && courses.length === 0"
    >
      <span style="font-size: 5rem" class="mr-auto material-icons-outlined opacity-10">
        west
      </span>
      <p style="font-size: 10rem" class="-mt-12 material-icons-outlined opacity-10">
        book
      </p>
      <h2 class="opacity-40">{{ $t("course_list.no_courses") }}</h2>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import CourseListItem from "@/components/shared/CourseListItem.vue";

import { createNamespacedHelpers } from "vuex";
import { loadingMixin } from "@/mixins";
import CourseListItemSkeleton from "@/components/ui/skeletons/CourseListItemSkeleton.vue";
const { mapState } = createNamespacedHelpers("shared");

export default defineComponent({
  name: "CourseList",
  mixins: [loadingMixin],
  components: {
    CourseListItem,
    CourseListItemSkeleton,
  },
  async created() {
    await this.withFirstLoading(async () => this.$store.dispatch("shared/getCourses"));
  },
  computed: {
    ...mapState(["courses"]),
  },
});
</script>

<style></style>
