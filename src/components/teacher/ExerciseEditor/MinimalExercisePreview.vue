<template>
	<div>
		<div v-if="reduced" class="flex items-center space-x-0.5">
			<p class="font-medium">{{ previewTitle }}</p>
			<Btn
				v-if="previewable"
				:variant="'icon'"
				:outline="true"
				:tooltip="$t('misc.preview')"
				@click="showPreview = true"
				><span style="font-size: 25px !important" class="material-icons-outlined -mb-0.5">
					fullscreen
				</span>
			</Btn>
		</div>
		<div
			v-else
			class="flex flex-col h-full card card-border"
			:class="{
				'card-hoverable hover:border-transparent hover-shadow-elevation': hoverable,
				'outline-success outline-4 border-transparent': highlighted,
				'bg-gray-50 opacity-60': selectionDisabled,
			}"
		>
			<div class="relative">
				<div class="flex items-center mb-3">
					<h4
						class="mr-4"
						:class="{
							'text-muted font-semibold': exercise.label?.length === 0,
						}"
					>
						{{ previewTitle }}
					</h4>
					<Tooltip
						:noArrow="true"
						:placement="'bottom'"
						:textValue="$t('exercise_states.' + exercise.state)"
					>
						<div class="my-auto cursor-default chip chip-sm">
							<div class="flex items-center">
								<MultiIcon class="-ml-1" :icons="exerciseStateIcons"></MultiIcon>
							</div></div
					></Tooltip>
					<Tooltip
						:noArrow="true"
						:placement="'bottom'"
						:textValue="$t('exercise_types.' + exercise.exercise_type)"
					>
						<div class="my-auto cursor-default chip chip-sm">
							<div class="flex items-center">
								<MultiIcon
									class="-ml-1"
									:class="{
										'-ml-1.5  mt-1': exercise.exercise_type === ExerciseType.JS,
									}"
									:icons="exerciseTypeIcons"
								></MultiIcon>
							</div></div
					></Tooltip>
				</div>
				<!-- <div class="overflow-hidden" :style="tagsDivStyle"> -->
				<FadedEdgesScrollableFragment
					class="flex mb-2"
					:id="tagsDivId"
					:style="tagsDivStyle"
				>
					<Tag
						class="mr-1"
						:class="{ 'z-10': index === tags.length - 1 }"
						v-for="(tag, index) in tags"
						:key="elementId + '-tag-' + index"
						:tag="tag"
						:small="true"
					></Tag>
				</FadedEdgesScrollableFragment>
				<!-- </div> -->
			</div>
			<div class="relative overflow-y-hidden h-14" :class="{ 'faded-bottom': applyFade }">
				<ProcessedTextFragment
					:id="elementId"
					style="
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
						overflow: hidden;
					"
					class="w-full overflow-x-hidden overflow-ellipsis text-muted"
					:value="previewText"
				/>
			</div>
			<div class="flex items-center mt-auto ml-auto">
				<Btn
					@click="emitEdit"
					:variant="'icon'"
					:outline="true"
					class="icon-btn-primary"
					v-if="showEdit"
					:tooltip="$t('misc.edit')"
				>
					<span class="text-xl material-icons"> edit </span>
					<!-- {{ $t("event_preview.editor") }} -->
				</Btn>
				<Btn
					class="ml-auto"
					v-if="previewable"
					:variant="'icon'"
					:outline="true"
					:tooltip="$t('misc.preview')"
					@click="showPreview = true"
					><span
						style="font-size: 25px !important"
						class="material-icons-outlined -mb-0.5"
					>
						fullscreen
					</span>
				</Btn>

				<div class="" v-if="selectable">
					<Btn
						v-if="(selectButtonTitle?.length ?? 0) === 0"
						:variant="'icon'"
						:outline="true"
						:tooltip="$t('misc.select')"
						:forceActive="highlighted"
						:disabled="selectionDisabled"
						@click="onSelection()"
						:class="{ 'icon-btn-success': highlighted }"
						><span class="text-lg material-icons-outlined"> done </span></Btn
					>
					<Tooltip v-else :textValue="selectButtonTitle" :placement="'bottom'">
						<Btn
							:variant="'icon'"
							:outline="true"
							:forceActive="highlighted"
							:disabled="selectionDisabled"
							@click="onSelection()"
							><span class="text-lg material-icons-outlined"> done </span></Btn
						>
					</Tooltip>
				</div>
			</div>
		</div>
		<Dialog
			:showDialog="showPreview"
			@yes="showPreview = false"
			:confirmOnly="true"
			:fullWidth="true"
			:dismissible="true"
		>
			<template v-slot:title>{{ $t("misc.exercise_preview_title") }}</template>
			<template v-slot:body>
				<FullExercise :exercise="exercise" :showTags="false"></FullExercise>
			</template>
		</Dialog>
	</div>
