<template>
	<div class="mb-4">
		<div class="w-full">
			<div class="flex items-center mb-4 -mt-12">
				<Btn
					:class="{ 'opacity-0': firstLoading || practiceParticipations.length <= 3 }"
					:variant="'icon'"
					:outline="true"
					class="ml-auto"
					@click="showBookmarkedOnly = !showBookmarkedOnly"
					:tooltip="
						showBookmarkedOnly
							? $t('student_course_dashboard.show_all_practices')
							: $t('student_course_dashboard.show_bookmarked')
					"
					><span
						:class="[showBookmarkedOnly ? 'material-icons' : 'material-icons-outlined']"
						>bookmarks</span
					></Btn
				>
				<Btn
					:class="{ 'opacity-0': firstLoading || practiceParticipations.length <= 3 }"
					:variant="'icon'"
					:outline="true"
					class=""
					@click="showNotRecent = !showNotRecent"
					:tooltip="
						showNotRecent
							? $t('misc.show_recent')
							: $t('student_course_dashboard.show_all_practices')
					"
					><span :class="[showNotRecent ? 'material-icons' : 'material-icons-outlined']"
						>visibility</span
					></Btn
				>
			</div>

			<div
				class="
					grid grid-cols-1
					gap-4
					xl:gap-8
					md:grid-cols-2
					lg:grid-cols-4
					2xl:grid-cols-5
				"
				v-if="!firstLoading"
			>
				<div v-if="(currentCourse.unstarted_practice_events?.length ?? 0) > 0">
					<Card
						:hoverable="false"
						:margin-less="true"
						class="
							relative
							h-40
							overflow-hidden
							text-gray-600
							cursor-pointer
							md:h-23rem
							elevate-when-pressed
							bg-light
						"
						v-wave
						@click="onResumePractice(currentCourse.unstarted_practice_events[0])"
					>
						<template v-slot:header>
							<div class="absolute w-full transform -translate-x-1/2 left-1/2">
								<h2 class="text-center opacity-70">
									{{ $t("student_course_dashboard.draft_practice") }}
								</h2>
							</div>
						</template>
						<template v-slot:body>
							<div class="flex flex-col h-full">
								<h1 class="mx-auto my-auto text-7xl opacity-70 material-icons-outlined">
									redo
								</h1>
							</div>
						</template>
					</Card>
				</div>
				<Card
					v-else
					:margin-less="true"
					:hoverable="false"
					:filled="true"
					:border-less="true"
					class="
						relative
						overflow-hidden
						text-gray-600
						cursor-pointer
						md:h-23rem
						h-64
						elevate-when-pressed
						bg-light
						hover:bg-gray-200
						transition-all
						duration-300
						ease-in-out
					"
					v-wave
					@click="onCreatePractice()"
				>
					<template v-slot:header>
						<div class="absolute w-full transform -translate-x-1/2 left-1/2">
							<h2 class="text-center opacity-70">
								{{ $t("student_course_dashboard.new_practice") }}
							</h2>
						</div>
					</template>
					<template v-slot:body>
						<div class="flex flex-col h-full">
							<h1 class="mx-auto my-auto text-7xl opacity-70 material-icons-outlined">
								add
							</h1>
						</div>
					</template>
				</Card>
				<EventParticipationPreview
					v-for="participation in filteredPracticeParticipations"
					:key="'practice-participation-' + participation.id"
					:participation="participation"
					@bookmark="onBookmark(participation)"
					:loading="loadingParticipations.has(participation.id)"
				></EventParticipationPreview>
			</div>
			<div
				class="
					mt-4
					w-full
					grid grid-cols-1
					gap-4
					xl:gap-8
					md:grid-cols-2
					lg:grid-cols-4
					2xl:grid-cols-5
				"
				v-else
			>
				<SkeletonCard :full="true" />
				<SkeletonCard :full="true" />
				<SkeletonCard :full="true" />
				<SkeletonCard :full="true" />
			</div>
		</div>
		<Dialog
			@no="setEditingEvent(null)"
			@yes="onBeginPractice(editingEvent)"
			:noText="$t('dialog.default_cancel_text')"
			:yesText="$t('practice_template_editor.begin_practice')"
			:large="(tags?.length ?? 0) > 0"
			:disableOk="
				totalRuleAmount < 1 ||
				totalRuleAmount > MAX_PRACTICE_EXERCISE_COUNT ||
				isEditingRule
			"
			:showDialog="!!editingEvent"
		>
			<template v-slot:title>
				{{
					isResumingUnstartedPractice
						? $t("student_course_dashboard.resume_practice")
						: $t("student_course_dashboard.new_practice")
				}}
			</template>
			<template v-slot:body>
				<p class="mb-4 text-muted">
					{{
						(tags?.length ?? 0) > 0
							? $t("practice_template_editor.choose_tags_text")
							: $t("practice_template_editor.choose_exercises_no_tag_text")
					}}
				</p>
				<PracticeTemplateEditor
					class="mt-6"
					v-if="editingEvent"
					@isEditingRule="isEditingRule = $event"
					:modelValue="editingEvent.template"
				></PracticeTemplateEditor>
				<p
					v-if="totalRuleAmount > MAX_PRACTICE_EXERCISE_COUNT && !isEditingRule"
					class="text-danger-dark"
				>
					{{
						$t("student_course_dashboard.too_many_exercises") +
						" " +
						MAX_PRACTICE_EXERCISE_COUNT +
						"."
					}}
				</p>
			</template>
		</Dialog>
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
import Card from "@/components/ui/Card.vue";
import { Event, EventParticipation, getBlankPractice } from "@/models";
import Dialog from "@/components/ui/Dialog.vue";
import PracticeTemplateEditor from "@/components/student/PracticeTemplateEditor.vue";
import { getTranslatedString as _ } from "@/i18n";
import { sum } from "lodash";
import { MAX_PRACTICE_EXERCISE_COUNT } from "@/const";
import Btn from "@/components/ui/Btn.vue";

