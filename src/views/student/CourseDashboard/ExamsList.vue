<template>
	<div class="mb-4">
		<div class="mb-8" v-if="firstLoading || mainStore.examParticipations.length > 0">
			<div class="grid gap-4 xl:gap-8 md:grid-cols-2 lg:grid-cols-3" v-if="!firstLoading">
				<EventParticipationPreview
					v-for="participation in mainStore.examParticipations"
					:key="'exam-participation-' + participation.id"
					:participation="participation"
				/>
			</div>
			<div class="grid grid-cols-1 gap-4 xl:gap-8 lg:grid-cols-3" v-else>
				<SkeletonCard class="h-44" />
				<SkeletonCard class="h-44" />
				<SkeletonCard class="h-44" />
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
import { courseIdMixin, loadingMixin } from "@/mixins";
import { defineComponent } from "@vue/runtime-core";

import EventParticipationPreview from "@/components/student/EventParticipationPreview.vue";
import SkeletonCard from "@/components/ui/SkeletonCard.vue";
import { EventType } from "@/models";
import { getTranslatedString as _ } from "@/i18n";
import { LoadAction } from "@ts-pro/vue-eternal-loading";
import VueEternalLoading from "@ts-pro/vue-eternal-loading/src/components/VueEternalLoading/VueEternalLoading.vue";
import { EventParticipationSearchFilter } from "@/api";
import Spinner from "@/components/ui/Spinner.vue";
import { mapStores } from "pinia";
import { useMainStore } from "@/stores/mainStore";

export default defineComponent({
	components: {
		EventParticipationPreview,
		SkeletonCard,
		VueEternalLoading,
		Spinner,
	},
	name: "ExamList",
	mixins: [courseIdMixin, loadingMixin],
	async created() {
		await this.withFirstLoading(async () => {
			await this.mainStore.getTags({
				// TODO is this necessary?
				courseId: this.courseId,
				includeExerciseCount: true,
			});
			//await this.mainStore.getCourse({ courseId: this.courseId });
			await this.mainStore.getCourseEventParticipations({
				courseId: this.courseId,
				fromFirstPage: true,
				filter: { event_type: EventType.EXAM } as EventParticipationSearchFilter,
			});
		});
	},
	data() {
		return {
			isInitialInfiniteLoad: false,
		};
	},
	methods: {
		async onLoadMore({ loaded, noMore, error }: LoadAction) {
			try {
				const moreResults = await this.mainStore.getCourseEventParticipations({
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
		...mapStores(useMainStore),
	},
});
</script>

<style></style>
