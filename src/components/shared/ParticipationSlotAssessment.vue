<template>
	<div class="sticky mb-auto top-18 md:self-start shadow-elevation card card-filled">
		<!-- call to action to assess -->
		<div
			v-if="!readOnly && assessment.score === null"
			class="mb-2 -mx-5 -mt-4 text-sm rounded-b-none banner banner-danger"
		>
			<div class="flex items-center mx-auto space-x-2">
				<p class="my-auto text-base material-icons-outlined">pending_actions</p>
				<p class="">
					{{ $t("event_assessment.this_exercise_requires_manual_assessment") }}
				</p>
			</div>
		</div>

		<!-- read only part -->
		<div class="w-full" v-if="!writeOnly">
			<div class="flex items-center w-full transition-opacity duration-100">
				<p class="mr-auto text-muted" v-if="assessment.score !== null">
					<span class="mr-1"><slot name="scoreTitle"></slot></span>
					<strong class="text-lg">{{ assessment.score }}</strong>
					<span v-if="maxScore"
						>&nbsp;{{ $t("misc.out_of") }} <strong class="text-lg"> {{ maxScore ?? 0 }}</strong></span
					>
				</p>
				<p class="text-muted" v-else>
					{{ $t("event_assessment.no_score_for_exercise") }}
				</p>
				<div v-if="!readOnly" class="flex items-center ml-1">
					<Btn
						:outline="true"
						:variant="'icon'"
						:size="'sm'"
						:tooltip="expanded ? '' : $t('help_texts.edit_score')"
						:disabled="expanded"
						@click="onShowAssessmentControls()"
						><span class="text-lg icon-light material-icons">edit</span></Btn
					>
					<Btn
						v-if="!readOnly && assessment.score_edited"
						:outline="true"
						class="ml-auto"
						:variant="'icon'"
						:size="'sm'"
						:tooltip="$t('event_assessment.undo_score_edit_tooltip')"
						:disabled="expanded"
						@click="onUndoScoreEdit()"
						><span class="text-lg icon-light material-icons-outlined">undo</span></Btn
					>
				</div>
			</div>
			<!-- teacher comment -->
			<div class="transition-opacity duration-100">
				<p v-if="(assessment.comment?.length ?? 0) > 0" class="mt-2 text-muted">
					{{ !readOnly ? $t("event_assessment.comment_for_student") : $t("misc.teacher_comment") }}:
				</p>
				<p v-html="assessment.comment"></p>
			</div>
		</div>
		<!-- end read-only part -->

		<!-- in-card assessment controls -->
		<div
			:class="{
				'max-h-0': !expanded,
				'max-h-96': expanded,
			}"
			class="flex flex-col overflow-y-hidden duration-200 ease-in-out transition-max-height"
		>
			<div
				:class="{
					'md:flex-row  md:items-center': !isSubSlot,
					'mt-4': !writeOnly,
				}"
				class="flex flex-col ease-in-out"
			>
				<h3>{{ $t("event_assessment.your_assessment") }}</h3>
			</div>

			<!-- actual assessment controls -->
			<div class="mt-4">
				<!-- TODO validate input (e.g. no more than 1 decimal place) -->
				<NumberInput class="mb-4" v-model="scoreProxy" :max="maxScore"
					>{{ $t("event_assessment.assigned_score") }}
					<template #rightHint>/{{ maxScore ?? 0 }}</template>
				</NumberInput>
				<TextEditor class="w-full" v-model="commentProxy">{{ $t("event_assessment.comment_for_student") }}</TextEditor>
			</div>

			<!-- buttons to save or discard changes -->
			<div class="mt-4 ml-auto" v-if="!writeOnly">
				<Btn
					class="mr-2"
					:outline="false"
					:variant="'primary'"
					:loading="loading"
					:disabled="dirtyScore === null || String(dirtyScore ?? '').length === 0"
					@click="onSave()"
				>
					{{ $t("event_assessment.confirm_assessment") }}
				</Btn>
				<Btn :outline="true" :disabled="loading" :variant="'primary'" @click="onHideAssessmentControls()">
					{{ $t("dialog.default_cancel_text") }}
				</Btn>
			</div>
		</div>
		<!-- end in-card assessment controls  -->
	</div>
</template>

<script lang="ts">
import { getTranslatedString as _ } from "@/i18n";
import { EventParticipationSlotAssessment } from "@/models";
import { tupleExpression } from "@babel/types";
import { defineComponent, PropType } from "@vue/runtime-core";
import Btn from "../ui/Btn.vue";
import NumberInput from "../ui/NumberInput.vue";
import TextEditor from "../ui/TextEditor.vue";
export default defineComponent({
	name: "ParticipationSlotAssessment",
	emits: {
		toggleExpanded(value: boolean) {
			return true;
		},
		updateAssessment(payload: [keyof EventParticipationSlotAssessment, any]) {
			return true;
		},
		save(changes: { score: number | null; comment: string }) {
			return true;
		},
	},
	props: {
		assessment: {
			type: Object as PropType<EventParticipationSlotAssessment>,
			required: true,
		},
		readOnly: {
			type: Boolean,
			required: true,
		},
		maxScore: {
			type: Number,
		},
		expanded: {
			type: Boolean,
			default: false,
		},
		writeOnly: {
			type: Boolean,
			default: false,
		},
		loading: {
			type: Boolean,
			default: false,
		},
		isSubSlot: {
			type: Boolean,
			default: false,
		},
	},
	watch: {
		assessment: {
			immediate: true,
			deep: true,
			handler(newVal: EventParticipationSlotAssessment) {
				console.log("PROP CHANGED", newVal);
				this.dirtyComment = newVal.comment ?? "";
				this.dirtyScore = newVal.score ?? null;
			},
		},
	},
	data() {
		return {
			dirtyScore: null as null | number,
			dirtyComment: null as null | string,
		};
	},
	methods: {
		onShowAssessmentControls() {
			this.$emit("toggleExpanded", true);
		},
		onSave() {
			this.$emit("save", {
				comment: this.dirtyComment ?? "",
				score: this.dirtyScore,
			});
		},
		onHideAssessmentControls() {
			this.$emit("toggleExpanded", false);
		},
		onUndoScoreEdit() {
			if (confirm(_("event_assessment.undo_score_edit"))) {
				this.scoreProxy = null;
				this.onSave();
				this.onHideAssessmentControls();
			}
		},
	},
	computed: {
		scoreProxy: {
			get(): number | null {
				return this.dirtyScore ?? 0;
			},
			set(val: any) {
				this.dirtyScore = val;
				this.$emit("updateAssessment", ["score", val]);
			},
		},
		commentProxy: {
			get() {
				return this.dirtyComment ?? "";
			},
			set(val: string) {
				this.dirtyComment = val;
				this.$emit("updateAssessment", ["comment", val]);
			},
		},
	},
	components: { Btn, NumberInput, TextEditor },
});
</script>

<style></style>
