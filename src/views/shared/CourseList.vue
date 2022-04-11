<template>
  <div>
    <div v-if="!firstLoading">
      <div class="banner banner-danger" v-if="!user.is_teacher && !user.mat">
        <!-- <span class="material-icons-two-tone two-tone-danger"> school </span> -->
        <div class="w-full">
          <div class="flex items-center space-x-3">
            <span class="material-icons-outlined text-danger-dark">
              school
            </span>
            <div>
              <p class="font-semibold text-danger-dark">
                {{ $t("mat.missing_mat") }}
              </p>
              <p class="text-danger-dark">
                {{ $t("mat.insert_your_mat_now") }}
              </p>
            </div>
          </div>
          <div class="flex items-center mt-8 space-x-3">
            <span class="opacity-0 material-icons-outlined"> school </span>
            <NumberInput class="w-96 text-darkText" v-model="dirtyMat"
              >{{ $t("mat.your_mat") }}
            </NumberInput>
            <Btn
              :variant="'icon'"
              :loading="localLoading"
              :disabled="String(dirtyMat).length === 0"
              :outline="true"
              @click="onSaveMat"
            >
              <span
                class="font-bold material-icons-outlined text-success"
                style="font-size: 1.25rem"
              >
                done
              </span>
            </Btn>
          </div>
        </div>
      </div>
      <CourseListItem
        v-for="course in courses"
        :key="'course-' + course.id"
        :course="course"
        class="my-4"
      ></CourseListItem>
    </div>
    <div class="flex flex-col space-y-4" v-else>
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
      <span
        style="font-size: 5rem"
        class="mr-auto material-icons-outlined opacity-10"
      >
        west
      </span>
      <p
        style="font-size: 10rem"
        class="-mt-12 material-icons-outlined opacity-10"
      >
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
import NumberInput from "@/components/ui/NumberInput.vue";
import Btn from "@/components/ui/Btn.vue";
const { mapState, mapActions } = createNamespacedHelpers("shared");

export default defineComponent({
  name: "CourseList",
  mixins: [loadingMixin],
  components: {
    CourseListItem,
    CourseListItemSkeleton,
    NumberInput,
    Btn,
  },
  async created() {
    await this.withFirstLoading(async () =>
      this.$store.dispatch("shared/getCourses")
    );
  },
  data() {
    return {
      dirtyMat: "",
    };
  },
  methods: {
    ...mapActions(["updateUser"]),
    async onSaveMat() {
      await this.withLocalLoading(async () =>
        this.updateUser({
          userId: this.user.id,
          changes: { mat: this.dirtyMat },
        })
      );
      this.$store.commit("shared/showSuccessFeedback");
    },
  },
  computed: {
    ...mapState(["courses", "user"]),
  },
});
</script>

<style></style>
