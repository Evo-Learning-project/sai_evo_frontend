<template>
	<div class="pb-4">
		<div v-if="!firstLoading">
			<CourseSearchFilters class="mb-8" v-model="searchFilters"></CourseSearchFilters>
			<div
				class="mb-4 banner banner-danger"
				v-if="!metaStore.user.is_teacher && !metaStore.user.mat && !isDemoMode"
			>
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
						<NumberInput class="w-96 text-darkText" v-model="dirtyMat">
							{{ $t("student_data.your_mat") }}
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
					@toggleFavorite="onCourseToggleFavorite(course)"
					@enroll="onEnrollChange(course, 'enroll')"
					@unenroll="onEnrollChange(course, 'unenroll')"
				/>
			</div>
		</div>
		<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4" v-else>
			<CourseListItemSkeleton />
			<CourseListItemSkeleton />
			<CourseListItemSkeleton />
			<CourseListItemSkeleton />
			<CourseListItemSkeleton />
			<CourseListItemSkeleton />
			<CourseListItemSkeleton class="2xl:block hidden" />
			<CourseListItemSkeleton class="2xl:block hidden" />
			<CourseListItemSkeleton class="2xl:block hidden" />
			<CourseListItemSkeleton class="2xl:block hidden" />
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
		<Dialog
			:loading="enrollmentLoading"
			:yesText="
				enrollmentLoading
					? $t('misc.wait')
					: enrollmentDialogMode === 'enroll'
					? $t('enrollment.enroll')
					: $t('enrollment.unenroll')
			"
			:noText="$t('dialog.default_cancel_text')"
			:disableOk="enrollmentLoading"
			:showDialog="showBlockingDialog"
			@yes="resolveBlockingDialog(true)"
			@no="resolveBlockingDialog(false)"
			><template v-slot:title v-if="enrollmentDialogMode === 'enroll'">{{
				$t("enrollment.enrollment")
			}}</template>
			<template v-slot:body
				>{{
					enrollmentDialogMode === "enroll"
						? $t("enrollment.do_you_want_to_enroll")
						: $t("enrollment.do_you_want_to_unenroll")
				}}
				<span v-if="selectedCourseForEnrollment">
					{{ selectedCourseForEnrollment.name }}
				</span>
				?</template
			></Dialog
		>
		<v-tour name="demoCourseTour" :steps="demoCourseTourSteps" :options="tourOptions" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import CourseListItem from "@/components/shared/CourseListItem.vue";

import { blockingDialogMixin, loadingMixin } from "@/mixins";
import CourseListItemSkeleton from "@/components/ui/skeletons/CourseListItemSkeleton.vue";
import NumberInput from "@/components/ui/NumberInput.vue";
import Btn from "@/components/ui/Btn.vue";
import { Course } from "@/models";
import { getBlankCourseSearchFilters } from "@/api/utils";
import { CourseSearchFilter } from "@/api/interfaces";
import CourseSearchFilters from "@/components/shared/CourseSearchFilters.vue";
import { demoCourseTourSteps, tourOptions } from "@/const";
import { isDemoMode, setErrorNotification } from "@/utils";
import { mapStores } from "pinia";
import { useMainStore } from "@/stores/mainStore";
import { useMetaStore } from "@/stores/metaStore";
import Dialog from "@/components/ui/Dialog.vue";

const DEMO_COURSES_TOUR_KEY = "courses_tour_taken";

export default defineComponent({
	name: "CourseList",
	mixins: [loadingMixin, blockingDialogMixin],
	components: {
		CourseListItem,
		CourseListItemSkeleton,
		NumberInput,
		Btn,
		CourseSearchFilters,
		Dialog,
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
			enrollmentDialogMode: null as null | "enroll" | "unenroll",
			selectedCourseForEnrollment: null as Course | null,
			enrollmentLoading: false,
		};
	},
	watch: {
		// searchFilters: {
		//   handler(newVal) {},
		//   deep: true,
		// },
	},
	methods: {
		async onEnrollChange(course: Course, mode: "enroll" | "unenroll") {
			this.enrollmentDialogMode = mode;
			this.selectedCourseForEnrollment = course;
			const choice = await this.getBlockingBinaryDialogChoice();
			if (!choice) {
				this.showBlockingDialog = false;
				this.selectedCourseForEnrollment = null;
				this.enrollmentDialogMode = null;
				return;
			}
			try {
				this.enrollmentLoading = true;
				await (this.enrollmentDialogMode === "enroll"
					? this.mainStore.selfEnrollInCourse
					: this.mainStore.selfUnenrollInCourse)({ courseId: course.id });
				this.metaStore.showSuccessFeedback();
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.showBlockingDialog = false;
				this.selectedCourseForEnrollment = null;
				this.enrollmentLoading = false;
				this.enrollmentDialogMode = null;
			}
		},
		async onSaveMat() {
			await this.withLocalLoading(async () =>
				this.metaStore.patchUser({
					userId: this.metaStore.user.id,
					changes: { mat: this.dirtyMat },
				}),
			);
			this.metaStore.showSuccessFeedback();
		},
		async onCourseToggleFavorite(course: Course) {
			const remove = !!course.bookmarked;
			await this.mainStore.bookmarkCourse({ courseId: course.id, remove });
			// TODO if adding a bookmark and courses moves out of view, show some kind of feedback
		},
		sortCourses(courses: Course[]) {
			return courses.sort((a, b) => {
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
			const bookmarkedEnrolledCourses = this.mainStore.courses.filter(
				c => c.bookmarked && c.enrolled,
			);
			const enrolledCourses = this.mainStore.courses.filter(
				c => c.enrolled && !c.bookmarked,
			);
			const bookmarkedCourses = this.mainStore.courses.filter(
				c => c.bookmarked && !c.enrolled,
			);
			const otherCourses = this.mainStore.courses.filter(
				c => !c.bookmarked && !c.enrolled,
			);
			return [
				...this.sortCourses(bookmarkedEnrolledCourses),
				...this.sortCourses(bookmarkedCourses),
				...this.sortCourses(enrolledCourses),
				...this.sortCourses(otherCourses),
			];
		},
	},
});
</script>

<style></style>
