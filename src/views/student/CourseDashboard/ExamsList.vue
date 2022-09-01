<template>
	<div class="mb-4">
		<div class="mb-8" v-if="firstLoading || examParticipations.length > 0">
			<div class="grid gap-4 xl:gap-8 md:grid-cols-2 lg:grid-cols-3" v-if="!firstLoading">
				<EventParticipationPreview
					v-for="participation in examParticipations"
					:key="'exam-participation-' + participation.id"
					:participation="participation"
				></EventParticipationPreview>
			</div>
			<div class="grid grid-cols-1 gap-4 xl:gap-8 lg:grid-cols-3" v-else>
				<SkeletonCard class="h-44"></SkeletonCard>
				<SkeletonCard class="h-44"></SkeletonCard>
				<SkeletonCard class="h-44"></SkeletonCard>
			</div>
			<VueEternalLoading
				v-if="!firstLoading"
				:load="onLoadMore"
				class="mt-8"
				v-model:is-initial="isInitialInfiniteLoad"
			>
				<template #loading>
					<Spinner />
				</template>
				<template #no-more>
					&nbsp;
					<!-- <div class="w-full h-1 bg-gray-200 rounded-md"></div> -->
				</template>
			</VueEternalLoading>
		</div>
		<div class="flex h-screen -mt-40" v-else>
			<div class="mx-auto my-auto flex flex-col">
				<p style="font-size: 10rem" class="material-icons-outlined opacity-10 mx-auto">
					assignment
				</p>
				<h2 class="opacity-40 text-center">
					{{ $t("student_course_dashboard.no_exams") }}
				</h2>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { courseIdMixin, loadingMixin } from "@/mixins";
import { defineComponent } from "@vue/runtime-core";

import { mapGetters, mapActions, mapMutations, mapState } from "vuex";
import EventParticipationPreview from "@/components/student/EventParticipationPreview.vue";
import SkeletonCard from "@/components/ui/SkeletonCard.vue";
import { Event, EventParticipation, EventType, getBlankPractice } from "@/models";
import { getTranslatedString as _ } from "@/i18n";
import { sum } from "lodash";
import { MAX_PRACTICE_EXERCISE_COUNT } from "@/const";
import { LoadAction } from "@ts-pro/vue-eternal-loading";
import VueEternalLoading from "@ts-pro/vue-eternal-loading/src/components/VueEternalLoading/VueEternalLoading.vue";
import { EventParticipationSearchFilter } from "@/api";

export default defineComponent({
	components: {
		EventParticipationPreview,
		SkeletonCard,
		VueEternalLoading,
	},
	name: "CourseDashboard",
	mixins: [courseIdMixin, loadingMixin],
	async created() {
		await this.withFirstLoading(async () => {
			await this.getTags({
				courseId: this.courseId,
				includeExerciseCount: true,
			});
			await this.getCourse({ courseId: this.courseId });
			await this.getCourseEventParticipations({
				courseId: this.courseId,
				fromFirstPage: true,
				filter: { event_type: EventType.EXAM } as EventParticipationSearchFilter,
			});
		});
	},
	data() {
		return {
			isEditingRule: false,
			MAX_PRACTICE_EXERCISE_COUNT,
			showNotRecent: false,
			showBookmarkedOnly: false,
			loadingParticipations: new Set<string>(),
			isInitialInfiniteLoad: false,
		};
	},
	methods: {
		...mapActions("shared", ["getCourse", "getTags"]),
		...mapActions("student", [
			"createEvent",
			"partialUpdateEventParticipation",
			"getCourseEventParticipations",
		]),
		...mapMutations("student", ["setEditingEvent"]),
		async onLoadMore({ loaded, noMore, error }: LoadAction) {
			try {
				const moreResults = await this.getCourseEventParticipations({
					courseId: this.courseId,
					fromFirstPage: false,
					filter: { event_type: EventType.EXAM } as EventParticipationSearchFilter,
				});

				if (!moreResults) {
					noMore();
				} else {
					loaded();
				}
			} catch {
				error();
			}
		},
	},
	computed: {
		...mapGetters("student", ["examParticipations"]),
		...mapGetters("shared", ["course"]),
		...mapState("student", ["editingEvent"]),
		...mapState("shared", ["tags"]),
	},
});
</script>

<style></style>
