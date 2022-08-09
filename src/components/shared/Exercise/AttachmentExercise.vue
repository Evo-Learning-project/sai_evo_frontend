<template>
	<AbstractExercise v-bind="$props">
		<template #submissionControls>
			<FileUpload
				:disabled="readOnly"
				v-model="attachmentProxy"
				@download="onDownloadAttachment"
			></FileUpload>
		</template>
	</AbstractExercise>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import AbstractExercise from "./AbstractExercise.vue";
import FileUpload from "@/components/ui/FileUpload.vue";
import { exerciseProps } from "./shared";
import { downloadEventParticipationSlotAttachment } from "@/api/events";
import { courseIdMixin, eventIdMixin, loadingMixin } from "@/mixins";
export default defineComponent({
	name: "AttachmentExercise",
	props: {
		...exerciseProps,
	},
	mixins: [loadingMixin, courseIdMixin, eventIdMixin],
	methods: {
		async onDownloadAttachment() {
			const attachment = this.submission.attachment as {
				name: string;
				size: number;
				extras: { slot_id: string; participation_id: string };
			};
			await this.withLoading(
				async () =>
					await downloadEventParticipationSlotAttachment(
						this.courseId,
						this.eventId,
						attachment.extras.participation_id,
						attachment.extras.slot_id,
					),
			);
		},
	},
	computed: {
		attachmentProxy: {
			get() {
				return this.submission.attachment ? [{ ...this.submission.attachment }] : [];
			},
			set(val: any) {
				this.$emit("updateSubmission", ["attachment", val]);
			},
		},
	},
	components: { AbstractExercise, FileUpload },
});
</script>

<style></style>
