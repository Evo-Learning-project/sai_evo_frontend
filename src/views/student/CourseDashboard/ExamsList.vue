<template>
	<div class="mb-4">
		<div class="mb-8" v-if="examParticipations.length > 0">
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
		</div>
		<div v-else>no esami</div>
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
import { Event, EventParticipation, getBlankPractice } from "@/models";
import { getTranslatedString as _ } from "@/i18n";
import { sum } from "lodash";
import { MAX_PRACTICE_EXERCISE_COUNT } from "@/const";

export default defineComponent({
	components: {
		EventParticipationPreview,
		SkeletonCard,
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
			// TODO filter to get exams
			await this.getPracticeEventParticipations({ courseId: this.courseId });
		});
	},
	data() {
		return {
			isEditingRule: false,
			MAX_PRACTICE_EXERCISE_COUNT,
			showNotRecent: false,
			showBookmarkedOnly: false,
			loadingParticipations: new Set<string>(),
		};
	},
	methods: {
		...mapActions("shared", ["getCourse", "getTags"]),
		...mapActions("student", [
			"createEvent",
			"partialUpdateEventParticipation",
			"getPracticeEventParticipations",
		]),
		//...mapActions("teacher", ["partialUpdateEventParticipation"]),
		...mapMutations("student", ["setEditingEvent"]),
	},
	computed: {
		...mapGetters("student", ["examParticipations", "practiceParticipations"]),
		...mapGetters("shared", ["course"]),
		...mapState("student", ["editingEvent"]),
		...mapState("shared", ["tags"]),
	},
});
</script>

<style></style>
