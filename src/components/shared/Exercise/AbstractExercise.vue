<template>
	<div>
		<div v-if="showLabel">
			<h3>{{ exerciseTitle }}</h3>
		</div>

		<div
			class="flex flex-wrap items-center mt-1 mb-2.5"
			v-if="showPrivateTags || showPublicTags"
		>
			<Tag
				v-for="tag in tags"
				:key="'tag-' + tag.id + '-slot-' + exercise.id"
				:tag="tag"
				class="mb-0.5 mr-2"
			/>
		</div>

		<slot name="exerciseText">
			<ProcessedTextFragment class="mb-4 user-content" :value="exercise.text" />
		</slot>

		<!-- contains the input controls to answer the exercise
    (e.g. checkboxes, textareas...) -->
		<slot v-if="!readOnly || !$slots.readOnlyAnswer?.()" name="submissionControls"></slot>

		<!-- representation of a read-only answer given to
    the exercise (e.g. a code fragment for a programming exercise) -->
		<!-- TODO create a prop to conditionally hide this, for example in exercise solution threads-->
		<slot v-else name="readOnlyAnswer"></slot>

		<!-- solutions -->
		<div
			class="mt-10"
			v-if="false && showSolution && (exercise.solutions ?? []).length > 0"
		>
			<h4>Soluzioni proposte</h4>
			<ExerciseSolution
				v-for="solution in exercise.solutions"
				:key="'e-' + exercise.id + '-solution-' + solution.id"
				:solution="solution"
			>
				<slot v-bind:solution="solution">
					<div class="w-full whitespace-pre">
						<!-- <p class="ml-2 text-sm text-muted">
              {{ $t("misc.solution") }}
            </p> -->
						<ProcessedTextFragment
							style="white-space: break-spaces"
							class="w-full px-4 py-2 rounded bg-gray-50"
							:value="solution.content"
						></ProcessedTextFragment>
					</div>
				</slot>
			</ExerciseSolution>
		</div>

		<slot name="extras"></slot>
	</div>
</template>

<script lang="ts">
import { Tag as ITag } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import ProcessedTextFragment from "@/components/ui/ProcessedTextFragment.vue";
import { exerciseProps } from "./shared";
import { getExerciseTitle } from "@/utils";
import Tag from "@/components/ui/Tag.vue";
import ExerciseSolution from "../ExerciseSolution/ExerciseSolution.vue";
export default defineComponent({
	name: "AbstractExercise",
	props: {
		...exerciseProps,
	},
	methods: {},
	computed: {
		exerciseTitle(): string {
			return getExerciseTitle(this.exercise);
		},
		tags(): ITag[] {
			return [
				...(this.showPrivateTags ? this.exercise.private_tags ?? [] : []),
				...(this.showPublicTags ? this.exercise.public_tags ?? [] : []),
			];
		},
	},
	components: { ProcessedTextFragment, Tag, ExerciseSolution },
});
</script>

<style></style>
