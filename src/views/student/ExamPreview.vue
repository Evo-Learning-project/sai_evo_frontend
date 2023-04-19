<template>
	<div class="h-full pb-4">
		<div v-if="metaStore.firstLoading" class="mt-4">
			<SlotSkeleton />
			<SlotSkeleton />
		</div>
		<div class="flex flex-col h-full" v-else-if="mainStore.previewingEvent">
			<h2>{{ mainStore.previewingEvent.name }}</h2>
			<div
				v-if="mainStore.previewingEvent.instructions.length > 0"
				class="mb-4 overflow-hidden overflow-ellipsis"
				v-html="mainStore.previewingEvent.instructions"
			/>
			<div class="mt-1 mb-4">
				<div class="flex space-x-1 mb-1" v-if="mainStore.previewingEvent.begin_timestamp">
					<p class="text-muted">{{ $t("event_editor.begin_timestamp") }}:</p>
					<Timestamp :value="mainStore.previewingEvent.begin_timestamp"></Timestamp>
				</div>
				<div class="flex space-x-1" v-if="mainStore.previewingEvent.end_timestamp">
					<p class="text-muted">{{ $t("event_editor.end_timestamp") }}:</p>
					<Timestamp :value="mainStore.previewingEvent.end_timestamp"></Timestamp>
				</div>
				<div
					v-if="
						mainStore.previewingEvent.time_limit_rule === EventTimeLimitRule.TIME_LIMIT
					"
					class="banner banner-light mt-4"
				>
					<span class="material-icons-outlined icon-light">timer</span>
					<div>
						<p>
							{{ $t("event_participation_page.exam_has_time_limit_warning_1") }}
							<strong>{{ timeLimitMinutes }} {{ $t("misc.minutes") }}</strong
							>,
							{{ $t("event_participation_page.exam_has_time_limit_warning_2") }}
						</p>
						<p>{{ $t("event_participation_page.exam_has_time_limit_warning_3") }}</p>
					</div>
				</div>
			</div>
			<div class="mt-auto">
				<!-- scopes banner -->
				<StudentScopesBanner v-if="!metaStore.user.is_teacher" />
				<!-- banner for mat & course input -->
				<div
					class="w-full mb-4 banner banner-danger"
					v-if="
						!metaStore.user.is_teacher &&
						!isDemoMode &&
						(!metaStore.user.mat || !metaStore.user.course)
					"
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
									<span v-if="!metaStore.user.mat && !metaStore.user.course"
										>&nbsp;{{ $t("student_data.and") }}&nbsp;</span
									>
									<span v-if="!metaStore.user.course">{{
										$t("student_data.missing_course")
									}}</span>
								</p>
								<p class="text-danger-dark">
									{{ $t("student_data.insert_mat_and_course") }}
								</p>
							</div>
						</div>
						<div class="flex items-center mt-8 space-x-3">
							<span class="opacity-0 material-icons-outlined"> school </span>
							<div class="flex flex-col w-full">
								<NumberInput class="mb-8 w-96 text-darkText" v-model="dirtyMat"
									>{{ $t("student_data.your_mat") }}
								</NumberInput>
								<RadioGroup
									:options="courseSelectionOptions"
									v-model="dirtyCourse"
									class="text-darkText"
									>{{ $t("student_data.your_course") }}</RadioGroup
								>
								<Btn
									:variant="'primary'"
									:loading="localLoading"
									:disabled="String(dirtyMat).length === 0 || dirtyCourse.length === 0"
									@click="onSaveStudentData"
									class="ml-auto"
								>
									{{ $t("misc.save_and_close") }}
								</Btn>
							</div>
						</div>
					</div>
				</div>
				<!-- alert texts for closed or not-yet-open exams -->
				<p
					class="mb-1 mr-auto text-muted text-danger-dark"
					v-if="mainStore.previewingEvent.state === EventState.PLANNED"
				>
					{{ $t("event_participation_page.exam_not_yet_begun") }}
				</p>
				<p
					class="mb-1 mr-auto text-muted text-danger-dark"
					v-else-if="mainStore.previewingEvent.state === EventState.CLOSED"
				>
					{{ $t("event_participation_page.exam_is_over") }}
				</p>
				<!-- link to participate-->
				<router-link
					v-if="
						canParticipate &&
						(metaStore.user.is_teacher ||
							isDemoMode ||
							(metaStore.user.mat && metaStore.user.course))
					"
					:to="{
						name: 'ExamParticipationPage',
						params: {
							examId: eventId,
						},
					}"
					><Btn :size="'lg'" class="mr-auto"
						><span class="mr-2 text-xl material-icons-outlined"> login </span
						>{{ $t("event_participation_page.participate") }}</Btn
					>
				</router-link>
				<!-- fake button to display when exam isn't open-->
				<Btn v-else :size="'lg'" :disabled="true"
					><span class="mr-2 text-xl material-icons-outlined"> login </span
					>{{ $t("event_participation_page.participate") }}</Btn
				>
			</div>
		</div>
		<!-- <div v-else>error</div> -->
	</div>
