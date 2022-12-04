<template>
	<div class="pb-4">
		<div v-if="!firstLoading">
			<CourseSearchFilters class="mb-8" v-model="searchFilters"></CourseSearchFilters>
			<div
				class="mb-4 banner banner-danger"
				v-if="!metaStore.user.is_teacher && !metaStore.user.mat && !isDemoMode"
			>
				<!-- <span class="material-icons-two-tone two-tone-danger"> school </span> -->
				<div class="w-full">
					<div class="flex items-center space-x-3">
						<span class="material-icons-outlined text-danger-dark"> school </span>
						<div>
							<p class="font-semibold text-danger-dark">
								{{ $t("student_data.you_havent_yet") }}

								<span v-if="!metaStore.user.mat">{{
									$t("student_data.missing_mat")
								}}</span>
							</p>
							<p class="text-danger-dark">
								{{ $t("student_data.insert_mat_and_course") }}
							</p>
						</div>
					</div>
					<div class="flex items-center mt-8 space-x-3">
						<span class="opacity-0 material-icons-outlined"> school </span>
						<NumberInput class="w-96 text-darkText" v-model="dirtyMat"
							>{{ $t("student_data.your_mat") }}
						</NumberInput>
						<Btn
							:variant="'primary'"
							:loading="localLoading"
							:disabled="String(dirtyMat).length === 0"
							@click="onSaveMat"
							class="ml-auto"
						>
							{{ $t("misc.save_and_close") }}
						</Btn>
					</div>
				</div>
			</div>
			<div class="grid gap-4 md:gap-8 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
				<CourseListItem
					v-for="(course, index) in coursesFiltered"
					:key="'course-' + course.id"
					:course="course"
					:id="index === 0 ? 'course-0' : ''"
				></CourseListItem>
			</div>
		</div>
		<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4" v-else>
			<CourseListItemSkeleton />
			<CourseListItemSkeleton />
			<CourseListItemSkeleton />
			<CourseListItemSkeleton />
			<CourseListItemSkeleton />
			<CourseListItemSkeleton />
		</div>
		<div
			class="flex flex-col w-full text-center select-none mt-28"
			v-if="!firstLoading && mainStore.courses.length === 0"
		>
			<span style="font-size: 5rem" class="mr-auto material-icons-outlined opacity-10">
				west
			</span>
			<p style="font-size: 10rem" class="-mt-12 material-icons-outlined opacity-10">
				book
			</p>
			<h2 class="opacity-40">{{ $t("course_list.no_courses") }}</h2>
		</div>
		<div
			class="flex flex-col w-full text-center select-none mt-28"
			v-if="!firstLoading && mainStore.courses.length > 0 && coursesFiltered.length === 0"
		>
			<p style="font-size: 10rem" class="-mt-12 material-icons-outlined opacity-10">
				search_off
			</p>
			<h2 class="opacity-40">
				{{ $t("course_list.no_courses_with_filters") }}
			</h2>
		</div>
		<v-tour
			name="demoCourseTour"
			:steps="demoCourseTourSteps"
			:options="tourOptions"
		></v-tour>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import CourseListItem from "@/components/shared/CourseListItem.vue";

import { loadingMixin } from "@/mixins";
import CourseListItemSkeleton from "@/components/ui/skeletons/CourseListItemSkeleton.vue";
import NumberInput from "@/components/ui/NumberInput.vue";
import Btn from "@/components/ui/Btn.vue";
import { Course } from "@/models";
import { getBlankCourseSearchFilters } from "@/api/utils";
import { CourseSearchFilter } from "@/api/interfaces";
import CourseSearchFilters from "@/components/shared/CourseSearchFilters.vue";
import { demoCourseTourSteps, tourOptions } from "@/const";
import { isDemoMode } from "@/utils";
import { mapStores } from "pinia";
import { useMainStore } from "@/stores/mainStore";
import { useMetaStore } from "@/stores/metaStore";

const DEMO_COURSES_TOUR_KEY = "courses_tour_taken";

export default defineComponent({
	name: "CourseList",
	mixins: [loadingMixin],
	components: {
		CourseListItem,
		CourseListItemSkeleton,
		NumberInput,
		Btn,
		CourseSearchFilters,
	},
	async created() {
		await this.withFirstLoading(async () => this.mainStore.getCourses());
		this.searchFilters.withPrivileges = this.metaStore.user.is_teacher;
		this.searchFilters.hidden = this.metaStore.user.is_teacher;

		if (isDemoMode() && !(DEMO_COURSES_TOUR_KEY in localStorage)) {
			setTimeout(() => ((this as any).$tours["demoCourseTour"] as any).start(), 50);
			localStorage.setItem(DEMO_COURSES_TOUR_KEY, "true");
		}
	},
	data() {
		return {
			dirtyMat: "",
			searchFilters: getBlankCourseSearchFilters(),
			demoCourseTourSteps,
			tourOptions,
		};
	},
	watch: {
		// searchFilters: {
		//   handler(newVal) {},
		//   deep: true,
		// },
	},
	methods: {
		async onSaveMat() {
			await this.withLocalLoading(async () =>
				this.metaStore.patchUser({
					userId: this.metaStore.user.id,
					changes: { mat: this.dirtyMat },
				}),
			);
			this.metaStore.showSuccessFeedback();
		},
	},
	computed: {
		...mapStores(useMainStore, useMetaStore),
		isDemoMode() {
			return isDemoMode();
		},
		coursesFiltered() {
			const filters = this.searchFilters;
			return this.coursesSorted.filter(
				c =>
					(filters.name.length === 0 ||
						c.name.toLowerCase().includes(filters.name.toLowerCase()) ||
						(c.creator?.full_name ?? "")
							.toLowerCase()
							.includes(filters.name.toLowerCase())) &&
					(!filters.withPrivileges || (c.privileges?.length ?? 0) > 0) &&
					(filters.hidden || !c.hidden),
			);
		},
		coursesSorted() {
			return [...this.mainStore.courses].sort((a, b) => {
				if (a.creator?.id == this.metaStore.user.id) {
					// courses the user is creator of go first
					return b.creator?.id == this.metaStore.user.id ? 0 : -1;
				}
				return b.creator?.id == this.metaStore.user.id
					? 1
					: // then come the courses that user has privileges over
					  (b.privileges?.length ?? 0) - (a.privileges?.length ?? 0) ||
							// as a last resort, sort by id
							(a.id < b.id ? -1 : 1);
			});
		},
	},
});
</script>

<style></style>