</template>

<script lang="ts">
import { getTranslatedString as _ } from "@/i18n";
import { v4 as uuid4 } from "uuid";

import { Exercise, ExerciseState, ExerciseType } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import Tag from "@/components/ui/Tag.vue";
import MultiIcon from "@/components/ui/MultiIcon.vue";
import { icons as exerciseStatesIcons } from "@/assets/exerciseStatesIcons";
import { icons as exerciseTypesIcons } from "@/assets/exerciseTypesIcons";
import Btn from "@/components/ui/Btn.vue";
import Dialog from "@/components/ui/Dialog.vue";
import FullExercise from "@/components/shared/FullExercise.vue";
import { texMixin } from "@/mixins";
import Tooltip from "@/components/ui/Tooltip.vue";
import FadedEdgesScrollableFragment from "@/components/ui/FadedEdgesScrollableFragment.vue";
import { v4 as uuidv4 } from "uuid";
import { logAnalyticsEvent } from "@/utils";
import ProcessedTextFragment from "@/components/ui/ProcessedTextFragment.vue";
export default defineComponent({
	name: "MinimalExercisePreview",
	props: {
		exercise: {
			type: Object as PropType<Exercise>,
			required: true,
		},
		highlighted: {
			type: Boolean,
			default: false,
		},
		selectable: {
			type: Boolean,
			default: true,
		},
		previewable: {
			type: Boolean,
			default: true,
		},
		selectionDisabled: {
			type: Boolean,
			default: false,
		},
		selectButtonTitle: {
			type: String,
			default: "",
		},
		expandable: {
			type: Boolean,
			default: false,
		},
		showTags: {
			type: Boolean,
			default: false,
		},
		hoverable: {
			type: Boolean,
			default: false,
		},
		showEdit: {
			type: Boolean,
			default: false,
		},
		reduced: {
			type: Boolean,
			default: false,
		},
	},
	mixins: [texMixin],
	components: {
		Tag,
		MultiIcon,
		Btn,
		Dialog,
		FullExercise,
		Tooltip,
		FadedEdgesScrollableFragment,
		ProcessedTextFragment,
	},
	created() {
		this.elementId = "a" + uuid4();
		this.tagsDivId = "a" + uuid4();
		this.triggerTexRender();
	},
	mounted() {
		const setWidthFn = () => {
			this.tagsDivWidth =
				document.getElementById(this.tagsDivId)?.parentElement?.clientWidth ?? 0;
		};
		window.addEventListener("resize", setWidthFn);
		setTimeout(setWidthFn, 10);

		// setTimeout(() => {
		// 	const exerciseTextElement = document.getElementById(this.elementId);
		// 	this.applyFade =
		// 		(exerciseTextElement?.scrollHeight ?? 0) >
		// 		(exerciseTextElement?.clientHeight ?? 0);
		// }, 10);
	},
	watch: {
		showPreview(newVal) {
			if (newVal) {
				this.triggerTexRender();
			}
		},
	},
	data() {
		return {
			elementId: "",
			showPreview: false,
			ExerciseType,
			tagsDivId: "",
			tagsDivWidth: 0,
			applyFade: true,
		};
	},
	methods: {
		emitEdit() {
			this.$emit("edit");
			logAnalyticsEvent("editExerciseFromPreview", {});
		},
		onSelection() {
			this.$emit("selection");
		},
	},
	computed: {
		tagsDivStyle() {
			return `width: ${this.tagsDivWidth ?? 508}px`;
		},
		previewTitle(): string {
			return (this.exercise?.label ?? "").trim().length > 0
				? (this.exercise.label as string)
				: _("exercise_preview.unnamed_exercise");
		},
		previewText(): string {
			return this.exercise.text;
		},
		exerciseStateIcons() {
			return exerciseStatesIcons[this.exercise.state as ExerciseState];
		},
		exerciseTypeIcons() {
			return exerciseTypesIcons[this.exercise.exercise_type as ExerciseType];
		},
		tags() {
			return [
				...(this.exercise.public_tags ?? []),
				...(this.exercise.private_tags ?? []),
			];
		},
	},
});
</script>

<style></style>
