<template>
	<div class="mb-4">
		<div class="mb-8" v-if="firstLoading || mainStore.exams.length > 0">
			<div class="grid gap-4 xl:gap-8 md:grid-cols-2 lg:grid-cols-3" v-if="!firstLoading">
				<ExamCard
					v-for="exam in mainStore.exams"
					:key="'exam-' + exam.id"
					:event="exam"
				/>
			</div>
			<div class="grid grid-cols-1 gap-4 xl:gap-8 lg:grid-cols-3" v-else>
				<SkeletonCard class="h-44" />
				<SkeletonCard class="h-44" />
				<SkeletonCard class="h-44" />
			</div>
			<VueEternalLoading
				v-if="false && !firstLoading"
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
					{{ $t("student_course_dashboard.no_public_exams") }}
				</h2>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { courseIdMixin, loadingMixin } from "@/mixins";
import { defineComponent } from "@vue/runtime-core";

import SkeletonCard from "@/components/ui/SkeletonCard.vue";
import { EventType } from "@/models";
import { getTranslatedString as _ } from "@/i18n";
import { LoadAction } from "@ts-pro/vue-eternal-loading";
import VueEternalLoading from "@ts-pro/vue-eternal-loading/src/components/VueEternalLoading/VueEternalLoading.vue";
import { EventSearchFilter } from "@/api";
import Spinner from "@/components/ui/Spinner.vue";
import { mapStores } from "pinia";
import { useMainStore } from "@/stores/mainStore";
import ExamCard from "../../../components/student/ExamCard.vue";

export default defineComponent({
	components: {
		SkeletonCard,
		VueEternalLoading,
		Spinner,
		ExamCard,
	},
	name: "PublicExamsList",
	mixins: [courseIdMixin, loadingMixin],
	async created() {
		await this.withFirstLoading(
			async () =>
				await this.mainStore.getEvents({
					courseId: this.courseId,
					filters: {
						event_type: EventType.EXAM,
					} as EventSearchFilter,
				}),
		);
	},
	data() {
		return {
			isInitialInfiniteLoad: false,
		};
	},
	methods: {
		async onLoadMore({ loaded, noMore, error }: LoadAction) {
			try {
				// TODO get more exams
				// const moreResults = await this.mainStore.getCourseEventParticipations({
				// 	courseId: this.courseId,
				// 	fromFirstPage: false,
				// 	filter: { event_type: EventType.EXAM } as EventParticipationSearchFilter,
				// });
				// if (!moreResults) {
				// 	noMore();
				// } else {
				// 	loaded();
				// }
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
