<template>
	<div>
		<div class="flex w-full mb-8">
			<Btn
				v-if="firstLoading || hasPrivileges([CoursePrivilege.MANAGE_EVENTS])"
				@click="onAddExam()"
				:loading="localLoading"
				class="ml-auto"
				:disabled="firstLoading"
				><span class="mr-1 text-base material-icons-outlined"> add </span>
				{{ $t("course_events.new_exam") }}</Btn
			>
		</div>
		<div v-if="!firstLoading" class="grid grid-cols-1 gap-4 mt-4 lg:grid-cols-2">
			<EventEditorPreview
				v-for="(exam, index) in mainStore.exams"
				:key="exam + '-' + index"
				:event="exam"
				@close="onCloseExam(exam)"
				@reopen="onReopenExam(exam)"
			></EventEditorPreview>
		</div>
		<div class="grid grid-cols-1 gap-4 mt-4 lg:grid-cols-2" v-else>
			<EventEditorPreviewSkeleton />
			<EventEditorPreviewSkeleton />
			<EventEditorPreviewSkeleton />
			<EventEditorPreviewSkeleton />
			<EventEditorPreviewSkeleton />
			<EventEditorPreviewSkeleton />
		</div>
		<div
			class="flex flex-col w-full text-center select-none mt-9"
			v-if="!firstLoading && mainStore.exams.length === 0"
		>
			<p style="font-size: 10rem" class="material-icons-outlined opacity-10">
				assignment
			</p>
			<h2 class="opacity-40">{{ $t("course_events.no_exams") }}</h2>
		</div>

		<Dialog
			:showDialog="showBlockingDialog"
			@no="resolveBlockingDialog(false)"
			@yes="resolveBlockingDialog(true)"
			:yesText="blockingDialogData?.yesText"
			:noText="blockingDialogData?.noText"
		>
			<template v-slot:title>
				{{ blockingDialogData?.title }}
			</template>
			<template v-slot:body>
				<p>
					{{ blockingDialogData?.text }}
				</p>
			</template>
		</Dialog>
	</div>
</template>

<script lang="ts">
import EventEditorPreview from "@/components/teacher/EventEditor/EventEditorPreview.vue";
import { Event, EventState, CoursePrivilege, getBlankExam, EventType } from "@/models";
import Btn from "@/components/ui/Btn.vue";

import { defineComponent } from "@vue/runtime-core";
import {
	blockingDialogMixin,
	courseIdMixin,
	coursePrivilegeMixin,
	loadingMixin,
} from "@/mixins";
import Dialog from "@/components/ui/Dialog.vue";

import EventEditorPreviewSkeleton from "@/components/ui/skeletons/EventEditorPreviewSkeleton.vue";
import { EventSearchFilter } from "@/api/interfaces";
import { mapStores } from "pinia";
import { useMainStore } from "@/stores/mainStore";
import { DialogData } from "@/interfaces";
import { getTranslatedString as _ } from "@/i18n";
import { useMetaStore } from "@/stores/metaStore";
import { setErrorNotification } from "@/utils";

export default defineComponent({
	components: {
		EventEditorPreview,
		Btn,
		Dialog,
		EventEditorPreviewSkeleton,
	},
	name: "CourseExams",
	mixins: [courseIdMixin, loadingMixin, coursePrivilegeMixin, blockingDialogMixin],
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
			CoursePrivilege,
			buttonLoading: false,
		};
	},
	methods: {
		async onCloseExam(event: Event) {
			this.blockingDialogData = {
				title: _("course_events.close_exam_for_everyone_title"),
				text:
					_("course_events.close_exam_for_everyone_body_1") +
					" " +
					event.name +
					" " +
					_("course_events.close_exam_for_everyone_body_2") +
					". " +
					_("course_events.close_exam_for_everyone_body_3") +
					" " +
					_("event_preview.monitor") +
					".",
				yesText: _("course_events.close_for_everyone"),
				noText: _("dialog.default_cancel_text"),
			};

			const choice = await this.getBlockingBinaryDialogChoice();

			if (!choice) {
				this.showBlockingDialog = false;
				return;
			}

			await this.withLoading(
				async () =>
					await this.mainStore.partialUpdateEvent({
						courseId: this.courseId,
						eventId: event.id,
						mutate: true,
						changes: {
							state: EventState.CLOSED,
							users_allowed_past_closure: [],
						},
					}),
				setErrorNotification,
				() => this.metaStore.showSuccessFeedback(),
			);
			this.showBlockingDialog = false;
		},
		async onReopenExam(event: Event) {
			this.blockingDialogData = {
				title: _("course_events.reopen_exam_title"),
				text: _("course_events.reopen_exam_body") + " " + event.name + "?",
				yesText: _("course_events.reopen_for_everyone"),
				noText: _("dialog.default_cancel_text"),
			};

			const choice = await this.getBlockingBinaryDialogChoice();

			if (!choice) {
				this.showBlockingDialog = false;
				return;
			}

			await this.withLoading(
				async () =>
					await this.mainStore.partialUpdateEvent({
						courseId: this.courseId,
						eventId: event.id,
						mutate: true,
						changes: {
							state: EventState.OPEN,
							users_allowed_past_closure: [],
						},
					}),
				setErrorNotification,
				() => this.metaStore.showSuccessFeedback(),
			);
			this.showBlockingDialog = false;
		},
		async onAddExam() {
			await this.withLocalLoading(async () => {
				const newExam = await this.mainStore.createEvent({
					courseId: this.courseId,
					event: getBlankExam(),
				});
				// redirect to exam editor for newly created exam
				this.$router.push({
					name: "ExamEditor",
					params: { examId: newExam.id },
				});
			});
		},
	},
	computed: {
		...mapStores(useMainStore, useMetaStore),
	},
});
</script>

<style></style>
