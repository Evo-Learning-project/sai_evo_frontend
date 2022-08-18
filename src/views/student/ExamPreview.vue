<template>
	<div class="h-full pb-4">
		<div v-if="firstLoading" class="mt-4">
			<SlotSkeleton></SlotSkeleton>
			<SlotSkeleton></SlotSkeleton>
		</div>
		<div class="flex flex-col h-full" v-else>
			<h2>{{ previewingEvent.name }}</h2>
			<div
				v-if="previewingEvent.instructions.length > 0"
				class="mb-2 overflow-hidden overflow-ellipsis"
				v-html="previewingEvent.instructions"
			></div>
			<div class="mt-1 mb-4 space-y-1 text-sm">
				<div class="flex space-x-1" v-if="previewingEvent.begin_timestamp">
					<p class="text-muted">{{ $t("event_editor.begin_timestamp") }}:</p>
					<Timestamp :value="previewingEvent.begin_timestamp"></Timestamp>
				</div>
				<div class="flex space-x-1" v-if="previewingEvent.end_timestamp">
					<p class="text-muted">{{ $t("event_editor.end_timestamp") }}:</p>
					<Timestamp :value="previewingEvent.end_timestamp"></Timestamp>
				</div>
			</div>
			<div class="mt-auto">
				<div
					class="w-full mb-4 banner banner-danger"
					v-if="!user.is_teacher && (!user.mat || !user.course)"
				>
					<div class="w-full">
						<div class="flex items-center space-x-3">
							<span class="material-icons-outlined text-danger-dark"> school </span>
							<div>
								<p class="font-semibold text-danger-dark">
									{{ $t("student_data.you_havent_yet") }}

									<span v-if="!user.mat">{{ $t("student_data.missing_mat") }}</span>
									<span v-if="!user.mat && !user.course"
										>&nbsp;{{ $t("student_data.and") }}&nbsp;</span
									>
									<span v-if="!user.course">{{ $t("student_data.missing_course") }}</span>
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
				<p
					class="mb-1 mr-auto text-muted text-danger-dark"
					v-if="previewingEvent.state === EventState.PLANNED"
				>
					{{ $t("event_participation_page.exam_not_yet_begun") }}
				</p>
				<p
					class="mb-1 mr-auto text-muted text-danger-dark"
					v-else-if="previewingEvent.state === EventState.CLOSED"
				>
					{{ $t("event_participation_page.exam_is_over") }}
				</p>
				<router-link
					v-if="canParticipate && (user.is_teacher || (user.mat && user.course))"
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
				<Btn v-else :size="'lg'" :disabled="true"
					><span class="mr-2 text-xl material-icons-outlined"> login </span
					>{{ $t("event_participation_page.participate") }}</Btn
				>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Btn from "@/components/ui/Btn.vue";
import Timestamp from "@/components/ui/Timestamp.vue";
import { courseIdMixin, eventIdMixin, loadingMixin } from "@/mixins";
import { Event, EventState } from "@/models";
import { defineComponent } from "@vue/runtime-core";

import { createNamespacedHelpers, mapState, mapActions } from "vuex";
import SlotSkeleton from "@/components/ui/skeletons/SlotSkeleton.vue";
import NumberInput from "@/components/ui/NumberInput.vue";
import { courseSelectionOptions } from "@/const";
import RadioGroup from "@/components/ui/RadioGroup.vue";
export default defineComponent({
	name: "ExamPreview",
	mixins: [courseIdMixin, eventIdMixin, loadingMixin],
	components: {
		Timestamp,
		Btn,
		SlotSkeleton,
		NumberInput,
		RadioGroup,
	},
	async created() {
		await this.withFirstLoading(async () => {
			await this.getCourses();
			await this.getEvent({
				courseId: this.courseId,
				eventId: this.eventId,
			});
		});

		this.dirtyCourse = this.user.course;
		this.dirtyMat = this.user.mat;

		if ((this.previewingEvent as Event).participation_exists) {
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
			dirtyMat: "",
			dirtyCourse: "",
			courseSelectionOptions,
		};
	},
	methods: {
		...mapActions("student", ["getEvent"]),
		...mapActions("shared", ["updateUser", "getCourses"]),
		async onSaveStudentData() {
			await this.withLocalLoading(async () =>
				this.updateUser({
					userId: this.user.id,
					changes: { mat: this.dirtyMat, course: this.dirtyCourse },
				}),
			);
			this.$store.commit("shared/showSuccessFeedback");
		},
	},
	computed: {
		...mapState("student", ["previewingEvent"]),
		...mapState("shared", ["user"]),
		canParticipate(): boolean {
			return (
				this.previewingEvent.state !== EventState.PLANNED &&
				this.previewingEvent.state !== EventState.CLOSED
			);
		},
	},
});
</script>

<style></style>