</template>

<script lang="ts">
import Btn from "@/components/ui/Btn.vue";
import Timestamp from "@/components/ui/Timestamp.vue";
import { courseIdMixin, eventIdMixin, loadingMixin } from "@/mixins";
import { Event, EventState, EventTimeLimitRule } from "@/models";
import { defineComponent } from "@vue/runtime-core";

import SlotSkeleton from "@/components/ui/skeletons/SlotSkeleton.vue";
import NumberInput from "@/components/ui/NumberInput.vue";
import { courseSelectionOptions } from "@/const";
import RadioGroup from "@/components/ui/RadioGroup.vue";
import { isDemoMode } from "@/utils";
import { mapStores } from "pinia";
import { useMainStore } from "@/stores/mainStore";
import { useMetaStore } from "@/stores/metaStore";
import StudentScopesBanner from "../../integrations/classroom/components/StudentScopesBanner.vue";
export default defineComponent({
	name: "ExamPreview",
	mixins: [courseIdMixin, eventIdMixin, loadingMixin],
	components: {
		Timestamp,
		Btn,
		SlotSkeleton,
		NumberInput,
		RadioGroup,
		StudentScopesBanner,
	},
	async created() {
		await this.withFirstLoading(async () => {
			await this.mainStore.getCourses(); // TODO is this necessary?
			await this.mainStore.getEventPreview({
				courseId: this.courseId,
				eventId: this.eventId,
			});
		});

		this.dirtyCourse = this.metaStore.user.course;
		this.dirtyMat = this.metaStore.user.mat;

		if (this.mainStore.previewingEvent?.participation_exists) {
			this.$router.push({
				name: "ExamParticipationPage",
				params: {
					examId: this.eventId,
				},
			});
		}
	},
	data() {
		return {
			EventState,
			EventTimeLimitRule,
			dirtyMat: "",
			dirtyCourse: "",
			courseSelectionOptions,
		};
	},
	methods: {
		async onSaveStudentData() {
			await this.withLocalLoading(async () =>
				this.metaStore.patchUser({
					userId: this.metaStore.user.id,
					changes: { mat: this.dirtyMat, course: this.dirtyCourse },
				}),
			);
			this.metaStore.showSuccessFeedback();
		},
	},
	computed: {
		...mapStores(useMainStore, useMetaStore),
		timeLimitMinutes() {
			return (
				Math.floor(
					((this.mainStore.previewingEvent?.time_limit_seconds ?? 0) / 60) * 10,
				) / 10
			);
		},
		isDemoMode() {
			return isDemoMode();
		},
		canParticipate() {
			return (
				this.mainStore.previewingEvent?.state !== EventState.PLANNED &&
				this.mainStore.previewingEvent?.state !== EventState.CLOSED
			);
		},
	},
});
</script>

<style></style>