export default defineComponent({
	components: {
		EventParticipationPreview,
		SkeletonCard,
		Card,
		Dialog,
		PracticeTemplateEditor,
		Btn,
	},
	name: "PracticeList",
	mixins: [courseIdMixin, loadingMixin],
	async created() {
		await this.withFirstLoading(async () => {
			await this.getTags({
				courseId: this.courseId,
				includeExerciseCount: true,
			});
			await this.getCourse({ courseId: this.courseId });
			// TODO filter to get practice
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

		onBeginPractice(event: Event) {
			this.setEditingEvent(null);
			this.$router.push({
				name: "PracticeParticipationPage",
				params: {
					examId: event.id,
				},
			});
		},
		onResumePractice(event: Event) {
			this.setEditingEvent(event);
		},
		async onBookmark(participation: EventParticipation) {
			try {
				this.loadingParticipations.add(participation.id);
				await this.partialUpdateEventParticipation({
					courseId: this.courseId,
					eventId: participation.event.id,
					participationId: participation.id,
					changes: {
						bookmarked: !(participation.bookmarked ?? false),
					},
				});
			} catch (e) {
				this.setErrorNotification(e);
			} finally {
				this.loadingParticipations.delete(participation.id);
			}
		},
		async onCreatePractice() {
			if (this.loading) {
				return;
			}
			if (this.currentCourse.public_exercises_count === 0) {
				this.setErrorNotification(
					_("student_course_dashboard.no_public_exercises"),
					true,
				);
				return;
			}
			await this.withLoading(async () => {
				const newPracticeEvent = await this.createEvent({
					courseId: this.courseId,
					event: getBlankPractice(),
				});
				this.setEditingEvent(newPracticeEvent);
			});
		},
	},
	computed: {
		...mapGetters("student", ["examParticipations", "practiceParticipations"]),
		...mapGetters("shared", ["course"]),
		...mapState("student", ["editingEvent"]),
		...mapState("shared", ["tags"]),
		filteredPracticeParticipations() {
			return (this.practiceParticipations as EventParticipation[]).filter(
				(p, i) =>
					(this.showNotRecent || i < 3 || (p.bookmarked && this.showBookmarkedOnly)) &&
					(!this.showBookmarkedOnly || p.bookmarked),
			);
		},
		isResumingUnstartedPractice(): boolean {
			return (
				this.editingEvent?.id === this.currentCourse.unstarted_practice_events?.[0]?.id
			);
		},
		totalRuleAmount(): number {
			if (!this.editingEvent) {
				return 0;
			}
			return sum(
				(this.editingEvent as Event).template?.rules.map(r => parseInt(String(r.amount))),
			);
		},
	},
});
</script>

<style></style>
